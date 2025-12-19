class Api::V1::FavoriteController < ApplicationController
  before_action :authenticate_user!

  def create
    company_id = params[:company_id] || params.dig(:favorite, :company_id)
    company = Company.find(company_id)
    favorite = current_user.favorites.find_or_initialize_by(company: company)
    
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
    favorite = current_user.favorites.find_by(company: company)
    
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
    favorites = current_user.favorites.includes(:company)
    companies = favorites.map(&:company).select { |c| !c.is_deleted }
    render json: json_with_success(data: companies, default_serializer: CompanySerializer)
  end

  def check
    company = Company.find(params[:company_id])
    is_favorited = current_user.favorites.exists?(company: company)
    render json: json_with_success(data: { is_favorited: is_favorited })
  rescue ActiveRecord::RecordNotFound
    render json: json_with_error(message: "Không tìm thấy công ty")
  end
end

