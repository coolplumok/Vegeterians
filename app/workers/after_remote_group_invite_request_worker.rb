# frozen_string_literal: true

class AfterRemoteGroupInviteRequestWorker
  include Sidekiq::Worker

  sidekiq_options queue: 'pull', retry: 5

  attr_reader :group_invite_request

  def perform(group_invite_request_id)
    @group_invite_request = GroupInviteRequest.find(group_invite_request_id)
    process_group_invite_service if processing_required?
  rescue ActiveRecord::RecordNotFound
    true
  end

  private

  def process_group_invite_service
    group_invite_request.destroy
    GroupInviteService.new.call(group_invite_request.account, updated_group, updated_account.acct)
  end

  def processing_required?
    !updated_account.nil? && !updated_account.locked?
  end

  def updated_account
    @_updated_account ||= FetchRemoteAccountService.new.call(group_invite_request.target_account.remote_url)
  end
end
