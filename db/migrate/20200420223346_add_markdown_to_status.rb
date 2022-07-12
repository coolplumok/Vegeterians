class AddMarkdownToStatus < ActiveRecord::Migration[5.2]
  def change
    add_column :statuses, :markdown, :text
  end
end
