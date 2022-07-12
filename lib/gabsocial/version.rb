# frozen_string_literal: true

module GabSocial
  module Version
    module_function

    def major
      2
    end

    def minor
      8
    end

    def patch
      4
    end

    def pre
      nil
    end

    def flags
      ''
    end

    def to_a
      [major, minor, patch, pre].compact
    end

    def to_s
      [to_a.join('.'), flags].join
    end

    def repository
      ENV.fetch('GITHUB_REPOSITORY') { 'Vegeterians-live/Vegeterians-social' }
    end

    def source_base_url
      ENV.fetch('SOURCE_BASE_URL') { "https://gitlab.com/#{repository}" }
    end

    # specify git tag or commit hash here
    def source_tag
      ENV.fetch('SOURCE_TAG') { nil }
    end

    def source_url
      if source_tag
        "#{source_base_url}/tree/#{source_tag}"
      else
        source_base_url
      end
    end

    def user_agent
      @user_agent ||= "#{HTTP::Request::USER_AGENT} (GabSocial/#{Version}; +http#{Rails.configuration.x.use_https ? 's' : ''}://#{Rails.configuration.x.web_domain}/)"
    end
  end
end
