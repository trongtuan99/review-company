class CreateFavorites < ActiveRecord::Migration[7.0]
  def change
    unless table_exists?(:favorites)
      create_table :favorites, id: :uuid do |t|
        t.uuid :user_id, null: false
        t.uuid :company_id, null: false

        t.timestamps
      end
      
      # Add foreign keys
      add_foreign_key :favorites, :users, column: :user_id
      add_foreign_key :favorites, :companies, column: :company_id
      
      # Add indexes (only if they don't exist)
      add_index :favorites, :user_id, name: 'index_favorites_on_user_id' unless index_exists?(:favorites, :user_id)
      add_index :favorites, :company_id, name: 'index_favorites_on_company_id' unless index_exists?(:favorites, :company_id)
      add_index :favorites, [:user_id, :company_id], unique: true, name: 'index_favorites_on_user_id_and_company_id' unless index_exists?(:favorites, [:user_id, :company_id])
    end
  end
end

