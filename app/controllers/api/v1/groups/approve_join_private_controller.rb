# frozen_string_literal: true

class Api::V1::Groups::ApproveJoinPrivateController < Api::BaseController
  include Authorization

  before_action -> { doorkeeper_authorize! :read, :'read:groups' }, only: [:show]
  before_action -> { doorkeeper_authorize! :write, :'write:groups' }, except: [:show]

  before_action :require_user!
  before_action :set_group
  before_action :set_target_accounts

  after_action :insert_pagination_headers, only: :show

  def show
    authorize @group, :show_join_private?

    @accounts = load_accounts
    render json: @accounts, each_serializer: REST::AccountSerializer
  end

  def create
    GroupApproveJoinPrivateService.new.call(current_user.account, @group, @target_accounts, reblogs: truthy_param?(:reblogs))

    render json: @group, serializer: REST::GroupSerializer
  end

  private
  def set_group
    @group = Group.find(params[:group_id])
  end

  def set_target_accounts
    @target_accounts = Account.where(id: params[:account_ids])
  end

  def load_accounts
    group_approve_join_privates_account_ids = @group.approve_join_privates.pluck(:account_id)
    if unlimited?
      Account.where(id: group_approve_join_privates_account_ids).includes(:account_stat).all
    else
      Account.where(id: group_approve_join_privates_account_ids).includes(:account_stat).paginate_by_max_id(limit_param(DEFAULT_ACCOUNTS_LIMIT), params[:max_id], params[:since_id])
    end
  end

  def insert_pagination_headers
    set_pagination_headers(next_path, prev_path)
  end

  def next_path
    return if unlimited?

    if records_continue?
      api_v1_group_approve_join_private_url pagination_params(max_id: pagination_max_id)
    end
  end

  def prev_path
    return if unlimited?

    unless @accounts.empty?
      api_v1_group_approve_join_private_url pagination_params(since_id: pagination_since_id)
    end
  end

  def pagination_max_id
    @accounts.last.id
  end

  def pagination_since_id
    @accounts.first.id
  end

  def records_continue?
    @accounts.size == limit_param(DEFAULT_ACCOUNTS_LIMIT)
  end

  def pagination_params(core_params)
    params.slice(:limit).permit(:limit).merge(core_params)
  end

  def unlimited?
    params[:limit] == '0'
  end
end
