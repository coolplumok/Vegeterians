# frozen_string_literal: true

class REST::ShortcutSerializer < ActiveModel::Serializer
  attributes :id, :account_id, :created_at, :shortcut_type, :shortcut_id

  def id
    object.id.to_s
  end

end
