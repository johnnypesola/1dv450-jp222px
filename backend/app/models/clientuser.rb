class Clientuser < ActiveRecord::Base

  has_many :report

  def self.create_with_omniauth(auth)

    # Create user from github auth info
    create! do |clientuser|

      clientuser.provider = auth["provider"]
      clientuser.uid = auth["uid"]

    end
  end

  def update_info(auth)

    # Update with new info from github auth info
    self.name = auth["info"]["name"] # could be updated (better check when new logins)
    self.token = auth["credentials"]["token"] # github provider token should not give out
    self.auth_token = SecureRandom.urlsafe_base64(nil, false) # generate a access_key for client to call the API
    self.token_expires = Time.now + 2.weeks

    self.save

  end

  def expire
    self.token_expires = Time.now - 2.weeks
    self.save
  end

  def expand_login_time
    self.token_expires = Time.now + 1.day
    self.save
  end


  def has_login_expired?
    self.token_expires < Time.now
  end

  def self.try_get_logged_in_user(headers)

    # check for the headers
    auth_token = headers["X-auth-token"] || nil
    clientuser = nil
    unless auth_token.nil?

      # Check if user exists
      clientuser = Clientuser.find_by_auth_token(auth_token) || nil

    end

    # Return user if user exists and has valid auth session
    unless clientuser.nil? || clientuser.has_login_expired?
      return clientuser
    end

    return nil

  end
end
