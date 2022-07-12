# frozen_string_literal: true

class HealthExpertApplicationService < BaseService
  include Redisable

  # Invite a remote user, notify remote user about the application
  # @param [Account] source_account From which to application  
  # @param [Strings] information for application
  # @param [Strings, Accounts] uri User URIs to join in the form of username@domain (or accounts record)
  # @param [true, false, nil] reblogs Whether or not to show reblogs, defaults to true
  def call(source_account, target_accounts, appliation_info, reblogs: nil)
    reblogs = true if reblogs.nil?

    training_certification = ''    
    website_url = ''
    facebook_url = ''
    twitter_url = ''
    instagram_url = ''
    telegram_url = ''
    youtube_url = ''
    if appliation_info[:training_certification].present?
      training_certification = appliation_info[:training_certification]
    end
    if appliation_info[:website_url].present?
      website_url = appliation_info[:website_url]
    end
    if appliation_info[:facebook_url].present?
      facebook_url = appliation_info[:facebook_url]
    end
    if appliation_info[:twitter_url].present?
      twitter_url = appliation_info[:twitter_url]
    end
    if appliation_info[:instagram_url].present?
      instagram_url = appliation_info[:instagram_url]
    end
    if appliation_info[:telegram_url].present?
      telegram_url = appliation_info[:telegram_url]
    end
    if appliation_info[:youtube_url].present?
      youtube_url = appliation_info[:youtube_url]
    end

    health_expert_application_request = nil
    health_expert_application = nil

    health_expert_application_request_exist = false
    health_expert_application_exist = false

    if !source_account.health_expert_application_request.nil?
      health_expert_application_request = source_account.health_expert_application_request
      health_expert_application_request.update(
        training_certification: training_certification,
        website_url: website_url,
        facebook_url: facebook_url,
        twitter_url: twitter_url,
        instagram_url: instagram_url,
        telegram_url: telegram_url,
        youtube_url: youtube_url,
        show_reblogs: reblogs
      )
      health_expert_application_request_exist = true
    end

    if !source_account.health_expert_application.nil?
      health_expert_application = source_account.health_expert_application
      health_expert_application.update(
        training_certification: training_certification,
        website_url: website_url,
        facebook_url: facebook_url,
        twitter_url: twitter_url,
        instagram_url: instagram_url,
        telegram_url: telegram_url,
        youtube_url: youtube_url,
        show_reblogs: reblogs
      )
      health_expert_application_exist = true
    end

    target_accounts.each do |target_account|
      target_account = ResolveAccountService.new.call(target_account, skip_webfinger: true)

      raise ActiveRecord::RecordNotFound if target_account.nil? || target_account.id == source_account.id || target_account.suspended?
      raise GabSocial::NotPermittedError  if target_account.blocking?(source_account) || source_account.blocking?(target_account) || target_account.moved?

      ActivityTracker.increment('activity:healthexpertapplication')

      if target_account.locked? || target_account.activitypub?
        if !health_expert_application_request_exist
          if health_expert_application_request.nil?
            health_expert_application_request = HealthExpertApplicationRequest.create!(
              account: source_account,
              training_certification: training_certification,
              website_url: website_url,
              facebook_url: facebook_url,
              twitter_url: twitter_url,
              instagram_url: instagram_url,
              telegram_url: telegram_url,
              youtube_url: youtube_url,
              show_reblogs: reblogs
            )
          end

          request_apply_health_expert(source_account, target_account, health_expert_application_request, reblogs: reblogs)
        end
      else
        if !health_expert_application_exist
          if health_expert_application.nil?
            health_expert_application = HealthExpertApplication.create!(
              account: source_account,
              training_certification: training_certification,
              website_url: website_url,
              facebook_url: facebook_url,
              twitter_url: twitter_url,
              instagram_url: instagram_url,
              telegram_url: telegram_url,
              youtube_url: youtube_url,
              show_reblogs: reblogs
            )
          end

          direct_apply_health_expert(source_account, target_account, health_expert_application, reblogs: reblogs)
        end
      end
    end
  end

  private

  def request_apply_health_expert(source_account, target_account, health_expert_application_request, reblogs: true)
    if target_account.local?
      LocalNotificationWorker.perform_async(target_account.id, health_expert_application_request.id, health_expert_application_request.class.name)
    elsif target_account.ostatus?
      NotificationWorker.perform_async(build_health_expert_application_request_xml(health_expert_application_request), source_account.id, target_account.id)
      AfterRemoteHealthExpertApplicationRequestWorker.perform_async(health_expert_application_request.id)
    elsif target_account.activitypub?
      ActivityPub::DeliveryWorker.perform_async(build_json(health_expert_application_request), source_account.id, target_account.inbox_url)
    end

    health_expert_application_request
  end

  def direct_apply_health_expert(source_account, target_account, health_expert_application, reblogs: true)
    if target_account.local?
      LocalNotificationWorker.perform_async(target_account.id, health_expert_application.id, health_expert_application.class.name)
    else
      Pubsubhubbub::SubscribeWorker.perform_async(target_account.id) unless target_account.subscribed?
      NotificationWorker.perform_async(build_expert_application_xml(health_expert_application), source_account.id, target_account.id)
      AfterRemoteHealthExpertApplicationWorker.perform_async(health_expert_application.id)
    end

    MergeWorker.perform_async(target_account.id, source_account.id)

    health_expert_application
  end

  def build_health_expert_application_request_xml(health_expert_application_request)
    OStatus::AtomSerializer.render(OStatus::AtomSerializer.new.health_expert_application_request_salmon(health_expert_application_request))
  end

  def build_expert_application_xml(health_expert_application)
    OStatus::AtomSerializer.render(OStatus::AtomSerializer.new.health_expert_application_salmon(health_expert_application))
  end

  def build_json(health_expert_application_request)
    ActiveModelSerializers::SerializableResource.new(
      health_expert_application_request,
      serializer: ActivityPub::HealthExpertApplicationSerializer,
      adapter: ActivityPub::Adapter
    ).to_json
  end
end