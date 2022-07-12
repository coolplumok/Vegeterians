# frozen_string_literal: true
# == Schema Information
#
# Table name: notifications
#
#  id              :bigint(8)        not null, primary key
#  activity_id     :bigint(8)        not null
#  activity_type   :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  account_id      :bigint(8)        not null
#  from_account_id :bigint(8)        not null
#

class Notification < ApplicationRecord
  include Paginable
  include Cacheable

  TYPE_CLASS_MAP = {
    mention:                              'Mention',
    reblog:                               'Status',
    follow:                               'Follow',
    follow_request:                       'FollowRequest',
    favourite:                            'Favourite',
    poll:                                 'Poll',
    group_invite:                         'GroupInvite',
    group_invite_request:                 'GroupInviteRequest',
    group_join_private:                   'GroupJoinPrivate',
    group_join_private_request:           'GroupJoinPrivateRequest',
    group_approve_join_private:           'GroupApproveJoinPrivate',
    group_approve_join_private_request:   'GroupApproveJoinPrivateRequest',
    health_expert_application:            'HealthExpertApplication',
    health_expert_application_request:    'HealthExpertApplicationRequest',
    health_expert_approve:                'HealthExpertApprove',
    health_expert_approve_request:        'HealthExpertApproveRequest',
  }.freeze

  STATUS_INCLUDES = [:account, :application, :preloadable_poll, :media_attachments, :tags, active_mentions: :account, reblog: [:account, :application, :preloadable_poll, :media_attachments, :tags, active_mentions: :account]].freeze

  belongs_to :account, optional: true
  belongs_to :from_account, class_name: 'Account', optional: true
  belongs_to :activity, polymorphic: true, optional: true

  belongs_to :mention,                              foreign_type: 'Mention',                            foreign_key: 'activity_id', optional: true
  belongs_to :status,                               foreign_type: 'Status',                             foreign_key: 'activity_id', optional: true
  belongs_to :follow,                               foreign_type: 'Follow',                             foreign_key: 'activity_id', optional: true
  belongs_to :follow_request,                       foreign_type: 'FollowRequest',                      foreign_key: 'activity_id', optional: true
  belongs_to :favourite,                            foreign_type: 'Favourite',                          foreign_key: 'activity_id', optional: true
  belongs_to :poll,                                 foreign_type: 'Poll',                               foreign_key: 'activity_id', optional: true
  belongs_to :group_invite,                         foreign_type: 'GroupInvite',                        foreign_key: 'activity_id', optional: true
  belongs_to :group_invite_request,                 foreign_type: 'GroupInviteRequest',                 foreign_key: 'activity_id', optional: true
  belongs_to :group_join_private,                   foreign_type: 'GroupJoinPrivate',                   foreign_key: 'activity_id', optional: true
  belongs_to :group_join_private_request,           foreign_type: 'GroupJoinPrivateRequest',            foreign_key: 'activity_id', optional: true
  belongs_to :group_approve_join_private,           foreign_type: 'GroupApproveJoinPrivate',            foreign_key: 'activity_id', optional: true
  belongs_to :group_approve_join_private_request,   foreign_type: 'GroupApproveJoinPrivateRequest',     foreign_key: 'activity_id', optional: true
  belongs_to :health_expert_application,            foreign_type: 'HealthExpertApplication',            foreign_key: 'activity_id', optional: true
  belongs_to :health_expert_application_request,    foreign_type: 'HealthExpertApplicationRequest',     foreign_key: 'activity_id', optional: true
  belongs_to :health_expert_approve,                foreign_type: 'HealthExpertApprove',                foreign_key: 'activity_id', optional: true
  belongs_to :health_expert_approve_request,        foreign_type: 'HealthExpertApproveRequest',         foreign_key: 'activity_id', optional: true

  validates :account_id, uniqueness: { scope: [:activity_type, :activity_id] }
  validates :activity_type, inclusion: { in: TYPE_CLASS_MAP.values }

  scope :browserable, ->(exclude_types = [], account_id = nil, only_verified = false, only_following = false) {
    types = TYPE_CLASS_MAP.values - activity_types_from_types(exclude_types + [:follow_request])

    # Notification.includes(:from_account).where(activity_type: types, accounts: {
    #   is_verified: true
    # })

    theOptions = { :activity_type => types }

    if !account_id.nil?
      theOptions.from_account_id = account_id
    end

    if only_verified
      theOptions[:accounts] = {
        :is_verified => true
      }

      Notification.includes(:from_account).where(theOptions)
    else
      where(theOptions)
    end
  }

  cache_associated :from_account, status: STATUS_INCLUDES, mention: [status: STATUS_INCLUDES], favourite: [:account, status: STATUS_INCLUDES], follow: :account, poll: [status: STATUS_INCLUDES], group_invite: [:account, :group], group_join_private: [:account, :group], group_approve_join_private: [:account, :group], health_expert_application: [:account], health_expert_approve: [:account]

  def type
    @type ||= TYPE_CLASS_MAP.invert[activity_type].to_sym
  end

  def target_status
    case type
      when :reblog
        return status if status&.quote?
        status&.reblog
      when :favourite
        favourite&.status
      when :mention
        mention&.status
      when :poll
        poll&.status
    end
  end

  def target_group
    case type
      when :group_invite
        group_invite.group
      when :group_join_private
        group_join_private.group
      when :group_approve_join_private
        group_approve_join_private.group
    end
  end

  def target_health_expert_appication
    case type
      when :health_expert_application
        health_expert_application
    end
  end

  def browserable?
    type != :follow_request
  end

  def mark_read!
    user = account.user
    is_newer = self.id > (user.last_read_notification || -1)

    if is_newer
      user.last_read_notification = self.id
      user.save!
    else false
    end
  end

  class << self
    def cache_ids
      select(:id, :updated_at, :activity_type, :activity_id)
    end

    def reload_stale_associations!(cached_items)
      account_ids = (cached_items.map(&:from_account_id) + cached_items.map { |item| item.target_status&.account_id }.compact).uniq

      return if account_ids.empty?

      accounts = Account.where(id: account_ids).includes(:account_stat).each_with_object({}) { |a, h| h[a.id] = a }

      cached_items.each do |item|
        item.from_account = accounts[item.from_account_id]
        item.target_status.account = accounts[item.target_status.account_id] if item.target_status
      end
    end

    def activity_types_from_types(types)
      types.map { |type| TYPE_CLASS_MAP[type.to_sym] }.compact
    end
  end

  after_initialize :set_from_account
  before_validation :set_from_account

  private

  def set_from_account
    return unless new_record?

    case activity_type
      when 'Status', 'Follow', 'Favourite', 'FollowRequest', 'Poll', 'GroupInvite', 'GroupInviteRequest', 'GroupJoinPrivate', 'GroupJoinPrivateRequest', 'GroupApproveJoinPrivate', 'GroupApproveJoinPrivateRequest', 'HealthExpertApplication', 'HealthExpertApplicationRequest', 'HealthExpertApprove', 'HealthExpertApproveRequest'
        self.from_account_id = activity&.account_id
      when 'Mention'
        self.from_account_id = activity&.status&.account_id
    end
  end
end
