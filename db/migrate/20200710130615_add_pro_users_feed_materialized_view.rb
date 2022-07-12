class AddProUsersFeedMaterializedView < ActiveRecord::Migration[5.2]
  def change
    safety_assured { 
        execute <<-SQL
          CREATE MATERIALIZED VIEW pro_feed_users_matview AS
            SELECT id 
            FROM accounts
            WHERE accounts.is_investor=true 
              OR accounts.is_donor=true 
              OR accounts.is_verified=true 
              OR accounts.is_pro=true
        SQL
    }
  end
end
