# frozen_string_literal: true

module WellKnown
  class KeybaseProofConfigController < ActionController::Base
    def show
      render json: {}, status: 404
    end
  end
end
