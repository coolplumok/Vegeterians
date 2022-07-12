# frozen_string_literal: true

class ActivityPub::HealthExpertApproveSerializer < ActivityPub::Serializer
  attributes :id, :type, :actor

  def id
    ActivityPub::TagManager.instance.uri_for(object) || [ActivityPub::TagManager.instance.uri_for(object.account), '#account/health_expert/approves/', object.id].join
  end

  def type
    'HealthExpertApprove'
  end

  def actor
    ActivityPub::TagManager.instance.uri_for(object.account)
  end
end