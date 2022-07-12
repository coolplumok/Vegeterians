# frozen_string_literal: true

class Api::V1::SuggestionsController < Api::BaseController
  include Authorization

  before_action -> { doorkeeper_authorize! :read }
  before_action :require_user!

  respond_to :json

  def index
    type = params[:type]

    if type == 'related'
      @accounts = PotentialFriendshipTracker.get(current_account.id)
      render json: @accounts, each_serializer: REST::AccountSerializer
    elsif type == 'verified'
      @accounts = VerifiedSuggestions.get(current_account.id)
      render json: @accounts, each_serializer: REST::AccountSerializer
    else
      raise GabSocial::NotPermittedError
    end
  end

  def destroy
    PotentialFriendshipTracker.remove(current_account.id, params[:id])
    render_empty
  end

end
