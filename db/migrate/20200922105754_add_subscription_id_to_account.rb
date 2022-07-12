class AddSubscriptionIdToAccount < ActiveRecord::Migration[5.2]
  def change
  	add_column :accounts, :subscription_id, :string
    add_column :accounts, :proplus_expires_at, :datetime
  end
end
