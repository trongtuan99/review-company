class Api::V1::ReviewController < ApplicationController
  around_action :with_transaction, except: %i[index]
  before_action :authenticate_user!, except: %i[index]
  before_action :get_company, only: [:create, :index]
  before_action :get_review, only: [:update, :delete_review, :like, :dislike]
  before_action :validate_update, only: :update
  before_action :get_like_record, only: [:like, :dislike]

  def index
    data = @company.reviews.all
    render json: json_with_success(
      data: data, 
      default_serializer: ReviewSerializer,
      options: { scope: current_user }
    )
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
    handle_like_dislike(:like)
  end

  def dislike
    handle_like_dislike(:dislike)
  end

  private

  def handle_like_dislike(status)
    # Logic:
    # - If clicking like/dislike when already in that state -> toggle to default
    # - If clicking like/dislike when in opposite state -> switch to new state
    # - If clicking like/dislike when in default state -> set to new state
    if @like_record.present?
      current_status = @like_record.status.to_sym
      if current_status == status
        # Already in this state, toggle to default
        new_status = :default
      else
        # Switch to the requested status
        new_status = status
      end
      @like_record.update!(status: new_status)
    else
      # Create new like record with the requested status
      @like_record = Like.create!(
        user_id: current_user.id,
        review_id: @review.id,
        status: status
      )
    end
    
    # Reload review to get updated total_like and total_dislike
    # The after_commit callback should have already updated these values
    # Reload review and reset association cache to ensure serializer can find the like record
    @review.reload
    # Reset association cache so serializer will query fresh from database
    @review.association(:likes).reset
    
    render json: json_with_success(
      data: @review, 
      default_serializer: ReviewSerializer,
      options: { scope: current_user },
      message: I18n.t('controller.base.success')
    )
  rescue => e
    render json: json_with_error(message: e.message)
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

end
