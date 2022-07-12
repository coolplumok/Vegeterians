# frozen_string_literal: true

class REST::GroupRelationshipSerializer < ActiveModel::Serializer
  attributes :id, :member, :admin, :moderator, :join_sent

  def id
    object.id.to_s
  end

  def member
    instance_options[:relationships].member[object.id] ? true : false
  end

  def admin
    instance_options[:relationships].admin[object.id] ? true : false
  end

  def moderator
    instance_options[:relationships].moderator[object.id] ? true : false
  end
   
  def join_sent
    instance_options[:relationships].join_sent[object.id] ? true : false
  end
end
