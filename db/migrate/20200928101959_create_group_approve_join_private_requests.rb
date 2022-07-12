class CreateGroupApproveJoinPrivateRequests < ActiveRecord::Migration[5.2]
  def change
    create_table :group_approve_join_private_requests do |t|
      t.integer :account_id, null: false
      t.integer :group_id, null: false
      t.integer :target_account_id, null: false
      t.boolean :show_reblogs, null: false, default: true
      t.string  :uri

      t.timestamps
    end
  end
end
