# frozen_string_literal: true

class ActivityPub::GroupInviteSerializer < ActivityPub::Serializer
  attributes :id, :type, :actor
  attribute :virtual_object, key: :object

  def id
    ActivityPub::TagManager.instance.uri_for(object) || [ActivityPub::TagManager.instance.uri_for(object.account), '#group/invites/', object.id].join
  end

  def type
    'GroupInvite'
  end

  def actor
    ActivityPub::TagManager.instance.uri_for(object.account)
  end

  def virtual_object
    ActivityPub::TagManager.instance.uri_for(object.target_account)
  end
end
