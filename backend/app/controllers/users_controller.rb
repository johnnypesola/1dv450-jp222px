class UsersController < ApplicationController

  def index

    check_admin_login

    @users = User.all

  end

  def new

    @user = User.new

  end

  def create

    @user = User.new(user_params)

    if @user.save

      session[:user_id] = @user.id

      redirect_to userkeys_path

    else

      render :action => "new"

    end

  end

  ## Login methods

  def dologin

    user = User.find_by_email(params[:email])

    if user

      if user.authenticate(params[:password])

        session[:user_id] = user.id

        # If user is and admin, redirect to users
        if user.is_admin?

          redirect_to users_url

        # If user is an normal user, redirect to keys.
        else

          redirect_to userkeys_url

        end

      else

        flash[:notice] = "Wrong password, please try again."
        redirect_to login_path

      end

    else

      flash[:notice] = "Could not find a user with the email address: #{params[:email]}"
      redirect_to login_path

    end

  end

  def login



  end

  def dologout

    session[:user_id] = nil

    flash[:notice] = "Successfully logged out."

    redirect_to root_path

  end


  private

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :name)
  end

end
