# frozen_string_literal: true

class AfterRemoteGroupInviteWorker
  include Sidekiq::Worker

  sidekiq_options queue: 'pull', retry: 5

  attr_reader :group_invite

  def perform(group_invite_id)
    @group_invite = GroupInvite.find(group_invite_id)
    process_group_invite_service if processing_required?
  rescue ActiveRecord::RecordNotFound
    true
  end

  private

  def process_group_invite_service
    group_invite.destroy
    GroupInviteService.new.call(group_invite.account, updated_group, updated_account.acct)
  end

  def updated_account
    @_updated_account ||= FetchRemoteAccountService.new.call(group_invite.target_account.remote_url)
  end

  def processing_required?
    !updated_account.nil? && updated_account.locked?
  end
end
