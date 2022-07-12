# frozen_string_literal: true

class Api::V1::Accounts::HealthExpertApproveAccountsController < Api::BaseController
  before_action -> { doorkeeper_authorize! :read, :'read:accounts' }
  before_action :set_account
  after_action :insert_pagination_headers, only: :index

  respond_to :json

  def index
    @accounts = load_accounts
    render json: @accounts, each_serializer: REST::AccountSerializer
  end

  def create
    if current_user.admin
      HealthExpertApproveService.new.call(current_user.account, @account, reblogs: truthy_param?(:reblogs))
    end

    render json: @account, serializer: REST::AccountSerializer
  end

  private

  def set_account
    @account = Account.find(params[:account_id])
  end

  def load_accounts
    return [] if hide_results?

    paginated_suggestion
  end

  def hide_results?
    (@account.user_hides_network? && current_account.id != @account.id) || (current_account && @account.blocking?(current_account))
  end

  def paginated_suggestion
    Account.discoverable
      .suggestion
      .by_suggestion
      .popular
      .paginate_by_max_id(
        limit_param(DEFAULT_ACCOUNTS_LIMIT),
        params[:max_id],
        params[:since_id]
      )
  end

  def insert_pagination_headers
    set_pagination_headers(next_path, prev_path)
  end

  def next_path
    if records_continue?
      api_v1_account_suggestion_index_url pagination_params(max_id: pagination_max_id)
    end
  end

  def prev_path
    unless @accounts.empty?
      api_v1_account_suggestion_index_url pagination_params(since_id: pagination_since_id)
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
end
