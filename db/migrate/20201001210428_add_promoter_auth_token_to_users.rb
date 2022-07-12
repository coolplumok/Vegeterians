class AddPromoterAuthTokenToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :promoter_auth_token, :string, null: true, default: nil
  end
end
