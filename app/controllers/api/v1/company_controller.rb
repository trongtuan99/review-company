class Api::V1::CompanyController < ApplicationController
  before_action :authenticate_user!, only: [:create, :update, :delete_company]
  # Allow any authenticated user to create company (not just admin/owner)
  before_action :check_role_permission, only: [:update, :delete_company]
  before_action :get_company, only: [:company_overview, :update, :delete_company]

  def index
    query = params[:q] || params[:search]
    if query.present?
      # Search by name
      data = Company.where("name ILIKE ?", "%#{query}%").limit(20)
    else
      data = Company.all.limit(10)
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
