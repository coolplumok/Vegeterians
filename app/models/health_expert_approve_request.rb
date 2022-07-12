# frozen_string_literal: true
# == Schema Information
#
# Table name: health_expert_approve_requests
#
#  id                :bigint(8)        not null, primary key
#  account_id        :integer          not null
#  target_account_id :integer          not null
#  show_reblogs      :boolean          default(TRUE), not null
#  uri               :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

class HealthExpertApproveRequest < ApplicationRecord
  include Paginable
  include RelationshipCacheable

  belongs_to :account
  belongs_to :target_account, class_name: 'Account'

  has_one :notification, as: :activity, dependent: :destroy

  def local?
    false # Force uri_for to use uri attribute
  end

  before_validation :set_uri, only: :create

  private

  def set_uri
    self.uri = ActivityPub::TagManager.instance.generat
  end
end
