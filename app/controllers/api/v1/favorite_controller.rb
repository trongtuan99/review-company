class Api::V1::FavoriteController < ApplicationController
  before_action :authenticate_user!

  def create
    company_id = params[:company_id] || params.dig(:favorite, :company_id)
    company = Company.find(company_id)
    
    # Query favorite directly in current tenant schema (not through user association)
    favorite = Favorite.find_or_initialize_by(user_id: current_user.id, company_id: company.id)
    
    if favorite.persisted?
      render json: json_with_error(message: "Công ty đã được yêu thích")
    else
      favorite.save!
      render json: json_with_success(data: favorite, message: "Đã thêm vào danh sách yêu thích")
    end
  rescue ActiveRecord::RecordNotFound
    render json: json_with_error(message: "Không tìm thấy công ty")
  rescue => e
    render json: json_with_error(message: e.message)
  end

  def destroy
    company_id = params[:id] || params[:company_id]
    company = Company.find(company_id)
    
    # Query favorite directly in current tenant schema
    favorite = Favorite.find_by(user_id: current_user.id, company_id: company.id)
    
    if favorite
      favorite.destroy
      render json: json_with_empty_success(message: "Đã xóa khỏi danh sách yêu thích")
    else
      render json: json_with_error(message: "Công ty chưa được yêu thích")
    end
  rescue ActiveRecord::RecordNotFound
    render json: json_with_error(message: "Không tìm thấy công ty")
  end

  def index
    # Query favorites directly in current tenant schema
    favorites = Favorite.where(user_id: current_user.id).includes(:company)
    companies = favorites.map(&:company).compact.select { |c| !c.is_deleted }
    render json: json_with_success(data: companies, default_serializer: CompanySerializer)
  end

  def check
    company = Company.find(params[:company_id])
    # Query favorite directly in current tenant schema
    is_favorited = Favorite.exists?(user_id: current_user.id, company_id: company.id)
    render json: json_with_success(data: { is_favorited: is_favorited })
  rescue ActiveRecord::RecordNotFound
    render json: json_with_error(message: "Không tìm thấy công ty")
  end
end

