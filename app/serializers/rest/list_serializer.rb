# frozen_string_literal: true

class REST::ListSerializer < ActiveModel::Serializer
  attributes :id, :title, :created_at

  def id
    object.id.to_s
  end

end
