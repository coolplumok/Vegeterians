class CreateHealthExpertApplications < ActiveRecord::Migration[5.2]
  def change
    drop_table :health_expert_applications if ActiveRecord::Base.connection.tables.include?('health_expert_applications')

    create_table :health_expert_applications do |t|
      t.integer :account_id, null: false
      t.string  :training_certification, null: false
      t.string  :website_url, null: true
      t.string  :facebook_url, null: true
      t.string  :twitter_url, null: true
      t.string  :instagram_url, null: true
      t.string  :telegram_url, null: true
      t.string  :youtube_url, null: true
      t.boolean :show_reblogs, null: false, default: true
      t.string  :uri

      t.timestamps
    end
  end
end