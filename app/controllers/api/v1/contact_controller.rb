# frozen_string_literal: true

class Api::V1::ContactController < ApplicationController
  before_action :authenticate_user!, except: [:create]
  before_action :authorize_admin!, except: [:create]
  before_action :set_message, only: [:show, :update, :destroy, :read, :reply]

  # GET /api/v1/contact
  # List all contact messages (admin only)
  def index
    messages = ContactMessage.ordered

    # Filter by status
    if params[:status].present? && params[:status] != 'all'
      messages = messages.by_status(params[:status])
    end

    # Search by name or email
    if params[:search].present?
      search_term = "%#{params[:search]}%"
      messages = messages.where('name ILIKE ? OR email ILIKE ? OR subject ILIKE ?', search_term, search_term, search_term)
    end

    # Sorting
    sort_by = params[:sort_by] || 'created_at'
    sort_order = params[:sort_order] || 'desc'
    allowed_sorts = %w[created_at status name email subject]
    if allowed_sorts.include?(sort_by)
      messages = messages.reorder("#{sort_by} #{sort_order == 'asc' ? 'ASC' : 'DESC'}")
    end

    # Pagination
    page = (params[:page] || 1).to_i
    per_page = (params[:per_page] || 10).to_i
    total_count = messages.count
    messages = messages.offset((page - 1) * per_page).limit(per_page)

    render json: json_with_success(
      data: messages.map { |m| serialize_message(m) },
      pagination: {
        current_page: page,
        per_page: per_page,
        total_count: total_count,
        total_pages: (total_count.to_f / per_page).ceil
      }
    )
  end

  # GET /api/v1/contact/:id
  def show
    render json: json_with_success(data: serialize_message(@message))
  end

  # POST /api/v1/contact
  # Public - anyone can send a message
  def create
    @message = ContactMessage.new(message_params)

    if @message.save
      render json: json_with_success(
        data: serialize_message(@message),
        message: I18n.t('contact.message_sent', default: 'Message sent successfully')
      ), status: :created
    else
      render json: json_with_error(message: @message.errors.full_messages.join(', '))
    end
  end

  # PUT /api/v1/contact/:id
  def update
    if params[:status].present?
      @message.status = params[:status]
    end

    if @message.save
      render json: json_with_success(data: serialize_message(@message))
    else
      render json: json_with_error(message: @message.errors.full_messages.join(', '))
    end
  end

  # DELETE /api/v1/contact/:id
  def destroy
    @message.destroy
    render json: json_with_success(message: I18n.t('contact.deleted', default: 'Message deleted'))
  end

  # PUT /api/v1/contact/:id/read
  def read
    @message.mark_as_read!
    render json: json_with_success(data: serialize_message(@message))
  end

  # POST /api/v1/contact/:id/reply
  def reply
    if params[:reply].blank?
      return render json: json_with_error(message: 'Reply content is required')
    end

    @message.reply!(params[:reply])
    render json: json_with_success(
      data: serialize_message(@message),
      message: I18n.t('contact.replied', default: 'Reply sent successfully')
    )
  end

  private

  def set_message
    @message = ContactMessage.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: json_with_error(message: 'Message not found'), status: :not_found
  end

  def message_params
    params.require(:contact_message).permit(:name, :email, :subject, :message)
  end

  def authorize_admin!
    unless current_user&.role&.admin? || current_user&.role&.owner?
      render json: json_with_error(message: I18n.t('controller.base.not_permission')), status: :forbidden
    end
  end

  def serialize_message(message)
    {
      id: message.id,
      name: message.name,
      email: message.email,
      subject: message.subject,
      message: message.message,
      status: message.status,
      read_at: message.read_at,
      reply_content: message.reply_content,
      replied_at: message.replied_at,
      created_at: message.created_at,
      updated_at: message.updated_at
    }
  end
end
