class CreateGroupInviteRequests < ActiveRecord::Migration[5.2]
  def change
    drop_table :group_invite_requests if ActiveRecord::Base.connection.tables.include?('group_invite_requests')
    
    create_table :group_invite_requests do |t|
      t.integer :account_id, null: false
      t.integer :group_id, null: false
      t.integer :target_account_id, null: false
      t.boolean :show_reblogs, null: false, default: true
      t.string  :uri
      
      t.timestamps
    end
  end
end
