class Like < ApplicationRecord

  enum status: {
    default: 0,
    like: 1,
    dislike: 2
  }
  validates :status, :user_id, :review_id, presence: true
  validates :user_id, uniqueness: { scope: :review_id }, on: :create

  belongs_to :user
  belongs_to :review

  scope :get_like_review_by_user_id, -> (review_id, user_id) {
    where(user_id: user_id, review_id: review_id)
  }

  after_commit :update_total_like_dislike, on: %i[create update]
  after_commit :decrement_on_destroy, on: :destroy

  private

  def update_total_like_dislike
    return unless saved_change_to_status?

    old_status = previous_changes[:status] ? previous_changes[:status][0] : nil
    new_status = status.to_sym

    review.with_lock do
      # Decrement old status
      case old_status&.to_sym
      when :like
        review.decrement!(:total_like, 1) if review.total_like > 0
      when :dislike
        review.decrement!(:total_dislike, 1) if review.total_dislike > 0
      end

      # Increment new status
      case new_status
      when :like
        review.increment!(:total_like, 1)
      when :dislike
        review.increment!(:total_dislike, 1)
      end
    end
  end

  def decrement_on_destroy
    return unless review

    review.with_lock do
      case status.to_sym
      when :like
        review.decrement!(:total_like, 1) if review.total_like > 0
      when :dislike
        review.decrement!(:total_dislike, 1) if review.total_dislike > 0
      end
    end
  end
end
