# frozen_string_literal: true

class Scheduler::UserCleanupScheduler
  include Sidekiq::Worker

  sidekiq_options unique: :until_executed, retry: 0

  def perform
    User.where('confirmed_at is NULL AND confirmation_sent_at <= ?', 2.days.ago).reorder(nil).find_in_batches do |batch|
      Account.where(id: batch.map(&:account_id)).delete_all
      User.where(id: batch.map(&:id)).delete_all
    end
  end
end
