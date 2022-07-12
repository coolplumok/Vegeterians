class AddColumnToUserAvailableBoostPost < ActiveRecord::Migration[5.2]

	def change
    add_column :users, :available_boost_post, :integer
  end

end
