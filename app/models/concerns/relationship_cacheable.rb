# frozen_string_literal: true

module RelationshipCacheable
  extend ActiveSupport::Concern

  included do
    after_commit :remove_relationship_cache
  end

  private

  def remove_relationship_cache
    if defined?(target_account_id)
      if target_account_id.present?
        Rails.cache.delete("relationship:#{account_id}:#{target_account_id}")
        Rails.cache.delete("relationship:#{target_account_id}:#{account_id}")
      end
    end
  end
end
