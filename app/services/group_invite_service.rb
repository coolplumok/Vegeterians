# frozen_string_literal: true

class GroupInviteService < BaseService
  include Redisable

  # Invite a remote user, notify remote user about the invite
  # @param [Account] source_account From which to invite
  # @param [Group] source_group From which to invite
  # @param [Strings, Accounts] uri User URIs to invite in the form of username@domain (or accounts record)
  # @param [true, false, nil] reblogs Whether or not to show reblogs, defaults to true
  def call(source_account, source_group, target_accounts, reblogs: nil)
    reblogs = true if reblogs.nil?
    
    target_accounts.each do |target_account|
      target_account = ResolveAccountService.new.call(target_account, skip_webfinger: true)

      raise ActiveRecord::RecordNotFound if target_account.nil? || target_account.id == source_account.id || target_account.suspended?
      raise GabSocial::NotPermittedError  if target_account.blocking?(source_account) || source_account.blocking?(target_account) || target_account.moved?

      ActivityTracker.increment('activity:groupinvites')

      if target_account.locked? || target_account.activitypub?
        request_group_invite(source_account, source_group, target_account, reblogs: reblogs)
      else
        direct_group_invite(source_account, source_group, target_account, reblogs: reblogs)
      end
    end
  end

  private

  def request_group_invite(source_account, source_group, target_account, reblogs: true)
    group_invite_request = GroupInviteRequest.create!(account: source_account, group: source_group, target_account: target_account, show_reblogs: reblogs)

    if target_account.local?
      LocalNotificationWorker.perform_async(target_account.id, group_invite_request.id, group_invite_request.class.name)
    elsif target_account.ostatus?
      NotificationWorker.perform_async(build_group_invite_request_xml(group_invite_request), source_account.id, target_account.id)
      AfterRemoteGroupInviteRequestWorker.perform_async(group_invite_request.id)
    elsif target_account.activitypub?
      ActivityPub::DeliveryWorker.perform_async(build_json(group_invite_request), source_account.id, target_account.inbox_url)
    end

    group_invite_request
  end

  def direct_group_invite(source_account, source_group, target_account, reblogs: true)
    group_invite = source_account.group_invite!(target_account, source_group, reblogs: reblogs)

    if target_account.local?
      LocalNotificationWorker.perform_async(target_account.id, group_invite.id, group_invite.class.name)
    else
      Pubsubhubbub::SubscribeWorker.perform_async(target_account.id) unless target_account.subscribed?
      NotificationWorker.perform_async(build_group_invite_xml(group_invite), source_account.id, target_account.id)
      AfterRemoteGroupInviteWorker.perform_async(group_invite.id)
    end

    MergeWorker.perform_async(target_account.id, source_account.id)

    group_invite
  end

  def build_group_invite_request_xml(group_invite_request)
    OStatus::AtomSerializer.render(OStatus::AtomSerializer.new.group_invite_request_salmon(group_invite_request))
  end

  def build_group_invite_xml(group_invite)
    OStatus::AtomSerializer.render(OStatus::AtomSerializer.new.group_invite_salmon(group_invite))
  end

  def build_json(group_invite_request)
    ActiveModelSerializers::SerializableResource.new(
      group_invite_request,
      serializer: ActivityPub::GroupInviteSerializer,
      adapter: ActivityPub::Adapter
    ).to_json
  end
end
