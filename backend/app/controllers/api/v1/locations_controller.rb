class Api::V1::LocationsController < Api::ApiBaseController

  def index

    #if check_rest_login && check_api_key(params[:key])

      locations = Location.all

      # Add HATEOAS href to objects
      locations.each do |location|
        location.href = api_v1_location_url(location.id)
      end

      # Render objects
      response.status = 200
      render :json => locations, methods: [:href]

    #end

  end

  def show

    #if check_rest_login && check_api_key(params[:key])

      location = Location.find(params[:id])

      # Add HATEOAS href to object
      location.href = api_v1_location_url(location.id)

      response.status = 200
      render :json => location, methods: [:href]

    #end

  end

  def near

    #if check_rest_login && check_api_key(params[:key])

      # If user forgot to give latitude or longitude params
      if params[:latitude].nil? || params[:longitude].nil? || params[:distance].nil?

        response.status = 400
        render :json => {
            error: 'Could not get locations.',
            reasons: [ 'Please provide parameters: latitude, longitude, distance (in kilometers)' ]
        }
      else

        latitude = Float(params[:latitude])
        longitude = Float(params[:longitude])
        distance = Integer(params[:distance])

        locations = Location.near([latitude, longitude], distance, :units => :km)

        if locations.nil?

          render :json => {
              error: 'Could not get locations.',
              reasons: [ 'Please provide parameters: latitude, longitude' ]
          }

        else

          # Add HATEOAS href to objects
          locations.each do |location|
            location.href = api_v1_location_url(location.id)
          end

          # Render objects
          response.status = 200
          render :json => locations, methods: [:href]

        end

      end

      rescue ArgumentError

      response.status = 400
      render :json => {
          error: 'Could not get locations.',
          reasons: [ 'Please provide parameters of correct type: (float)latitude, (float)longitude, (integer)distance' ]
      }

    #end

  end

  def create

    #if check_rest_login && check_api_key(params[:key])

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

    #end

  end

  def destroy

    #if check_rest_login && check_api_key(params[:key])

      location = Location.find(destroy_params[:id])

      # Try to delete location
      if location.destroy

        response.status = 200

        render :nothing => true

      else

        errors = Array.new

        location.errors.full_messages.each do |msg|
          errors.append(msg)
        end

        response.status = 400

        render :json => {
            error: 'Could not delete location.',
            reasons: errors
        }

      end

    #end

      rescue ActiveRecord::RecordNotFound

      response.status = 400

      render :json => {
          error: 'Could not delete location.',
          reasons: [ 'Location not found' ]
      }

  end

  private

  def location_params
    params.permit(:latitude, :longitude, :name)
  end

  def destroy_params
    params.permit(:id)
  end

end
