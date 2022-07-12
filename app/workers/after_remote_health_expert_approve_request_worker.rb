# frozen_string_literal: true

class AfterRemoteHealthExpertApproveRequestWorker
  include Sidekiq::Worker

  sidekiq_options queue: 'pull', retry: 5

  attr_reader :health_expert_approve_request

  def perform(health_expert_approve_request_id)
    @health_expert_approve_request = GroupApproveJoinPrivateRequest.find(health_expert_approve_request_id)
    process_health_expert_approve_request_service if processing_required?
  rescue ActiveRecord::RecordNotFound
    true
  end

  private

  def process_health_expert_approve_request_service
    health_expert_approve_request.destroy
    GroupApproveJoinPrivateService.new.call(health_expert_approve_request.account, updated_account.acct)
  end

  def processing_required?
    !updated_account.nil? && !updated_account.locked?
  end

  def updated_account
    @_updated_account ||= FetchRemoteAccountService.new.call(health_expert_approve_request.target_account.remote_url)
  end
end