# frozen_string_literal: true

class PotentialHealthExpertApplicationTracker
  EXPIRE_AFTER = 90.days.seconds
  MAX_ITEMS    = 80

  WEIGHTS = {
    reply: 1,
    favourite: 10,
    reblog: 20,
  }.freeze

  class << self
    include Redisable

    def record(account_id, target_account_id, action)
      return if account_id == target_account_id

      key    = "healthexpertapplication:#{account_id}"
      weight = WEIGHTS[action]

      redis.zincrby(key, weight, target_account_id)
      redis.zremrangebyrank(key, 0, -MAX_ITEMS)
      redis.expire(key, EXPIRE_AFTER)
    end

    def remove(account_id, target_account_id)
      redis.zrem("healthexpertapplication:#{account_id}", target_account_id)
    end

    def get(account_id, limit: 10, offset: 0)
      account_ids = redis.zrevrange("healthexpertapplication:#{account_id}", offset, limit)
      return [] if account_ids.empty?
      Account.searchable.where(id: account_ids).local
    end
  end
end