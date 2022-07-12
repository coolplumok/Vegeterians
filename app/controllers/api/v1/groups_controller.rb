# frozen_string_literal: true

class Api::V1::GroupsController < Api::BaseController
  include Authorization

  before_action -> { doorkeeper_authorize! :read, :'read:groups' }, only: [:index, :show]
  before_action -> { doorkeeper_authorize! :write, :'write:groups' }, except: [:index, :show]

  before_action :require_user!, except: [:index, :show]
  before_action :set_group, except: [:index, :create]

  def index
    case current_tab
      when 'all'
        @groups = Group.where(is_archived: false).limit(100).order('created_at DESC').all
      when 'featured'
        @groups = Group.where(is_featured: true, is_archived: false).limit(100).all
      when 'privated'
        @groups = Group.where(is_privated: true, is_archived: false).limit(100).all
      when 'new'
        if !current_user
          render json: { error: 'This method requires an authenticated user' }, status: 422
        end
        @groups = Group.where(is_archived: false).limit(24).order('created_at DESC').all
      when 'member'
        if !current_user
          render json: { error: 'This method requires an authenticated user' }, status: 422
        end
        @groups = Group.joins(:group_accounts).where(is_archived: false, group_accounts: { account: current_account }).order('group_accounts.id DESC').all
      when 'admin'
        if !current_user
          render json: { error: 'This method requires an authenticated user' }, status: 422
        end
        @groups = Group.joins(:group_accounts).where(is_archived: false, group_accounts: { account: current_account, role: :admin }).all
      when 'onboarding'
        @groups = Group.where(is_featured: true, is_privated: [nil, false], is_archived: false).limit(100).all
    end

    render json: @groups, each_serializer: REST::GroupSerializer
  end

  def current_tab 
    tab = 'all'
    tab = params[:tab] if ['all', 'featured', 'privated', 'member', 'admin', 'new', 'onboarding'].include? params[:tab]
    return tab
  end

  def show
    render json: @group, serializer: REST::GroupSerializer
  end

  def create
    authorize :group, :create?
    
    @group = Group.create!(group_params.merge(account: current_account))
    render json: @group, serializer: REST::GroupSerializer
  end

  def update
    authorize @group, :update?

    @group.update!(group_params)
    render json: @group, serializer: REST::GroupSerializer
  end

  def destroy
    authorize @group, :destroy?

    @group.is_archived = true
    @group.save!
    render_empty
  end

  def destroy_status
    authorize @group, :destroy_status?

    status = Status.find(params[:status_id])
    GroupUnlinkStatusService.new.call(current_account, @group, status)
    render_empty
  end

  def approve_status
    authorize @group, :approve_status?

    status = Status.find(params[:status_id])
    GroupApproveStatusService.new.call(current_account, @group, status)
    render_empty
  end

  def make_public
    authorize @group, :update?

    @group.update!(is_privated: false)
    render_empty
  end

  def make_private
    authorize @group, :update?
    
    @group.update!(is_privated: true)
    render_empty
  end

  private

  def set_group
    @group = Group.where(id: params[:id], is_archived: false).first
  end

  def group_params
    params.permit(:title, :cover_image, :description, :is_privated)
  end
end
