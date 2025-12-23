class Reply < ApplicationRecord
  include BaseConcern

  validates :review_id, :user_id, :content, presence: true
  belongs_to :review
  belongs_to :user

  after_commit :increment_total_reply, on: :create
  after_commit :decrement_total_reply, on: :destroy
  after_commit :update_is_edited, on: :update, if: -> { saved_change_to_content?}

  private

  def increment_total_reply
    return unless review
    review.increment!(:total_reply, 1)
  end

  def decrement_total_reply
    return unless review
    review.decrement!(:total_reply, 1) if review.total_reply > 0
  end

  def update_is_edited
    self.update_attribute(:is_edited, true)
  end

end
