# frozen_string_literal: true
# == Schema Information
#
# Table name: group_invites
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

class GroupInvite < ApplicationRecord
  include Paginable
  include RelationshipCacheable

  belongs_to :account
  belongs_to :group
  belongs_to :target_account, class_name: 'Account'

  has_one :notification, as: :activity, dependent: :destroy

  scope :recent, -> { reorder(id: :desc) }

  def local?
    false # Force uri_for to use uri attribute
  end

  def revoke_request!
    GroupInviteRequest.create!(account: account, group: group, target_account: target_account, show_reblogs: show_reblogs, uri: uri)
    destroy!
  end

  before_validation :set_uri, only: :create

  private

  def set_uri
    self.uri = ActivityPub::TagManager.instance.generate_uri_for(self) if uri.nil?
  end
end
