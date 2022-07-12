# Define an application-wide content security policy
# For further information see the following documentation
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy

base_host     = Rails.configuration.x.web_domain
assets_host   = Rails.configuration.action_controller.asset_host
assets_host ||= "http#{Rails.configuration.x.use_https ? 's' : ''}://#{base_host}"

Rails.application.config.content_security_policy do |p|
  p.base_uri        :none
  p.default_src     :none
  p.frame_ancestors :self, "https://*.Vegeterians.live", "https://*.openplatform.us"
  p.font_src        :self, assets_host
  p.img_src         :self, :https, :data, :blob, assets_host
  p.style_src       :self, :unsafe_inline, assets_host
  p.media_src       :self, :https, :data, assets_host
  p.frame_src       :self, :https
  p.manifest_src    :self, assets_host

  if Rails.env.development?
    webpacker_urls = %w(ws http).map { |protocol| "#{protocol}#{Webpacker.dev_server.https? ? 's' : ''}://#{Webpacker.dev_server.host_with_port}" }

    p.connect_src :self, :blob, assets_host, Rails.configuration.x.streaming_api_base_url, *webpacker_urls, "https://*.Vegeterians.live", "https://api.tenor.com", "https://js.stripe.com", "https://code.jquery.com", "https://t.firstpromoter.com/track/new"
    p.script_src  :self, :unsafe_inline, :unsafe_eval, assets_host, "https://*.Vegeterians.live", "https://js.stripe.com", "https://code.jquery.com", "https://cdn.firstpromoter.com"
  else
    p.connect_src :self, :blob, assets_host, Rails.configuration.x.streaming_api_base_url, "https://*.Vegeterians.live", "https://api.tenor.com", "https://js.stripe.com", "https://code.jquery.com", "https://t.firstpromoter.com/track/new"
    p.script_src  :self, :unsafe_inline, :unsafe_eval, assets_host, "https://*.Vegeterians.live", "https://js.stripe.com", "https://cdn.firstpromoter.com"
  end
end

# Report CSP violations to a specified URI
# For further information see the following documentation:
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy-Report-Only
# Rails.application.config.content_security_policy_report_only = true
