class AddIndexToAccountFlags < ActiveRecord::Migration[5.2]
  disable_ddl_transaction!

  def change
    add_index :accounts, :is_pro, algorithm: :concurrently
    add_index :accounts, :is_verified, algorithm: :concurrently
    add_index :accounts, :is_donor, algorithm: :concurrently
    add_index :accounts, :is_investor, algorithm: :concurrently
  end
end
