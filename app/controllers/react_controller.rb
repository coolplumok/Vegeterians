# frozen_string_literal: true

class ReactController < ApplicationController
  before_action :authenticate_user!, only: :react
  before_action :set_referrer_policy_header, only: :react
  before_action :set_initial_state_json, only: :react
  before_action :set_data_for_meta, only: :react
  before_action :set_instance_presenter

  def react
    if params[:result] == "success"
      sleep 4
     flash.now[:notice] = "Your plan is successfully upgraded"
   elsif params[:result] == "error"
     flash.now[:alert] = "Something went wrong,please try again"
   end
  end

  private

  def set_data_for_meta
    return if find_route_matches && current_account

    if request.path.include?("/groups/")
      groupIdFromPath = request.path.sub("/groups", "").gsub("/", "")
      @group = Group.where(id: groupIdFromPath, is_archived: false).first
    elsif find_public_route_matches
      return
    elsif request.path.count("/") == 1 && !request.path.include?("@")
      acctFromPath = request.path.sub("/", "")
      @account = Account.find_local!(acctFromPath)
    end

  end

  def authenticate_user!

    Rails.logger.debug "dafuq: #{user_signed_in?} #{find_public_route_matches} #{find_route_matches}"

    return if user_signed_in?

    if find_public_route_matches
      return
    else
      # if no current user, dont allow to navigate to anywhere
      redirect_to(homepage_path)
    end
  end

  def find_route_matches
    request.path.match(/\A\/(home|shortcuts|suggestion|group|groups|list|lists|notifications|tags|compose|follow_requests|admin|account|settings|filters|timeline|blocks|domain_blocks|mutes|ambassadors)/)
  end

  def find_public_route_matches
    request.path.match(/\A\/(about|search|explore)/)
  end

  def set_initial_state_json
    serializable_resource = ActiveModelSerializers::SerializableResource.new(InitialStatePresenter.new(initial_state_params), serializer: InitialStateSerializer)
    @initial_state_json   = serializable_resource.to_json
  end

  def initial_state_params
    if !current_user.nil?
      {
        settings: Web::Setting.find_by(user: current_user)&.data || {},
        push_subscription: current_account.user.web_push_subscription(current_session),
        current_account: current_account,
        token: current_session.token,
        admin: Account.find_local(Setting.site_contact_username.strip.gsub(/\A@/, '')),
      }
    else
      {
        admin: Account.find_local(Setting.site_contact_username.strip.gsub(/\A@/, '')),
      }
    end
  end

  def set_referrer_policy_header
    response.headers['Referrer-Policy'] = 'origin'
  end

  def set_instance_presenter
    @instance_presenter = InstancePresenter.new
  end
end
