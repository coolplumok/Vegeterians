# frozen_string_literal: true

class Scheduler::BackupCleanupScheduler
  include Sidekiq::Worker

  sidekiq_options unique: :until_executed, retry: 0

  def perform
    old_backups.reorder(nil).find_each(&:destroy!)
  end

  private

  def old_backups
    Backup.where('created_at < ?', 7.days.ago)
  end
end
