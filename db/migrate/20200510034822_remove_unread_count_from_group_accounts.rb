class RemoveUnreadCountFromGroupAccounts < ActiveRecord::Migration[5.2]
  def change
    safety_assured { remove_column :group_accounts, :unread_count, :integer }
  end
end
