# frozen_string_literal: true

class Api::V1::GifsController < Api::BaseController
  before_action :require_user!

  respond_to :json

  skip_before_action :set_cache_headers

  def categories
    uri = URI('https://api.tenor.com/v1/categories')
    theOptions = { :key => "TENOR_KEY" }
    uri.query = URI.encode_www_form(theOptions)

    res = Net::HTTP.get_response(uri)
    render json: res.body if res.is_a?(Net::HTTPSuccess)
  end

  def search
    uri = URI('https://api.tenor.com/v1/search')
    theOptions = {
      :key => "TENOR_KEY",
      :media_filter => "minimal",
      :limit => 30,
      :q => params[:search],
      :pos => params[:next] || 0
    }
    uri.query = URI.encode_www_form(theOptions)

    res = Net::HTTP.get_response(uri)
    render json: res.body if res.is_a?(Net::HTTPSuccess)
  end
end
