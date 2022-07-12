# frozen_string_literal: true

module WellKnown
  class WebfingerController < ActionController::Base
    def show
      raise GabSocial::NotPermittedError
    end
  end
end
