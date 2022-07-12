require Rails.root.join('lib', 'gabsocial', 'migration_helpers')

class AddMemorialToAccounts < ActiveRecord::Migration[5.1]
  include GabSocial::MigrationHelpers

  disable_ddl_transaction!

  def up
    safety_assured { add_column_with_default :accounts, :memorial, :bool, default: false }
  end

  def down
    remove_column :accounts, :memorial
  end
end
