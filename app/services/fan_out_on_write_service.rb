# frozen_string_literal: true

class FanOutOnWriteService < BaseService
  # Push a status into home and mentions feeds
  # @param [Status] status
  def call(status)
    raise GabSocial::RaceConditionError if status.visibility.nil?

    render_anonymous_payload(status)

    if status.direct_visibility?
      deliver_to_own_conversation(status)
    elsif status.limited_visibility?
      deliver_to_mentioned_followers(status)
    else
      deliver_to_self(status) if status.account.local?
      deliver_to_followers(status)
      deliver_to_lists(status)
      deliver_to_group(status)
    end

    return if status.account.silenced? || !status.public_visibility? || status.reblog?

    deliver_to_hashtags(status)

    return if status.reply? && status.in_reply_to_account_id != status.account_id


    if status.account.is_pro || status.account.is_proplus || status.account.is_expert || status.account.is_verified
      deliver_to_pro(status)
    end
  end

  private

  def deliver_to_self(status)
    Rails.logger.debug "Delivering status #{status.id} to author"
    FeedManager.instance.push_to_home(status.account, status)
  end

  def deliver_to_followers(status)
    Rails.logger.debug "Delivering status #{status.id} to followers"

    status.account.followers_for_local_distribution.select(:id).reorder(nil).find_in_batches do |followers|
      FeedInsertWorker.push_bulk(followers) do |follower|
        [status.id, follower.id, :home]
      end
    end
  end

  def deliver_to_group_members(status)
    Rails.logger.debug "Delivering status #{status.id} to group members #{status.group.id}"
    
    status.group.accounts_for_local_distribution.select(:id).reorder(nil).find_in_batches do |members|
      FeedInsertWorker.push_bulk(members) do |member|
        [status.id, member.id, :home]
      end
    end
  end

  def deliver_to_lists(status)
    Rails.logger.debug "Delivering status #{status.id} to lists"

    status.account.lists_for_local_distribution.select(:id).reorder(nil).find_in_batches do |lists|
      FeedInsertWorker.push_bulk(lists) do |list|
        [status.id, list.id, :list]
      end
    end
  end

  def deliver_to_group(status)
    return if status.group_id.nil?

    Rails.logger.debug "Delivering status #{status.id} to group"

    Redis.current.publish("timeline:group:#{status.group_id}", @payload)

    deliver_to_group_members(status)
  end

  def deliver_to_mentioned_followers(status)
    Rails.logger.debug "Delivering status #{status.id} to limited followers"

    FeedInsertWorker.push_bulk(status.mentions.includes(:account).map(&:account).select { |mentioned_account| mentioned_account.local? && mentioned_account.following?(status.account) }) do |follower|
      [status.id, follower.id, :home]
    end
  end

  def render_anonymous_payload(status)
    @payload = InlineRenderer.render(status, nil, :status)
    @payload = Oj.dump(event: :update, payload: @payload)
  end

  def deliver_to_hashtags(status)
    Rails.logger.debug "Delivering status #{status.id} to hashtags"

    status.tags.pluck(:name).each do |hashtag|
      Redis.current.publish("timeline:hashtag:#{hashtag}", @payload)
      Redis.current.publish("timeline:hashtag:#{hashtag}:local", @payload) if status.local?
    end
  end

  def deliver_to_pro(status)
    Rails.logger.debug "Delivering status #{status.id} to pro timeline"

    Redis.current.publish('timeline:pro', @payload)
  end

  def deliver_to_own_conversation(status)
    AccountConversation.add_status(status.account, status)
  end
end
