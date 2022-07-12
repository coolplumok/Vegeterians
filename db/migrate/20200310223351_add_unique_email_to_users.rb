class AddUniqueEmailToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :unique_email, :string
  end
end
