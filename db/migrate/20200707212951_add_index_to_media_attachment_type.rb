class AddIndexToMediaAttachmentType < ActiveRecord::Migration[5.2]
  disable_ddl_transaction!

  def change
    add_index :media_attachments, :type, algorithm: :concurrently
  end
end
