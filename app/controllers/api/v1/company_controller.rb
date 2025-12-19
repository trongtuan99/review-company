class Api::V1::CompanyController < ApplicationController
  before_action :authenticate_user!, only: [:create, :update, :delete_company]
  # Allow any authenticated user to create company (not just admin/owner)
  before_action :check_role_permission, only: [:update, :delete_company]
  before_action :get_company, only: [:company_overview, :update, :delete_company]

  def index
    query = params[:q] || params[:search]
    top_rated = params[:top_rated] == 'true'
    exclude_ids = params[:exclude_ids]&.split(',')&.map(&:strip)
    limit = params[:limit]&.to_i
    page = params[:page]&.to_i || 1
    per_page = params[:per_page]&.to_i || 20
    
    # Base query: only show non-deleted companies
    base_query = Company.where(is_deleted: false)
    
    if query.present?
      # Search by name
      data = base_query.where("name ILIKE ?", "%#{query}%").order(created_at: :desc)
    elsif top_rated
      # Get top 10 companies by rating (avg_score)
      # Only include companies with at least 1 review
      data = base_query
        .where.not(avg_score: nil)
        .where("total_reviews > 0")
        .order(avg_score: :desc, total_reviews: :desc)
        .limit(10)
    elsif exclude_ids.present?
      # Get companies except the ones in exclude_ids (for bottom section)
      data = base_query
        .where.not(id: exclude_ids)
        .order(created_at: :desc)
      
      # Apply limit if provided
      data = data.limit(limit) if limit.present? && limit > 0
    else
      # Show all companies, ordered by most recent first
      data = base_query.order(created_at: :desc)
      
      # Apply pagination if page/per_page provided
      if page.present? && per_page.present?
        total_count = data.count
        total_pages = (total_count.to_f / per_page).ceil
        offset = (page - 1) * per_page
        data = data.limit(per_page).offset(offset)
        
        # Return pagination info in response
        return render json: {
          status: 'ok',
          data: data.map { |c| CompanySerializer.new(c).as_json },
          pagination: {
            current_page: page,
            per_page: per_page,
            total_count: total_count,
            total_pages: total_pages
          }
        }
      elsif limit.present? && limit > 0
        data = data.limit(limit)
      end
    end
    
    render json: json_with_success(data: data, default_serializer: CompanySerializer)
  end

  def create
    data = Company.create!(create_params)
    render json: json_with_success(data: data, default_serializer: CompanySerializer)
  end

  def company_overview
    render json: json_with_success(data: @company, default_serializer: CompanySerializer)
  end

  def update
    @company.update!(update_params)
    render json: json_with_success(data: @company, default_serializer: CompanySerializer)
  end

  def delete_company
    @company.update_attribute(:is_deleted, true)
    render json: json_with_empty_success
  end


  private

  def get_company
    @company = Company.find(params[:id])
    return render json: json_with_error(message: "company not found") unless @company
  end

  def create_params
    params.require(:company).permit(:name, :owner, :phone, :main_office, :website)
  end

  def update_params
    params.require(:company).permit(:owner, :phone, :main_office, :website)
  end

  def check_role_permission
    allow_action = current_user.role&.admin? || current_user.role&.owner?
    return render json: json_with_error(message: I18n.t("controller.base.not_permission")) unless allow_action
  end
end
