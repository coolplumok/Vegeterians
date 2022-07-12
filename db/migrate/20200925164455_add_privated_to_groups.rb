class AddPrivatedToGroups < ActiveRecord::Migration[5.2]
  def up
    add_column :groups, :is_privated, :boolean
    change_column_default :groups, :is_privated, false
  end

  def down
    remove_column :groups, :is_privated
  end
end
