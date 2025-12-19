class RemoveUserForeignKeyFromFavorites < ActiveRecord::Migration[7.0]
  def change
    # Remove foreign key constraint for user_id
    # User is in public schema (excluded_models), so we can't have foreign key from tenant schema
    # Check if foreign key exists before removing
    if foreign_key_exists?(:favorites, :users)
      remove_foreign_key :favorites, :users
    end
  end
end
