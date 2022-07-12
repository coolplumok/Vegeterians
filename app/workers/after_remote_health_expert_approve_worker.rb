# frozen_string_literal: true

class AfterRemoteHealthExpertApproveWorker
  include Sidekiq::Worker

  sidekiq_options queue: 'pull', retry: 5

  attr_reader :health_expert_approve

  def perform(health_expert_approve_id)
    @health_expert_approve = HealthExpertApprove.find(health_expert_approve_id)
    process_health_expert_approve_service if processing_required?
  rescue ActiveRecord::RecordNotFound
    true
  end

  private

  def process_health_expert_approve_service
    health_expert_approve.destroy
    HealthExpertApproveService.new.call(health_expert_approve.account, updated_account.acct)
  end

  def updated_account
    @_updated_account ||= FetchRemoteAccountService.new.call(health_expert_approve.target_account.remote_url)
  end

  def processing_required?
    !updated_account.nil? && updated_account.locked?
  end
end