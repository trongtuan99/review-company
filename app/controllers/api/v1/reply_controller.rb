class Api::V1::ReplyController < ApplicationController
  around_action :with_transaction, only: %i[create update destroy]
  before_action :authenticate_user!, except: %i[index]
  before_action :get_review, only: %i[create index]
  before_action :get_reply, only: %i[update destroy]

  def index
    replies = Reply.where(review_id: @review.id)
    render json: json_with_success(message: I18n.t("controller.base.ok"), data: replies, default_serializer: ReplySerializer)
  end

  def create
    reply = Reply.create!(reply_review_params.merge!(user_id: current_user.id, review_id: @review.id))
    render json: json_with_success(message: I18n.t("controller.base.success"), data: reply, default_serializer: ReplySerializer)
  end

  def update
    @reply.update!(reply_review_params)
    render json: json_with_success(message: I18n.t("controller.base.success"), data: @reply, default_serializer: ReplySerializer)
  end

  def destroy
    @reply.destroy!
    render json: json_with_success(message: I18n.t("controller.base.destroyed"))
  end

  private

  def get_reply
    @reply = Reply.find(params[:id])
  end

  def get_review
    @review = Review.find(params[:review_id])
  end

  def reply_review_params
    params.permit(:content)
  end
end
