class Api::V1::LocationsController < Api::ApiBaseController

  def index

    if check_rest_login && check_api_key(params[:key])

      # Pagination params
      page_num = Integer(params[:page_num]) || 1
      per_page = Integer(params[:per_page]) || 10

      # Sort by
      case params[:sort_by]
        when 'name', 'created_at', 'updated_at'
          sort_by = params[:sort_by]
        else
          sort_by = 'name'
      end

      # Sort order
      sort_order = params[:sort_order] == 'asc' ? 'ASC' : 'DESC'

      locations = Location.page(page_num).per(per_page).order(sort_by + ' ' + sort_order)

      # Add HATEOAS href to objects
      locations.each do |location|
        location.href = api_v1_location_url(location.id)
      end

      # Render objects
      response.status = 200
      render :json => {
          :items => locations,
          :pagination => generate_pagination_json(page_num, per_page, locations)
      }, methods: [:href]

    end

    rescue ArgumentError, TypeError

      response.status = 400
      render :json => {
          error: 'Could not get locations.',
          reasons: [ 'Please provide parameters of correct type: (integer)page_num, (integer)per_page' ]
      }

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

  def update

    if check_rest_login && check_api_key(params[:key])

      location = Location.find(location_params[:id])

      if location.update(location_params)

        response.status = 200
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

  end

  def near

    if check_rest_login && check_api_key(params[:key])

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


        # Add HATEOAS href to objects
        locations.each do |location|
          location.href = api_v1_location_url(location.id)
        end

        # Render objects
        response.status = 200
        render :json => locations, methods: [:href]

      end

    end

    rescue ArgumentError, TypeError

      response.status = 400
      render :json => {
          error: 'Could not get locations.',
          reasons: [ 'Please provide parameters of correct type: (float)latitude, (float)longitude, (integer)distance' ]
      }

  end

  def create

    if check_rest_login && check_api_key(params[:key])

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

  end

  def destroy

    if check_rest_login && check_api_key(params[:key])

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

    end

    rescue ActiveRecord::RecordNotFound

    response.status = 400

    render :json => {
        error: 'Could not delete location.',
        reasons: [ 'Location not found' ]
    }

  end

  def search

    if check_rest_login && check_api_key(params[:key])

      # Search string
      search_string = params[:search_string]

      # Pagination params
      page_num = Integer(params[:page_num]) || 1
      per_page = Integer(params[:per_page]) || 10

      # Sort by params
      case params[:sort_by]
        when 'name', 'created_at', 'updated_at'
          sort_by = params[:sort_by]
        else
          sort_by = 'name'
      end

      # Sort order params
      sort_order = params[:sort_order] == 'asc' ? 'ASC' : 'DESC'

      # Check search params
      if search_string.nil?

        response.status = 400
        render :json => {
            error: 'Could not get locations.',
            reasons: [ 'Please provide parameters of correct type: (string)search_string' ]
        }

        return

      else

        # Search after value and apply pagination and order
        locations = Location.where("name LIKE ?", "%#{search_string}%"
        ).page(page_num).per(per_page).order(sort_by + ' ' + sort_order)

        # Add HATEOAS href to objects
        locations.each do |location|
          location.href = api_v1_location_url(location.id)
        end

        # Render objects
        response.status = 200
        render :json => {
            :items => locations,

        }, methods: [:href]

      end

    end

    rescue ArgumentError, TypeError

      response.status = 400
      render :json => {
          error: 'Could not get locations.',
          reasons: [ 'Please provide parameters of correct type: (integer)page_num, (integer)per_page' ]
      }

  end

  private

  def location_params
    params.permit(:latitude, :longitude, :name, :id)
  end

  def destroy_params
    params.permit(:id)
  end

end
