class AddForeignKeyConstraintToUserLastReadNotification < ActiveRecord::Migration[5.2]
  def change
    add_foreign_key :users, :notifications, column: :last_read_notification, on_delete: :nullify, validate: false
  end
end
