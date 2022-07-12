class AddIndexUniqueEmailOnUsers < ActiveRecord::Migration[5.2]
  disable_ddl_transaction!

  def change
    add_index :users, :unique_email, algorithm: :concurrently
  end
end
