module RestAuthHelper

  def check_rest_login

    clientuser = Clientuser.try_get_logged_in_user(request.headers)

    if clientuser.nil?

      redirect_to unauthorized_path

      return false

    end

    # Store user in session
    session['logged_in_user'] = clientuser

    return true

  end

end
