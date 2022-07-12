class CreateHealthExpertApproveRequests < ActiveRecord::Migration[5.2]
  def change
    drop_table :health_expert_approve_requests if ActiveRecord::Base.connection.tables.include?('health_expert_approve_requests')

    create_table :health_expert_approve_requests do |t|
      t.integer :account_id, null: false
      t.integer :target_account_id, null: false
      t.boolean :show_reblogs, null: false, default: true
      t.string  :uri

      t.timestamps
    end
  end
end