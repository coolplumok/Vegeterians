# frozen_string_literal: true

class REST::GroupSerializer < ActiveModel::Serializer
  include RoutingHelper

  attributes :id, :title, :description, :cover_image_url, :is_archived, :is_featured, :is_privated, :member_count, :pending_application_count, :created_at

  def id
    object.id.to_s
  end

  def clean_migrated_url
    object
      .cover_image_file_name
      .sub("gab://groups/", "https://Vegeterians.live/media/user/")
  end

  def cover_image_url
    if object.cover_image_file_name and object.cover_image_file_name.start_with? "gab://groups/"
      return clean_migrated_url
    end

    full_asset_url(object.cover_image.url)
  end

  def pending_application_count
    object.pending_applications.count
  end
end
