class Api::V1::ReportsController < Api::ApiBaseController

  def index

    #if check_rest_login && check_api_key(params[:key])

    # Pagination params
    page_num = Integer(params[:page_num]) || 1
    per_page = Integer(params[:per_page]) || 10

    reports = Report.page(page_num).per(per_page)

    # Add HATEOAS href to objects
    reports.each do |report|
      report.href = api_v1_report_url(report.id)
    end

    # Render objects
    response.status = 200
    render :json => {
      :items => reports,
      :pagination => generate_pagination_json(page_num, per_page, reports)
    }, methods: [:href]

    #end

    rescue ArgumentError, TypeError

    response.status = 400
    render :json => {
        error: 'Could not get reports.',
        reasons: [ 'Please provide parameters of correct type: (integer)page_num, (integer)per_page' ]
    }

  end

  def show

    #if check_rest_login && check_api_key(params[:key])

    report = Report.find(params[:id])

    # Add HATEOAS href to object
    report.href = api_v1_report_url(report.id)

    response.status = 200
    render :json => report, methods: [:href]

    #end

  end

  def create

    #if check_rest_login && check_api_key(params[:key])

    report = Report.new(report_params)

    if report.save

      # Add HATEOAS href to object
      report.href = api_v1_report_url(report.id)

      response.status = 201
      render :json => report, methods: [:href]

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

    #end

  end

  def destroy

    #if check_rest_login && check_api_key(params[:key])

    report = Report.find(destroy_params[:id])

    # Try to delete report
    if report.destroy

      response.status = 200

      render :nothing => true

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

      #end

  rescue ActiveRecord::RecordNotFound

    response.status = 400

    render :json => {
        error: 'Could not delete report.',
        reasons: [ 'report not found' ]
    }

  end

  private

  def report_params
    params.permit(:route_name, :route_grade)
  end

  def destroy_params
    params.permit(:id)
  end

end
