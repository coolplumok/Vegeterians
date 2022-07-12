# frozen_string_literal: true

class Api::V1::Timelines::ExpertController < Api::BaseController
  before_action :require_user!, only: [:show]
  after_action :insert_pagination_headers, unless: -> { @statuses.empty? }

  respond_to :json

  def show
    @statuses = load_statuses
    render json: @statuses, each_serializer: REST::StatusSerializer, relationships: StatusRelationshipsPresenter.new(@statuses, current_user.account_id)
  end

  private

  def load_statuses
    cached_expert_statuses
  end

  def cached_expert_statuses
    cache_collection expert_statuses, Status
  end

  def expert_statuses
    statuses = expert_timeline_statuses.paginate_by_id(
      limit_param(DEFAULT_STATUSES_LIMIT),
      params_slice(:max_id, :since_id, :min_id)
    ).reject { |status| FeedManager.instance.filter?(:common, status, current_account.id) }

    if truthy_param?(:only_media)
      # `SELECT DISTINCT id, updated_at` is too slow, so pluck ids at first, and then select id, updated_at with ids.
      status_ids = statuses.joins(:media_attachments).distinct(:id).pluck(:id)
      statuses.where(id: status_ids)
    else
      statuses
    end
  end

  def expert_timeline_statuses
    Status.as_expert_timeline(current_account)
  end

  def insert_pagination_headers
    set_pagination_headers(next_path, prev_path)
  end

  def pagination_params(core_params)
    params.slice(:limit, :only_media).permit(:limit, :only_media).merge(core_params)
  end

  def next_path
    api_v1_timelines_expert_url pagination_params(max_id: pagination_max_id)
  end

  def prev_path
    api_v1_timelines_expert_url pagination_params(min_id: pagination_since_id)
  end

  def pagination_max_id
    @statuses.last.id
  end

  def pagination_since_id
    @statuses.first.id
  end
end
