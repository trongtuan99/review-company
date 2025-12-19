class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: Devise::JWT::RevocationStrategies::Null

  belongs_to :role, optional: true
  has_many :favorites, dependent: :destroy
  has_many :favorite_companies, through: :favorites, source: :company
  include WhoDoesIt::CurrentUserMethods

  after_create :set_default_role, if: -> { role_id.nil?}

  private

  def set_default_role
    self.role_id = Role.find_by(role: 'user').id
    self.save!
  end
end
