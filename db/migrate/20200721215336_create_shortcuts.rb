class CreateShortcuts < ActiveRecord::Migration[5.2]
  def change
    create_table :shortcuts do |t|
      t.timestamps
      t.belongs_to :account, foreign_key: { on_delete: :cascade }, null: false
      t.bigint :shortcut_id, null: false
      t.string :shortcut_type, null: false, default: ''
    end

    add_index :shortcuts, [:account_id, :shortcut_id, :shortcut_type], unique: true
  end
end
