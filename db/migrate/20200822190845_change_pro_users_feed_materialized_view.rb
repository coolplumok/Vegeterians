class ChangeProUsersFeedMaterializedView < ActiveRecord::Migration[5.2]
  def change
    safety_assured { 
        execute <<-SQL
          DROP MATERIALIZED VIEW IF EXISTS pro_feed_users_matview;
          CREATE MATERIALIZED VIEW pro_feed_users_matview AS
            SELECT id 
            FROM accounts
            WHERE accounts.is_expert=true 
              OR accounts.is_proplus=true 
              OR accounts.is_verified=true 
              OR accounts.is_pro=true
        SQL
    }
  end
end
