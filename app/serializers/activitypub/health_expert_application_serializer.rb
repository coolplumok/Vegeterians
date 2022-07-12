# frozen_string_literal: true

class ActivityPub::HealthExpertApplicationSerializer < ActivityPub::Serializer
  attributes :id, :type, :actor

  def id
    ActivityPub::TagManager.instance.uri_for(object) || [ActivityPub::TagManager.instance.uri_for(object.account), '#account/health_expert/applications/', object.id].join
  end

  def type
    'HealthExpertApplication'
  end

  def actor
    ActivityPub::TagManager.instance.uri_for(object.account)
  end
end