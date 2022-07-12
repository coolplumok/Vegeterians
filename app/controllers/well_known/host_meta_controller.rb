# frozen_string_literal: true

module WellKnown
  class HostMetaController < ActionController::Base
    def show
      raise GabSocial::NotPermittedError
    end
  end
end
