# frozen_string_literal: true

class VerifiedSuggestions
  EXPIRE_AFTER = 12.minute.seconds
  MAX_ITEMS = 12
  VERFIED_KEY = 'verifiedsuggestions'
  PRO_KEY     = 'prosuggestions'
  PROPLUS_KEY = 'proplusuggestions'

  class << self
    include Redisable

    def set(ids, key)
      return if ids.nil? || ids.empty?
      redis.setex(key, EXPIRE_AFTER, ids)
    end

    def get(account_id)
      account_ids         = redis.get(VERFIED_KEY)
      proplus_account_ids = redis.get(PROPLUS_KEY)
      pro_account_ids     = redis.get(PRO_KEY)

      if (account_ids.nil? || account_ids.empty?) && (proplus_account_ids.nil? || proplus_account_ids.empty?) &&
        (pro_account_ids.nil? || pro_account_ids.empty?)
        proplus_account_ids = Account.searchable
          .where(is_proplus: true)
          .discoverable
          .by_recent_status
          .local
          .pluck(:id)

        pro_account_ids = Account.searchable
          .where(is_pro: true)
          .discoverable
          .by_recent_status
          .local
          .pluck(:id)

        account_ids = Account.searchable
          .where(is_verified: true)
          .discoverable
          .by_recent_status
          .local
          .pluck(:id)

        set(proplus_account_ids, PROPLUS_KEY) if proplus_account_ids.nil? || proplus_account_ids.empty?
        set(pro_account_ids, PRO_KEY)         if pro_account_ids.nil? || pro_account_ids.empty?
        set(account_ids, VERFIED_KEY)         if account_ids.nil? || account_ids.empty?
      else
        proplus_account_ids = JSON.parse(account_ids)
        pro_account_ids     = JSON.parse(pro_account_ids)
        account_ids         = JSON.parse(account_ids)
      end

      proplus_accounts = if proplus_account_ids.nil? || proplus_account_ids.empty?
        []
      else
        Account.where(id: proplus_account_ids)
      end

      pro_accounts = if pro_account_ids.nil? || pro_account_ids.empty?
        []
      else
        Account.where(id: pro_account_ids)
      end

      accounts = if account_ids.nil? || account_ids.empty?
        []
      else
        Account.where(id: account_ids)
      end

      return (proplus_accounts + pro_accounts + accounts).uniq
    end
  end
end
