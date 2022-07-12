class CreateHealthExpertApproves < ActiveRecord::Migration[5.2]
  def change
    drop_table :health_expert_approves if ActiveRecord::Base.connection.tables.include?('health_expert_approves')

    create_table :health_expert_approves do |t|
      t.integer :account_id, null: false
      t.integer :target_account_id, null: false
      t.boolean :show_reblogs, null: false, default: true
      t.string  :uri

      t.timestamps
    end
  end
end 