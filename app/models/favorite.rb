class Favorite < ApplicationRecord
  # User is in public schema (excluded_models), so we can't use belongs_to with foreign key
  # We'll just store user_id as a reference
  belongs_to :company

  validates :user_id, presence: true
  validates :user_id, uniqueness: { scope: :company_id }
  
  # Custom method to get user from public schema
  def user
    Apartment::Tenant.switch('public') do
      User.find_by(id: user_id)
    end
  end
end

