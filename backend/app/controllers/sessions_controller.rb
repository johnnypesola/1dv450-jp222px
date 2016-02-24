class SessionsController < ApplicationController

  def index
  end

  def create
    auth = request.env["omniauth.auth"]

    clientuser = Clientuser.find_by_provider_and_uid(auth["provider"], auth["uid"]) || Clientuser.create_with_omniauth(auth["provider"], auth["uid"])

    clientuser.name = auth["info"]["name"] # could be updated (better check when new logins)
    clientuser.token = auth["credentials"]["token"] # github provider token should not give out
    clientuser.auth_token = SecureRandom.urlsafe_base64(nil, false) # generate a access_key for client to call the API
    clientuser.token_expires = Time.now + 1.hour
    clientuser.save

    # read back the session
    url = session[:client_call]
    session[:client_call] = nil
    redirect_to  "#{url}?auth_token=#{clientuser.auth_token}&token_expires=#{Rack::Utils.escape(clientuser.token_expires.to_s)}"
  end

  def destroy



  end

  def authenticate
    session[:client_call] = params[:callback]
    redirect_to "/auth/github"
  end



  # This is just for testing stuff
  def test
    # check for the headers
    auth_token = request.headers["X-auth-token"] || nil
    clientuser = nil
    unless auth_token.nil?
      # should test against expires-date also
      clientuser = Clientuser.find_by_auth_token(auth_token) || nil
    end

    if(clientuser.nil?)
      response.status = 401
      render :nothing => true
    else
      response.status = 200
      render :json => clientuser
    end


  end


end
