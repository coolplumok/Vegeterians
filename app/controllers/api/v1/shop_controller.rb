# frozen_string_literal: true

class Api::V1::ShopController < Api::BaseController
  before_action :require_user!

  respond_to :json

  skip_before_action :set_cache_headers

  def index
    type = params[:type]
    if type == 'featured_products'
      body = Redis.current.get("gabstore:featuredproducts")
        
      if body.nil? || body.empty?
        Request.new(:get, "https://shop.dissenter.com/product/group/json").perform do |res|
          Rails.logger.debug "ShopController dissenter products endpoint res code: #{res.code.to_s}"
          if res.code == 200
            body = res.body_with_limit
            Redis.current.set("gabstore:featuredproducts", body) 
            Redis.current.expire("gabstore:featuredproducts", 15.minutes.seconds)
            render json: body
          else
            render json: nil
          end
        end
      else
        render json: body
      end
    else
      raise GabSocial::NotPermittedError
    end
  rescue HTTP::TimeoutError, HTTP::ConnectionError, OpenSSL::SSL::SSLError, HTTP::Error
    Rails.logger.debug "Error fetching dissenter shop: #{type}"
    render json: nil
  end

end
