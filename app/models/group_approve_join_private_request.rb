# frozen_string_literal: true
# == Schema Information
#
# Table name: group_approve_join_private_requests
#
#  id                :bigint(8)        not null, primary key
#  account_id        :integer          not null
#  group_id          :integer          not null
#  target_account_id :integer          not null
#  show_reblogs      :boolean          default(TRUE), not null
#  uri               :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

class GroupApproveJoinPrivateRequest < ApplicationRecord  
  include Paginable
  include RelationshipCacheable

  belongs_to :account
  belongs_to :group
  belongs_to :target_account, class_name: 'Account'
  
  has_one :notification, as: :activity, dependent: :destroy
  
  validates :account_id, uniqueness: { scope: :group_id }
  
  def local?
    false # Force uri_for to use uri attribute
  end

  before_validation :set_uri, only: :create

  private

  def set_uri
    self.uri = ActivityPub::TagManager.instance.generate_uri_for(self) if uri.nil?
  end
end
