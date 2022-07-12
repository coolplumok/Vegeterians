# frozen_string_literal: true

class REST::PostSerializer < ActiveModel::Serializer
  attributes :id, :text, :created_at, :total, :user_account_display_name, :total_boost_posts

  def id
    object.id.to_s
  end

  def total
    current_user.boost_posts.where(created_at: Time.now.beginning_of_month..Time.now.end_of_month).count
  end

  def user_account_display_name
  	current_user.account.display_name
  end

  def total_boost_posts
    current_user.boost_posts.count
  end 

end
