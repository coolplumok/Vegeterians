# frozen_string_literal: true
# == Schema Information
#
# Table name: health_expert_applications
#
#  id                     :bigint(8)        not null, primary key
#  account_id             :integer          not null
#  training_certification :string           not null
#  website_url            :string
#  facebook_url           :string
#  twitter_url            :string
#  instagram_url          :string
#  telegram_url           :string
#  youtube_url            :string
#  show_reblogs           :boolean          default(TRUE), not null
#  uri                    :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#

class HealthExpertApplication < ApplicationRecord
  include Paginable
  include RelationshipCacheable

  belongs_to :account

  has_one :notification, as: :activity, dependent: :destroy

  def local?
    false # Force uri_for to use uri attribute
  end

  before_validation :set_uri, only: :create

  private

  def set_uri
    self.uri = ActivityPub::TagManager.instance.generate_uri_for(self) if uri.nil?
  end
end
