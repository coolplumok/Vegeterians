# frozen_string_literal: true

class AfterRemoteGroupJoinPrivateWorker
  include Sidekiq::Worker

  sidekiq_options queue: 'pull', retry: 5

  attr_reader :group_join_private

  def perform(group_join_private_id)
    @group_join_private = GroupJoinPrivate.find(group_join_private_id)
    process_group_invite_service if processing_required?
  rescue ActiveRecord::RecordNotFound
    true
  end

  private

  def process_group_join_private_service
    group_join_private.destroy
    GroupJoinPrivateService.new.call(group_join_private.account, updated_group, updated_account.acct, updated_description)
  end

  def updated_account
    @_updated_account ||= FetchRemoteAccountService.new.call(group_join_private.target_account.remote_url)
  end

  def processing_required?
    !updated_account.nil? && updated_account.locked?
  end
end
