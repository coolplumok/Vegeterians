# frozen_string_literal: true

class UnfollowService < BaseService
  # Unfollow and notify the remote user
  # @param [Account] source_account Where to unfollow from
  # @param [Account] target_account Which to unfollow
  def call(source_account, target_account)
    @source_account = source_account
    @target_account = target_account

    unfollow! || undo_follow_request!
  end

  private

  def unfollow!
    follow = Follow.find_by(account: @source_account, target_account: @target_account)

    return unless follow

    follow.destroy!
    create_notification(follow) unless @target_account.local?
    create_reject_notification(follow) if @target_account.local? && !@source_account.local?
    UnmergeWorker.perform_async(@target_account.id, @source_account.id)
    follow
  end

  def undo_follow_request!
    follow_request = FollowRequest.find_by(account: @source_account, target_account: @target_account)

    return unless follow_request

    follow_request.destroy!
    create_notification(follow_request) unless @target_account.local?
    follow_request
  end

  def create_notification(follow)
    if follow.target_account.ostatus?
      NotificationWorker.perform_async(build_xml(follow), follow.account_id, follow.target_account_id)
    elsif follow.target_account.activitypub?
      ActivityPub::DeliveryWorker.perform_async(build_json(follow), follow.account_id, follow.target_account.inbox_url)
    end
  end

  def create_reject_notification(follow)
    # Rejecting an already-existing follow request
    return unless follow.account.activitypub?
    ActivityPub::DeliveryWorker.perform_async(build_reject_json(follow), follow.target_account_id, follow.account.inbox_url)
  end

  def build_json(follow)
    ActiveModelSerializers::SerializableResource.new(
      follow,
      serializer: ActivityPub::UndoFollowSerializer,
      adapter: ActivityPub::Adapter
    ).to_json
  end

  def build_reject_json(follow)
    ActiveModelSerializers::SerializableResource.new(
      follow,
      serializer: ActivityPub::RejectFollowSerializer,
      adapter: ActivityPub::Adapter
    ).to_json
  end

  def build_xml(follow)
    OStatus::AtomSerializer.render(OStatus::AtomSerializer.new.unfollow_salmon(follow))
  end
end
