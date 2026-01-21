class CreateContactMessages < ActiveRecord::Migration[7.0]
  def change
    unless table_exists?(:contact_messages)
      create_table :contact_messages do |t|
        t.string :name, null: false
        t.string :email, null: false
        t.string :subject, null: false
        t.text :message, null: false
        t.integer :status, default: 0, null: false
        t.datetime :read_at
        t.text :reply_content
        t.datetime :replied_at

        t.timestamps
      end

      add_index :contact_messages, :email
      add_index :contact_messages, :status
      add_index :contact_messages, :created_at
    end
  end
end

