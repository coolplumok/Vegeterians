class ChangeListAccountFollowNullable < ActiveRecord::Migration[5.2]
  def change
    change_column_null :list_accounts, :follow_id, true
  end
end
