# frozen_string_literal: true

class REST::HealthExpertApplicationSerializer < ActiveModel::Serializer
  include RoutingHelper

  attributes :training_certification, :website_url, :facebook_url, :twitter_url, :instagram_url, :telegram_url, :youtube_url
end