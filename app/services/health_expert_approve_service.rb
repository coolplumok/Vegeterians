# frozen_string_literal: true

class HealthExpertApproveService < BaseService
  include Redisable

  # Invite a remote user, notify remote user about the Approve
  # @param [Account] source_account From which to Approve  
  # @param [Strings] information for Approve
  # @param [Strings, Accounts] uri User URIs to join in the form of username@domain (or accounts record)
  # @param [true, false, nil] reblogs Whether or not to show reblogs, defaults to true
  def call(source_account, target_account, reblogs: nil)
    reblogs = true if reblogs.nil?

    target_account = ResolveAccountService.new.call(target_account, skip_webfinger: true)

    raise ActiveRecord::RecordNotFound if target_account.nil? || target_account.id == source_account.id || target_account.suspended?
    raise GabSocial::NotPermittedError  if target_account.blocking?(source_account) || source_account.blocking?(target_account) || target_account.moved?

    ActivityTracker.increment('activity:healthexpertapprove')

    target_account.is_expert = true
    target_account.save!

    if target_account.locked? || target_account.activitypub?
      request_approve_health_expert(source_account, target_account, reblogs: reblogs)
    else
      direct_approve_health_expert(source_account, target_account, reblogs: reblogs)
    end
  end

  private

  def request_approve_health_expert(source_account, target_account, reblogs: true)
    health_expert_application_request = HealthExpertApplicationRequest.findby(account: target_account)
    health_expert_application_request.delete

    health_expert_approve_request = HealthExpertApproveRequest.create!(account: source_account, show_reblogs: reblogs)

    if target_account.local?
      LocalNotificationWorker.perform_async(target_account.id, health_expert_approve_request.id, health_expert_approve_request.class.name)
    elsif target_account.ostatus?
      NotificationWorker.perform_async(build_health_expert_approve_request_xml(health_expert_approve_request), source_account.id, target_account.id)
      AfterRemoteHealthExpertApproveRequestWorker.perform_async(health_expert_approve_request.id)
    elsif target_account.activitypub?
      ActivityPub::DeliveryWorker.perform_async(build_json(health_expert_approve_request), source_account.id, target_account.inbox_url)
    end

    health_expert_approve_request
  end

  def direct_approve_health_expert(source_account, target_account, reblogs: true)
    health_expert_application = target_account.health_expert_application.destroy

    health_expert_approve = source_account.health_expert_approve!(target_account, reblogs: reblogs)

    if target_account.local?
      LocalNotificationWorker.perform_async(target_account.id, health_expert_approve.id, health_expert_approve.class.name)
    else
      Pubsubhubbub::SubscribeWorker.perform_async(target_account.id) unless target_account.subscribed?
      NotificationWorker.perform_async(build_expert_approve_xml(health_expert_approve), source_account.id, target_account.id)
      AfterRemoteHealthExpertApproveWorker.perform_async(health_expert_approve.id)
    end

    MergeWorker.perform_async(target_account.id, source_account.id)

    health_expert_approve
  end

  def build_health_expert_approve_request_xml(health_expert_approve_request)
    OStatus::AtomSerializer.render(OStatus::AtomSerializer.new.health_expert_approve_request_salmon(health_expert_approve_request))
  end

  def build_expert_approve_xml(health_expert_approve)
    OStatus::AtomSerializer.render(OStatus::AtomSerializer.new.health_expert_approve_salmon(health_expert_approve))
  end

  def build_json(health_expert_approve_request)
    ActiveModelSerializers::SerializableResource.new(
      health_expert_approve_request,
      serializer: ActivityPub::HealthExpertApproveSerializer,
      adapter: ActivityPub::Adapter
    ).to_json
  end
end