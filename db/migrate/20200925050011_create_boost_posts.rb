class CreateBoostPosts < ActiveRecord::Migration[5.2]
  def change
    create_table :boost_posts do |t|
      t.integer :user_id
      t.string :status_id

      t.timestamps
    end
  end
end
