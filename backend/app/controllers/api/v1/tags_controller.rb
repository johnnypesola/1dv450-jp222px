class Api::V1::TagsController < Api::ApiBaseController

  def index

    #if check_rest_login && check_api_key(params[:key])

    # Pagination params
    page_num = Integer(params[:page_num]) || 1
    per_page = Integer(params[:per_page]) || 10

    tags = Tag.page(page_num).per(per_page)

    # Add HATEOAS href to objects
    tags.each do |tag|
      tag.href = api_v1_tag_url(tag.id)
    end

    # Render objects
    response.status = 200
    render :json => {
        :items => tags,
        :pagination => generate_pagination_json(page_num, per_page, tags)
    }, methods: [:href]

      #end

  rescue ArgumentError, TypeError

    response.status = 400
    render :json => {
        error: 'Could not get tags.',
        reasons: [ 'Please provide parameters of correct type: (integer)page_num, (integer)per_page' ]
    }

  end

  def show

    #if check_rest_login && check_api_key(params[:key])

    tag = Tag.find(params[:id])

    # Add HATEOAS href to object
    tag.href = api_v1_tag_url(tag.id)

    response.status = 200
    render :json => tag, methods: [:href]

    #end

  end

  def create

    #if check_rest_login && check_api_key(params[:key])

    tag = Tag.new(tag_params)

    if tag.save

      # Add HATEOAS href to object
      tag.href = api_v1_tag_url(tag.id)

      response.status = 201
      render :json => tag, methods: [:href]

    else
      # Save was unsuccessful, probably due to missing values

      errors = Array.new

      tag.errors.full_messages.each do |msg|
        errors.append(msg)
      end

      response.status = 400
      render :json => {
          error: 'Could not save tag.',
          reasons: errors
      }

    end

    #end

  end

  def destroy

    #if check_rest_login && check_api_key(params[:key])

    tag = Tag.find(destroy_params[:id])

    # Try to delete tag
    if tag.destroy

      response.status = 200

      render :nothing => true

    else

      errors = Array.new

      tag.errors.full_messages.each do |msg|
        errors.append(msg)
      end

      response.status = 400

      render :json => {
          error: 'Could not delete tag.',
          reasons: errors
      }

    end

      #end

  rescue ActiveRecord::RecordNotFound

    response.status = 400

    render :json => {
        error: 'Could not delete tag.',
        reasons: [ 'tag not found' ]
    }

  end

  private

  def tag_params
    params.permit(:name)
  end

  def destroy_params
    params.permit(:id)
  end


end
