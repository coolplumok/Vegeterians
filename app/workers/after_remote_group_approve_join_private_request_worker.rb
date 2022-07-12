# frozen_string_literal: true

class AfterRemoteGroupJoinPrivateRequestWorker
  include Sidekiq::Worker

  sidekiq_options queue: 'pull', retry: 5

  attr_reader :group_approve_join_private_request

  def perform(group_approve_join_private_request_id)
    @group_approve_join_private_request = GroupApproveJoinPrivateRequest.find(group_approve_join_private_request_id)
    process_group_approve_join_private_service if processing_required?
  rescue ActiveRecord::RecordNotFound
    true
  end

  private

  def process_group_approve_join_private_service
    group_approve_join_private_request.destroy
    GroupApproveJoinPrivateService.new.call(group_approve_join_private_request.account, updated_group, updated_account.acct)
  end

  def processing_required?
    !updated_account.nil? && !updated_account.locked?
  end

  def updated_account
    @_updated_account ||= FetchRemoteAccountService.new.call(group_approve_join_private_request.target_account.remote_url)
  end
end
