# frozen_string_literal: true

class InitialStateSerializer < ActiveModel::Serializer
  attributes :meta, :compose, :accounts,
             :media_attachments, :settings,
             :promotions

  has_one :push_subscription, serializer: REST::WebPushSubscriptionSerializer

  def meta
    store = {
      streaming_api_base_url: Rails.configuration.x.streaming_api_base_url,
      access_token: object.token,
      locale: I18n.locale,
      domain: Rails.configuration.x.local_domain,
      admin: object.admin&.id&.to_s,
      search_enabled: Chewy.enabled?,
      repository: GabSocial::Version.repository,
      source_url: GabSocial::Version.source_url,
      version: GabSocial::Version.to_s,
      invites_enabled: Setting.min_invite_role == 'user',
      mascot: instance_presenter.mascot&.file&.url,
      profile_directory: Setting.profile_directory,
    }

    if object.current_account
      store[:username]           = object.current_account.username
      store[:me]                 = object.current_account.id.to_s
      store[:unfollow_modal]     = object.current_account.user.setting_unfollow_modal
      store[:boost_modal]        = object.current_account.user.setting_boost_modal
      store[:delete_modal]       = object.current_account.user.setting_delete_modal
      store[:auto_play_gif]      = object.current_account.user.setting_auto_play_gif
      store[:display_media]      = object.current_account.user.setting_display_media
      store[:expand_spoilers]    = object.current_account.user.setting_expand_spoilers
      store[:group_in_home_feed] = object.current_account.user.setting_group_in_home_feed
      store[:is_staff]           = object.current_account.user.staff?
      store[:unread_count]       = unread_count object.current_account
      store[:last_read_notification_id] = object.current_account.user.last_read_notification
      store[:monthly_expenses_complete] = Redis.current.get("monthly_funding_amount") || 0
      store[:favourites_count]   = object.current_account.favourites.count.to_s
      store[:is_first_session]   = is_first_session object.current_account
    end

    store
  end

  def compose
    store = {}

    if object.current_account
      store[:me]                = object.current_account.id.to_s
      store[:default_privacy]   = object.current_account.user.setting_default_privacy
      store[:default_sensitive] = object.current_account.user.setting_default_sensitive
    end

    store[:text] = object.text if object.text

    store
  end

  def accounts
    store = {}
    store[object.current_account.id.to_s] = ActiveModelSerializers::SerializableResource.new(object.current_account, serializer: REST::AccountSerializer) if object.current_account
    store[object.admin.id.to_s]           = ActiveModelSerializers::SerializableResource.new(object.admin, serializer: REST::AccountSerializer) if object.admin
    store
  end

  def media_attachments
    { accept_content_types: MediaAttachment::IMAGE_FILE_EXTENSIONS + MediaAttachment::VIDEO_FILE_EXTENSIONS + MediaAttachment::IMAGE_MIME_TYPES + MediaAttachment::VIDEO_MIME_TYPES }
  end

  def promotions
    if object.current_account
      if object.current_account.is_pro ||  object.current_account.is_proplus
        return []
      end
    end

    ActiveModelSerializers::SerializableResource.new(Promotion.active, each_serializer: REST::PromotionSerializer)
  end

  private

  def unread_count(account)
    last_read = account.user.last_read_notification || 0
    account.notifications.where("id > #{last_read}").count
  end

  def instance_presenter
    @instance_presenter ||= InstancePresenter.new
  end

  def is_first_session(account)
    object.current_account.user.sign_in_count === 1
  end

end
