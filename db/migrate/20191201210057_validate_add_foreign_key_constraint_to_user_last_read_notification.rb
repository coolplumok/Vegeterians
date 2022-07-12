class ValidateAddForeignKeyConstraintToUserLastReadNotification < ActiveRecord::Migration[5.2]
  def change
    validate_foreign_key :users, :notifications
  end
end
