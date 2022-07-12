require Rails.root.join('lib', 'gabsocial', 'migration_helpers')

class AddEmbedUrlToPreviewCards < ActiveRecord::Migration[5.1]
  include GabSocial::MigrationHelpers

  disable_ddl_transaction!

  def up
    safety_assured do
      add_column_with_default :preview_cards, :embed_url, :string, default: '', allow_null: false
    end
  end

  def down
    execute "UPDATE preview_cards SET url=embed_url WHERE embed_url!=''"
    remove_column :preview_cards, :embed_url
  end
end
