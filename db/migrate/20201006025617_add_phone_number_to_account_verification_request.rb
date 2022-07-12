class AddPhoneNumberToAccountVerificationRequest < ActiveRecord::Migration[5.2]
  def change
    add_column :account_verification_requests, :phone_number, :string
    add_column :account_verification_requests, :code, :string
  end
end
