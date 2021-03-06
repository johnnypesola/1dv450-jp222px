class Api::V1::TagsController < Api::ApiBaseController

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

      tags = Tag.page(page_num).per(per_page).order(sort_by + ' ' + sort_order)

      # Add HATEOAS href to objects
      tags.each do |tag|
        tag.href = api_v1_tag_url(tag.id)
        tag.reports_href = api_v1_reports_url + '?for_tag=' + tag.id.to_s
      end

      # Render objects
      response.status = 200
      render :json => {
          :items => tags,
          :pagination => generate_pagination_json(page_num, per_page, tags, api_v1_tags_url)
      }, methods: [:href, :reports_href]

    end

    rescue ArgumentError, TypeError

      response.status = 400
      render :json => {
          error: 'Could not get tags.',
          reasons: [ 'Please provide parameters of correct type: (integer)page_num, (integer)per_page' ]
      }

  end

  def show

    if check_rest_login && check_api_key(params[:key])

      tag = Tag.find(params[:id])

      # Add HATEOAS href to object
      tag.href = api_v1_tag_url(tag.id)
      tag.reports_href = api_v1_reports_url + '?for_tag=' + tag.id.to_s

      response.status = 200
      render :json => {
          :items => [tag]
      }, methods: [:href, :reports_href]

    end

  end

  def update

    if check_rest_login && check_api_key(params[:key])

      tag = Tag.find(tag_params[:id])

      if tag.update(tag_params)

        response.status = 200
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

    end

  end

  def create

    if check_rest_login && check_api_key(params[:key])

    tag = Tag.new(tag_params)

      if tag.save

        # Add HATEOAS href to object
        tag.href = api_v1_tag_url(tag.id)

        response.status = 201
        render :json => {
            :items => [tag],
        }, methods: [:href]

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

    end

  end

  def destroy

    if check_rest_login && check_api_key(params[:key])

      tag = Tag.find(destroy_params[:id])

      # There can be no reports that has this location
      if tag.reports.count != 0

        response.status = 406
        render :json => {
            error: 'Could not delete tag.',
            reasons: [ "The tag has #{tag.reports.count} reports associated with it" ]
        }

      else

        # Try to delete tag
        if tag.destroy

          response.status = 200

          render :json => {
              :items => [tag]
          }

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

      end

    end

    rescue ActiveRecord::RecordNotFound

      response.status = 400

      render :json => {
          error: 'Could not delete tag.',
          reasons: [ 'tag not found' ]
      }

  end

  def reports

    if check_rest_login && check_api_key(params[:key])

      # Pagination params
      page_num = Integer(params[:page_num]) || 1
      per_page = Integer(params[:per_page]) || 10

      # Sort by
      case params[:sort_by]
        when 'route_grade', 'route_name', 'created_at', 'updated_at'
          sort_by = params[:sort_by]
        else
          sort_by = 'created_at'
      end

      # Sort order
      sort_order = params[:sort_order] == 'asc' ? 'ASC' : 'DESC'

      # Get tag
      tag = Tag.find(params[:id])

      # Get user
      user = get_logged_in_user

      # Get reports
      reports = tag.reports.page(page_num).per(per_page).order(sort_by + ' ' + sort_order).includes(:tags).where(clientuser_id: user.id)

      if reports.length == 0

        response.status = 404
        render :json => {
            error: 'Could not get reports.',
            reasons: [ 'No reports with the specified tag id could be found' ]
        }

        return

      end

      # Add HATEOAS href to objects
      reports.each do |report|
        report.href = api_v1_report_url(report.id)
      end

      tag.href = api_v1_tag_url(tag.id)

      # Render objects
      response.status = 200
      render :json => {
          :items => reports,
          :tag => tag,
          :pagination => generate_pagination_json(page_num, per_page, reports, api_v1_reports_url)
      }, methods: [:href, :tags]

    end

    rescue ArgumentError, TypeError

      response.status = 400
      render :json => {
          error: 'Could not get reports.',
          reasons: [ 'Please provide parameters of correct type: (integer)page_num, (integer)per_page' ]
      }

    rescue ActiveRecord::RecordNotFound

      response.status = 404
      render :json => {
          error: 'Could not get report.',
          reasons: [ 'No report with the specified id could be found' ]
      }

  end


  private

  def tag_params
    params.permit(:name, :id, :color)
  end

  def destroy_params
    params.permit(:id)
  end

end
