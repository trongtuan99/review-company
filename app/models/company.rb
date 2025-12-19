class Company < ApplicationRecord
  include BaseConcern

  enum company_type: {
    unknown:  0,
    personal: 1,
    government: 2
  }

  validates :name, :owner, presence: true
  validates :name, uniqueness: true
  has_many :reviews, dependent: :destroy
  has_many :favorites, dependent: :destroy
  has_many :favorited_by_users, through: :favorites, source: :user

  # Recalculate avg_score when total_reviews changes
  after_commit :recalculate_avg_score, on: :update, if: -> { saved_change_to_total_reviews? }

  # Method to recalculate avg_score manually
  def recalculate_avg_score!
    reviews_count = reviews.count
    return if reviews_count.zero?

    total_score = reviews.sum(:score)
    new_avg_score = total_score.to_f / reviews_count
    update_column(:avg_score, new_avg_score)
  end

  private

  def recalculate_avg_score
    recalculate_avg_score!
  end
end
