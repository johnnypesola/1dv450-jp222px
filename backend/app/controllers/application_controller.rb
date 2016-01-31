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
    flash[:notice] = "Access denied. Please log in."
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
    unless logged_in? and current_user.has_role?("Admin")
      access_denied
    end
  end

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
end
