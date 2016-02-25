class ApplicationController < ActionController::Base

  helper_method :current_user, :logged_in?, :access_denied

  # Helper methods
  def current_user

    # If user id exists in session then get user from DB or else set user to nil.
    if session[:user_id]
      @current_user ||= User.find(session[:user_id])
    else
      @current_user = nil
    end

  end

  # Return if user is logged in or not.
  def logged_in?
    current_user != nil
  end

  # Redirect to login with flash message.
  def access_denied
    flash[:danger] = "Access denied. Please log in."
    redirect_to login_path
  end

  # Check user login method
  def check_login
    unless logged_in?
      access_denied
    end
  end

  # Check admin login method
  def check_admin_login

    if logged_in?

      unless current_user.is_admin?

        flash[:danger] = "Access denied. Please log in as Admin."

        redirect_to userkeys_url

      end

    else

      access_denied

    end

  end

  ### REST API specific below

  def check_api_key(key_value)

    if Key.find_by_key_value(key_value).nil?

      redirect_to unauthorized_key_path

      return false

    end

    return true

  end


  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
end
