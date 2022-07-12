# frozen_string_literal: true

class AfterRemoteHealthExpertApplicationWorker
  include Sidekiq::Worker

  sidekiq_options queue: 'pull', retry: 5

  attr_reader :health_expert_application

  def perform(health_expert_application_id)
    @health_expert_application = HealthExpertApplication.find(health_expert_application_id)
  rescue ActiveRecord::RecordNotFound
    true
  end

  private
end