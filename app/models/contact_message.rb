# frozen_string_literal: true

class ContactMessage < ApplicationRecord
  # Status enum
  enum status: {
    pending: 0,
    read: 1,
    replied: 2,
    archived: 3
  }

  # Validations
  validates :name, presence: true, length: { maximum: 100 }
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :subject, presence: true, length: { maximum: 200 }
  validates :message, presence: true, length: { minimum: 10, maximum: 5000 }

  # Scopes
  scope :ordered, -> { order(created_at: :desc) }
  scope :unread, -> { where(status: :pending) }
  scope :by_status, ->(status) { where(status: status) if status.present? && status != 'all' }

  # Mark as read
  def mark_as_read!
    return if read?
    update!(status: :read, read_at: Time.current)
  end

  # Reply to message
  def reply!(content)
    update!(
      reply_content: content,
      replied_at: Time.current,
      status: :replied
    )
  end
end
