# frozen_string_literal: true

class Api::V1::Groups::InviteFollowersController < Api::BaseController
  include Authorization

  before_action -> { doorkeeper_authorize! :read, :'read:groups' }, only: [:show]
  before_action -> { doorkeeper_authorize! :write, :'write:groups' }, except: [:show]

  before_action :require_user!
  before_action :set_group
  before_action :set_followers

  def create
    GroupInviteService.new.call(current_user.account, @group, @followers, reblogs: truthy_param?(:reblogs))

    render json: @group, serializer: REST::GroupRelationshipSerializer, relationships: relationships
  end

  private

  def relationships
    GroupRelationshipsPresenter.new([@group.id], current_user.account_id)
  end

  def set_group
    @group = Group.find(params[:group_id])
  end

  def set_followers
    @followers = Account.where(id: params[:followers])
  end
end
