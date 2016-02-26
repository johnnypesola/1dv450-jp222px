module RestAuthHelper

  @logged_in_user = ''

  def check_rest_login

    clientuser = Clientuser.try_get_logged_in_user(request.headers)

    if clientuser.nil?

      redirect_to unauthorized_path

      return false

    end

    # Expand login time
    clientuser.expand_login_time

    # Store user in session, for a short period of time
    @logged_in_user = clientuser

    return true

  end

  def get_logged_in_user
    @logged_in_user
  end

end
