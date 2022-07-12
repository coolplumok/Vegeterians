# frozen_string_literal: true

class Api::V1::Timelines::GroupController < Api::BaseController
  before_action :set_group
  before_action :set_statuses

  after_action :insert_pagination_headers, unless: -> { @statuses.empty? }

  def show
    if current_user
      render json: @statuses,
            each_serializer: REST::StatusSerializer,
            relationships: StatusRelationshipsPresenter.new(@statuses, current_user.account_id)
    else
      render json: @statuses, each_serializer: REST::StatusSerializer
    end
  end

  private

  def set_group
    @group = Group.where(id: params[:id], is_archived: false).first
    if @group.is_privated
      @group_visible = @group.group_accounts.where(account_id: current_account.id).exists?
    else
      @group_visible = true
    end
  end

  def set_statuses
    @statuses = cached_group_statuses
  end

  def cached_group_statuses
    cache_collection group_statuses, Status
  end

  def group_statuses
    statuses = nil
    if @group_visible
      if current_account
        statuses = group_timeline_statuses.without_replies.paginate_by_id(
          limit_param(DEFAULT_STATUSES_LIMIT),
          params_slice(:max_id, :since_id, :min_id)
        ).reject { |status| FeedManager.instance.filter?(:home, status, current_account.id) }
      else
        statuses = group_timeline_statuses.without_replies.paginate_by_id(
          limit_param(DEFAULT_STATUSES_LIMIT),
          params_slice(:max_id, :since_id, :min_id)
        )
      end

      if truthy_param?(:only_media)
        # `SELECT DISTINCT id, updated_at` is too slow, so pluck ids at first, and then select id, updated_at with ids.
        status_ids = statuses.joins(:media_attachments).distinct(:id).pluck(:id)
        statuses.where(id: status_ids)
      else
        statuses
      end
    else
      statuses = []
    end
  end

  def group_timeline_statuses
    GroupQueryService.new.call(@group)
  end

  def insert_pagination_headers
    set_pagination_headers(next_path, prev_path)
  end

  def pagination_params(core_params)
    params.slice(:limit).permit(:limit).merge(core_params)
  end

  def next_path
    api_v1_timelines_group_url params[:id], pagination_params(max_id: pagination_max_id)
  end

  def prev_path
    api_v1_timelines_group_url params[:id], pagination_params(min_id: pagination_since_id)
  end

  def pagination_max_id
    @statuses.last.id
  end

  def pagination_since_id
    @statuses.first.id
  end
end
