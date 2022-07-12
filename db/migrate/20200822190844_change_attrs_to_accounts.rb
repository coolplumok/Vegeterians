class ChangeAttrsToAccounts < ActiveRecord::Migration[4.2]
  # def up
  #   remove_index :accounts, [:is_investor]
  #   rename_column :accounts, :is_investor, :is_expert
  #   change_column :accounts, :is_expert, :boolean, default: false, null: false
  #   add_index :accounts, [:is_expert]
  #   remove_index :accounts, [:is_donor]
  #   rename_column :accounts, :is_donor, :is_proplus
  #   change_column :accounts, :is_proplus, :boolean, default: false, null: false
  #   add_index :accounts, [:is_proplus]
  # end

  # def down
  #   remove_index :accounts, [:is_investor]
  #   rename_column :accounts, :is_investor, :is_expert
  #   change_column :accounts, :is_expert, :boolean, default: false, null: false
  #   add_index :accounts, [:is_expert]
  #   remove_index :accounts, [:is_donor]
  #   rename_column :accounts, :is_donor, :is_proplus
  #   change_column :accounts, :is_proplus, :boolean, default: false, null: false
  #   add_index :accounts, [:is_proplus]
  # end
end
