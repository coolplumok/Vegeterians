class AddThumbnailColumnsToMediaAttachments < ActiveRecord::Migration[5.2]
  def change
    add_attachment :media_attachments, :thumbnail
    add_column :media_attachments, :thumbnail_remote_url, :string
  end
end
