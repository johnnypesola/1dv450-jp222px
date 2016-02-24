class Clientuser < ActiveRecord::Base

  def self.create_with_omniauth(provider, uid)
    create! do |clientuser|
      clientuser.provider = provider
      clientuser.uid = uid
    end
  end

end
