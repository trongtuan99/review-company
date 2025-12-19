class Api::V1::ReviewController < ApplicationController
  around_action :with_transaction, except: %i[index]
  before_action :authenticate_user!, except: %i[index]
  before_action :get_company, only: [:create, :index]
  before_action :get_review, only: [:update, :delete_review, :like, :dislike]
  before_action :validate_update, only: :update
  before_action :get_like_record, only: [:like, :dislike]

  def index
    data = @company.reviews.all
    render json: json_with_success(data: data, default_serializer: ReviewSerializer)
  end

  def create
    create_payload = create_update_params.merge!(company_id: @company.id)
    create_payload.merge!(user_id: current_user.id)
    data = Review.create!(create_payload)
    render json: json_with_success(data: data, default_serializer: ReviewSerializer)
  end

  def update
    @review.update!(create_update_params)
    render json: json_with_success(data: @review, default_serializer: ReviewSerializer)
  end

  def delete_review
    @review.update_attribute(:is_deleted, true)
    render json: json_with_empty_success
  end

  def like
    like_params = like_dislike_params(:like, @like_record, current_user.id, @review.id)
    produce_service.create(like_params)
    render json: json_with_success(message: I18n.t('controller.base.success'))
  end

  def dislike
    dislike_params = like_dislike_params(:dislike, @like_record, current_user.id, @review.id)
    produce_service.create(dislike_params)
    render json: json_with_success(message: I18n.t('controller.base.success'))
  end

  private

  def like_dislike_params(status, like_record, user_id, review_id)
    status = like_record&.default? ? status : :default
    {
      like_id: like_record&.id,
      action: like_record.present? ? :update : :create,
      status: status,
      user_id: user_id,
      review_id: review_id,
      tenant: Apartment::Tenant.current
    }
  end

  def validate_update
    return render json: json_with_error(message: "cant update deleted reivew") if @review.is_deleted
  end

  def get_review
    @review = Review.find_by(id: params[:id])
    return render json: json_with_error(message: "review not found") unless @review
  end

  def get_company
    @company = Company.find_by(id: params[:company_id])
    return render json: json_with_error(message: "company not found") unless @company
  end

  def create_update_params
    params.require(:review).permit(:title, :reviews_content, :score)
  end

  def get_like_record
    @like_record = Like.get_like_review_by_user_id(params[:id], current_user.id).first
  end

  def produce_service
    Interactors::Kafka::Producers::LikeEvent
  end

end
