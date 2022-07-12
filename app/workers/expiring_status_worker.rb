# frozen_string_literal: true

class ExpiringStatusWorker
  include Sidekiq::Worker

  sidekiq_options unique: :until_executed

  def perform(status_id)
    status = Status.find(status_id)
    RemovalWorker.perform_async(status.id)
  rescue ActiveRecord::RecordNotFound
    true
  end
end
