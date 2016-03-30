class Api::V1::ReportsController < Api::ApiBaseController

  def index

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

      # Get user
      user = get_logged_in_user

      # Get reports
      reports = user.report.page(page_num).per(per_page).order(sort_by + ' ' + sort_order)


      # Add HATEOAS href to objects
      reports.each do |report|
        report.href = api_v1_report_url(report.id)
        report.href_location = api_v1_location_url(report.location_id)
      end

      # Render objects
      response.status = 200
      render :json => {
        :items => reports,
        :pagination => generate_pagination_json(page_num, per_page, reports, api_v1_reports_url)
      }, methods: [:href, :href_location, :tags, :location],
          :include => {
              :tags => {
                  :except => [:name, :created_at, :updated_at]
              },
              :location => {
                  :except => [:latitude, :longitude, :created_at, :updated_at]
              }
          }

    end

    rescue ArgumentError, TypeError

      response.status = 400
      render :json => {
          error: 'Could not get reports.',
          reasons: [ 'Please provide parameters of correct type: (integer)page_num, (integer)per_page' ]
      }

  end

  def show

    if check_rest_login && check_api_key(params[:key])

      # Get user
      user = get_logged_in_user

      report = Report.where(id: params[:id], clientuser_id: user.id).first

      # Add HATEOAS href to object
      report.href = api_v1_report_url(report.id)
      report.href_location = api_v1_location_url(report.location_id)

      response.status = 200
      render :json => {
          :items => [report],
      }, methods: [:href, :href_location],
           :include => {
               :tags => {
                   :except => [:name, :created_at, :updated_at]
               },
               :location => {
                   :except => [:created_at, :updated_at]
               }
           }

    end

    rescue ActiveRecord::RecordNotFound

      response.status = 404
      render :json => {
          error: 'Could not get report.',
          reasons: [ 'No report with the specified id could be found' ]
      }

  end

  def update

    if check_rest_login && check_api_key(params[:key])

      report = Report.find(report_params[:id])

      # Check if are not allowed to modify this report
      if report.clientuser_id != get_logged_in_user.id

        response.status = 403
        render :json => {
            error: 'Could not save report.',
            reasons: [ 'you are not the owner of that report' ]
        }

        return

      end

      if report.update(report_params)

        response.status = 200
        render :json => {
            :items => [report],
        }, methods: [:href]

      else

        # Save was unsuccessful, probably due to missing values

        errors = Array.new

        report.errors.full_messages.each do |msg|
          errors.append(msg)
        end

        response.status = 400
        render :json => {
            error: 'Could not save report.',
            reasons: errors
        }

      end

    end

    rescue ActiveRecord::RecordNotFound

      response.status = 400

      render :json => {
          error: 'Could not update report.',
          reasons: [ 'report not found' ]
      }

  end

  def create

    if check_rest_login && check_api_key(params[:key])

      # Tag specific
      tags = Array.new
      new_tags = Array.new

      if !report_params[:tags].nil?


        # Try to find duplicate tags names is given data
        if report_params[:tags].uniq.length != report_params[:tags].length

          response.status = 400
          render :json => {
              error: 'Could not save tag.',
              reasons: [ 'tag names must be unique.' ]
          }
        end

        # Try to find tag names in database
        tags_in_db = Tag.where(name: report_params[:tags])
        if tags_in_db.length > 0
          tags.push(*tags_in_db)
        end

        #tags = Tag.where(name: report_params[:tags])

        report_params[:tags].each do |name|

          unless tags.any? {|tag| tag.name == name}

            new_tags.append(Tag.new(name: name))
          end

        end

        Tag.transaction do
          new_tags.each(&:save!)
        end

        tags.push(*new_tags)

        tags.each do |tag|

          # Add HATEOAS href to object
          tag.href = api_v1_tag_url(tag.id)
        end

=begin
        else
          # Save was unsuccessful, probably due to missing values
          errors = Array.new

          tags.errors.full_messages.each do |msg|
            errors.append(msg)
          end

          response.status = 400
          render :json => {
              error: 'Could not save tag.',
              reasons: errors
          }

          return

        end
