# frozen_string_literal: true

class FollowLimitValidator < ActiveModel::Validator
  LIMIT = ENV.fetch('MAX_FOLLOWS_THRESHOLD', 7_500).to_i
  RATIO = ENV.fetch('MAX_FOLLOWS_RATIO', 1.1).to_f

  def validate(follow)
    return if follow.account.nil? || !follow.account.local?
    follow.errors.add(:base, I18n.t('users.follow_limit_reached', limit: self.class.limit_for_account(follow.account))) if limit_reached?(follow.account)
  end

  class << self
    def limit_for_account(account)
      adjusted_limit = account.is_pro || account.is_proplus ? 50000 : LIMIT

      if account.following_count < adjusted_limit
        adjusted_limit
      else
        [(account.followers_count * RATIO).round, adjusted_limit].max
      end
    end
  end

  private

  def limit_reached?(account)
    account.following_count >= self.class.limit_for_account(account)
  end
end
