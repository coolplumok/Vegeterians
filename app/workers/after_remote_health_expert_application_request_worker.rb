# frozen_string_literal: true

class AfterRemoteHealthExpertApplicationRequestWorker
  include Sidekiq::Worker

  sidekiq_options queue: 'pull', retry: 5

  attr_reader :health_expert_application_request

  def perform(health_expert_application_request_id)
    @health_expert_application_request = GroupJoinPrivateRequest.find(health_expert_application_request_id)
  rescue ActiveRecord::RecordNotFound
    true
  end

  private
end