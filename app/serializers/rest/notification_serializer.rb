# frozen_string_literal: true

class REST::NotificationSerializer < ActiveModel::Serializer
  attributes :id, :type, :created_at

  belongs_to :from_account, key: :account, serializer: REST::AccountSerializer
  belongs_to :target_status, key: :status, if: :status_type?, serializer: REST::StatusSerializer
  belongs_to :target_group, key: :group, if: :group_type?, serializer: REST::GroupSerializer
  belongs_to :target_health_expert_appication, key: :health_expert_application, if: :health_expert_type?, serializer: REST::HealthExpertApplicationSerializer

  def id
    object.id.to_s
  end

  def status_type?
    [:favourite, :reblog, :mention, :poll].include?(object.type)
  end

  def group_type?
    [:group_invite, :group_join_private, :group_approve_join_private].include?(object.type)
  end

  def health_expert_type?
    [:health_expert_application].include?(object.type)
  end
end
