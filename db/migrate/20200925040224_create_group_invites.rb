class CreateGroupInvites < ActiveRecord::Migration[5.2]
  def change
    drop_table :group_invites if ActiveRecord::Base.connection.tables.include?('group_invites')

    create_table :group_invites do |t|
      t.integer :account_id, null: false
      t.integer :group_id, null: false
      t.integer :target_account_id, null: false
      t.boolean :show_reblogs, null: false, default: true
      t.string  :uri

      t.timestamps
    end
  end
end
