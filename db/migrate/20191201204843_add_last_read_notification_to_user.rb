class AddLastReadNotificationToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :last_read_notification, :bigint
  end
end
