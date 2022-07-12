class CreateStatusBookmark < ActiveRecord::Migration[5.2]
  def change
    create_table :status_bookmarks do |t|
      t.timestamps
      t.belongs_to :account, foreign_key: { on_delete: :cascade }, null: false
      t.belongs_to :status, foreign_key: { on_delete: :cascade }, null: false
    end

    add_index :status_bookmarks, [:account_id, :status_id], unique: true
  end
end
