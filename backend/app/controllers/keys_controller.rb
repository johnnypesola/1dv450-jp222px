class KeysController < ApplicationController

  def show

    check_login

  end

  def new

    check_login

    @key = Key.new

  end

  def create

    check_login

    require 'securerandom'

    @key = Key.new(key_params)

    # Generate new random key
    @key.key_value = SecureRandom.hex(32)

    @key.user_id = current_user.id

    if @key.save

      flash[:notice] = "Application key successfully generated."
      redirect_to userkeys_path

    else

      render :action => "new"

    end

  end

  def index



  end

  def destroy

    check_login

    @key = Key.find(destroy_params[:id])

    # Check that user owns the key or is a admin
    if @key.user_id == current_user.id or current_user.has_role?("Admin")

      # Try to delete key
      if @key.destroy
        flash[:notice] = "Application key successfully deleted."
      else
        flash[:notice] = "Could not delete application key."
      end

    else
      flash[:notice] = "You are not the owner of that key."
    end

  end

  private

  def key_params
    params.require(:key).permit(:app_name)
  end

  def destroy_params
    params.permit(:id)
  end

end
