class Api::V1::LocationsController < ApplicationController

  include RestAuthHelper

  def index

    if check_rest_login && check_api_key(params[:key])

      locations = Location.all

      # Add HATEOAS href to objects
      locations.each do |location|
        location.href = api_v1_location_url(location.id)
      end

      # Render objects
      response.status = 200
      render :json => locations, methods: [:href]

    end

  end

  def show

    if check_rest_login && check_api_key(params[:key])

      location = Location.find(params[:id])

      # Add HATEOAS href to object
      location.href = api_v1_location_url(location.id)

      response.status = 200
      render :json => location, methods: [:href]

    end

  end

  def create

    location = Location.new(location_params)

    if location.save

      # Add HATEOAS href to object
      location.href = api_v1_location_url(location.id)

      response.status = 201
      render :json => location, methods: [:href]

    else
      # Save was unsuccessful, probably due to missing values

      errors = Array.new

      location.errors.full_messages.each do |msg|
        errors.append(msg)
      end

      response.status = 400
      render :json => {
          error: 'Could not save location.',
          reasons: errors
      }

    end

  end

  private

  def location_params
    params.require(:user).permit(:email, :password, :password_confirmation, :name)
  end

end
