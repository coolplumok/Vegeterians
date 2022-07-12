# frozen_string_literal: true

class Api::V1::ShortcutsController < Api::BaseController
  before_action :require_user!
  before_action :set_shortcut, except: [:index, :create]

  def index
    @shortcuts = Shortcut.where(account: current_account).limit(100)
    
    @onlyGroupIds = @shortcuts.select{ |s| s.shortcut_type == 'group' }.map(&:shortcut_id)
    @onlyAccountIds = @shortcuts.select{ |s| s.shortcut_type == 'account' }.map(&:shortcut_id)

    @groups = Group.where(id: @onlyGroupIds, is_archived: false).limit(100)
    @accounts = Account.where(id: @onlyAccountIds).without_suspended.limit(100)

    @final = @shortcuts.map do |s|
      value = nil
      title = nil
      to = nil
      image = nil

      if s.shortcut_type == 'group'
        @group = @groups.detect{ |g| g.id == s.shortcut_id }
        if @group.nil?
          s.destroy!
        else
          value = REST::GroupSerializer.new(@group)
        end
      elsif s.shortcut_type == 'account'
        @account = @accounts.detect{ |a| a.id == s.shortcut_id }
        if @account.nil?
          s.destroy!
        else
          value = REST::AccountSerializer.new(@account)
        end
      end

      r = {
        id: s.id,
        created_at: s.created_at,
        shortcut_id: s.shortcut_id,
        shortcut_type: s.shortcut_type,
        shortcut: value,
      }
      r
    end

    render json: @final
  end

  def show
    render json: @shortcut, serializer: REST::ShortcutSerializer
  end

  def create
    @shortcut = Shortcut.create!(shortcut_params.merge(account: current_account))

    value = nil
    if @shortcut.shortcut_type == 'group'
      @group = Group.where(id: @shortcut.shortcut_id, is_archived: false).first
      value = REST::GroupSerializer.new(@group)
    elsif @shortcut.shortcut_type == 'account'
      @account = Account.where(id: @shortcut.shortcut_id).without_suspended.first
      value = REST::AccountSerializer.new(@account)
    end

    r = {
      id: @shortcut.id,
      created_at: @shortcut.created_at,
      shortcut_type: @shortcut.shortcut_type,
      shortcut_id: @shortcut.shortcut_id,
      shortcut: value,
    }

    render json: r
    
  rescue ActiveRecord::RecordNotUnique
    render json: { error: I18n.t('shortcuts.errors.exists') }, status: 422
  end

  def destroy
    @shortcut.destroy!
    render json: { error: false, id: params[:id] }
  end

  private

  def set_shortcut
    @shortcut = Shortcut.where(account: current_account).find(params[:id])
  end

  def shortcut_params
    params.permit(:shortcut_type, :shortcut_id)
  end
end
