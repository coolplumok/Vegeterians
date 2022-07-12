# frozen_string_literal: true

class GroupJoinPrivateService < BaseService
  include Redisable

  # Invite a remote user, notify remote user about the join
  # @param [Account] source_account From which to join
  # @param [Group] source_group From which to join
  # @param [Strings, Accounts] uri User URIs to join in the form of username@domain (or accounts record)
  # @param [Strings] description for joing to the group
  # @param [true, false, nil] reblogs Whether or not to show reblogs, defaults to true
  def call(source_account, source_group, target_account, description, reblogs: nil)
    reblogs = true if reblogs.nil?

    target_account = ResolveAccountService.new.call(target_account, skip_webfinger: true)
    
    raise ActiveRecord::RecordNotFound if target_account.nil? || target_account.id == source_account.id || target_account.suspended?
    raise GabSocial::NotPermittedError  if target_account.blocking?(source_account) || source_account.blocking?(target_account) || target_account.moved?

    ActivityTracker.increment('activity:groupjoinprivate')

    if target_account.locked? || target_account.activitypub?
      request_group_join(source_account, source_group, target_account, description, reblogs: reblogs)
    else
      direct_group_join(source_account, source_group, target_account, description, reblogs: reblogs)
    end
  end

  private

  def request_group_join(source_account, source_group, target_account, description, reblogs: true)
    group_join_request = GroupJoinPrivateRequest.create!(account: source_account, group: source_group, target_account: target_account, description: description, show_reblogs: reblogs)

    if target_account.local?
      LocalNotificationWorker.perform_async(target_account.id, group_join_request.id, group_join_request.class.name)
    elsif target_account.ostatus?
      NotificationWorker.perform_async(build_group_join_request_xml(group_join_request), source_account.id, target_account.id)
      AfterRemoteGroupJoinPrivateRequestWorker.perform_async(group_join_request.id)
    elsif target_account.activitypub?
      ActivityPub::DeliveryWorker.perform_async(build_json(group_join_request), source_account.id, target_account.inbox_url)
    end

    group_join_request
  end

  def direct_group_join(source_account, source_group, target_account, description, reblogs: true)
    group_join = source_account.group_join_private!(target_account, source_group, description, reblogs: reblogs)

    if target_account.local?
      LocalNotificationWorker.perform_async(target_account.id, group_join.id, group_join.class.name)
    else
      Pubsubhubbub::SubscribeWorker.perform_async(target_account.id) unless target_account.subscribed?
      NotificationWorker.perform_async(build_group_join_xml(group_join), source_account.id, target_account.id)
      AfterRemoteGroupJoinPrivateWorker.perform_async(group_join.id)
    end

    MergeWorker.perform_async(target_account.id, source_account.id)

    group_join
  end

  def build_group_join_request_xml(group_join_request)
    OStatus::AtomSerializer.render(OStatus::AtomSerializer.new.group_join_private_request_salmon(group_join_request))
  end

  def build_group_join_xml(group_join)
    OStatus::AtomSerializer.render(OStatus::AtomSerializer.new.group_join_private_salmon(group_join))
  end

  def build_json(group_join_request)
    ActiveModelSerializers::SerializableResource.new(
      group_join_request,
      serializer: ActivityPub::GroupJoinPrivateSerializer,
      adapter: ActivityPub::Adapter
    ).to_json
  end
end
