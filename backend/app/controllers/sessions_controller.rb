class SessionsController < ApplicationController

  def index
  end

  def create
    auth = request.env["omniauth.auth"]

    # Check if users exists in DB, else create user from github data
    clientuser = Clientuser.find_by_provider_and_uid(auth["provider"], auth["uid"]) || Clientuser.create_with_omniauth(auth)

    # Update some specific client user info
    clientuser.update_info(auth)

    # Read back the client callback url from session
    url = session[:client_callback]
    session[:client_callback] = nil
    redirect_to  "#{url}?auth_token=#{clientuser.auth_token}&token_expires=#{Rack::Utils.escape(clientuser.token_expires.to_s)}"
  end

  def destroy



  end

  def authenticate
    session[:client_callback] = params[:callback]
    redirect_to "/auth/github"
  end

  def test

    user = Clientuser.try_get_logged_in_user(request.headers)
    
    if user.nil?
      response.status = 401
      render :nothing => true
    else
      response.status = 200
      render :json => user
    end

  end

end
