# frozen_string_literal: true

class Api::V1::InstancesController < Api::BaseController
  respond_to :json
  skip_before_action :set_cache_headers

  def show
    render json: {}, content_type: 'application/json'
  end
end