=end


      end


      # Report specific

      report = Report.new(
          route_name: report_params[:route_name],
          route_grade: report_params[:route_grade],
          location_id: report_params[:location_id]
      )

      # Add tags to report
      unless tags.nil?
        report.tags << tags
      end


      report.clientuser_id = get_logged_in_user.id

      # Check that location actually exists
      unless Location.exists?(report.location_id)

        response.status = 404

        render :json => {
            error: 'Could not create report.',
            reasons: [ 'location not found or parameter (integer)location_id missing' ]
        }

        return

      else

        if report.save

          # Add HATEOAS href to object
          report.href = api_v1_report_url(report.id)

          response.status = 201
          render :json => {
              :items => [report],
              :tags => report_params[:tags],
          }, methods: [:href]

          return

        else
          # Save was unsuccessful, probably due to missing values

          errors = Array.new

          report.errors.full_messages.each do |msg|
            errors.append(msg)
          end

          response.status = 400
          render :json => {
              error: 'Could not save report.',
              reasons: errors
          }

        end

      end

    end

    rescue ActiveRecord::RecordInvalid => exception

      response.status = 400
      render :json => {
          error: 'Could not save tag.',
          reasons: exception.message
      }

  end

  def destroy

    if check_rest_login && check_api_key(params[:key])

      report = Report.find(destroy_params[:id])

      # Check if are not allowed to modify this report
      if report.clientuser_id != get_logged_in_user.id

        response.status = 403
        render :json => {
            error: 'Could not delete report.',
            reasons: [ 'you are not the owner of that report' ]
        }

        return

      end

      # Try to delete report
      if report.destroy

        response.status = 200

        render :json => {
            :items => [report]
        }

      else

        errors = Array.new

        report.errors.full_messages.each do |msg|
          errors.append(msg)
        end

        response.status = 400

        render :json => {
            error: 'Could not delete report.',
            reasons: errors
        }

      end

    end

    rescue ActiveRecord::RecordNotFound

      response.status = 400

      render :json => {
          error: 'Could not delete report.',
          reasons: [ 'report not found' ]
      }

  end

  def remove_tag

    if check_rest_login && check_api_key(params[:key])

      report = Report.find(params[:report_id])

      # Check if are not allowed to modify this report
      if report.clientuser_id != get_logged_in_user.id

        response.status = 403
        render :json => {
            error: 'Could not add tag to report report.',
            reasons: [ 'you are not the owner of that report' ]
        }

        return

      end

      tag = Tag.find(params[:tag_id])

      tags_before = report.tags.length

      # Remove to from report
      report.tags.delete(tag)

      if report.tags.length == tags_before - 1

        response.status = 200
        render :nothing => true

      else

        response.status = 500

        render :json => {
            error: 'Could remove tag from report.',
            reasons: [ 'Unknown error occured' ]
        }

      end

    end

    rescue ActiveRecord::RecordNotFound

      response.status = 404

      render :json => {
          error: 'Could add tag to report.',
          reasons: [ 'Report or tag not found' ]
      }

    rescue ActiveRecord::RecordNotUnique

      response.status = 400

      render :json => {
          error: 'Could add tag to report.',
          reasons: [ 'Tag already present on report' ]
      }

  end

  def add_tag

    if check_rest_login && check_api_key(params[:key])

      report = Report.find(params[:report_id])

      # Check if are not allowed to modify this report
      if report.clientuser_id != get_logged_in_user.id

        response.status = 403
        render :json => {
            error: 'Could not add tag to report report.',
            reasons: [ 'you are not the owner of that report' ]
        }

        return

      end

      tag = Tag.find(params[:tag_id])

      tags_before = report.tags.length

      # Add tag to report
      report.tags << tag

      if report.tags.length == tags_before + 1

        # Add HATEOAS href to objects
        report.href = api_v1_report_url(report.id)
        tag.href = api_v1_tag_url(tag.id)
        tag.reports_href = api_v1_reports_url + '?for_tag=' + tag.id.to_s

        response.status = 201
        render :json => {
            :items => [report],
            :tag => tag,
        }, methods: [:href, :reports_href, :tag_href]


      else

        response.status = 500

        render :json => {
            error: 'Could add tag to report.',
            reasons: [ 'Unknown error occured' ]
        }

      end

    end

    rescue ActiveRecord::RecordNotFound

      response.status = 404

      render :json => {
          error: 'Could not add tag to report.',
          reasons: [ 'Report or tag not found' ]
      }

    rescue ActiveRecord::RecordNotUnique

      response.status = 400

      render :json => {
          error: 'Could not add tag to report.',
          reasons: [ 'Tag already present on report' ]
      }

  end

  def search

    if check_rest_login && check_api_key(params[:key])

      # Search string
      search_string = params[:search_string]

      # Pagination params
      page_num = Integer(params[:page_num]) || 1
      per_page = Integer(params[:per_page]) || 10

      # Get user
      user = get_logged_in_user

      # Sort by
      case params[:sort_by]
        when 'route_grade', 'route_name', 'created_at', 'updated_at'
          sort_by = params[:sort_by]
        else
          sort_by = 'created_at'
      end

      # Sort order params
      sort_order = params[:sort_order] == 'asc' ? 'ASC' : 'DESC'

      # Check search params
      if search_string.nil?

        response.status = 400
        render :json => {
            error: 'Could not get reports.',
            reasons: [ 'Please provide parameters of correct type: (string)search_string' ]
        }

        return

      else

        # Search after value and apply pagination and order
        reports = Report.where("route_name LIKE ? AND clientuser_id = ?", "%#{search_string}%", user.id
        ).page(page_num).per(per_page).order(sort_by + ' ' + sort_order).includes(:tags)

        # Add HATEOAS href to objects
        reports.each do |report|
          report.href = api_v1_report_url(report.id)
        end

        # Render objects
        response.status = 200
        render :json => {
            :items => reports,
            :pagination => generate_pagination_json(page_num, per_page, reports, api_v1_reports_url)
        }, methods: [:href, :tags]

      end

    end

  rescue ArgumentError, TypeError

    response.status = 400
    render :json => {
        error: 'Could not get reports.',
        reasons: [ 'Please provide parameters of correct type: (integer)page_num, (integer)per_page' ]
    }

  end

  private

  def report_params
    params.permit(:route_name, :route_grade, :location_id, :id, :tag_name, tags: [])
  end

  def destroy_params
    params.permit(:id)
  end

end
