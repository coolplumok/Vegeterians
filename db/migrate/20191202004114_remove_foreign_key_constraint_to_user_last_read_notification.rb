class RemoveForeignKeyConstraintToUserLastReadNotification < ActiveRecord::Migration[5.2]
  def change
    remove_foreign_key :users, column: :last_read_notification
  end
end
