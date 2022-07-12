# frozen_string_literal: true

class Api::V1::PostsController < Api::BaseController

  def index
  	if current_user.boost_posts.present?
  		@total_boost_posts = current_user.boost_posts.count
  		last_boost_post_status_id = current_user.boost_posts.order("id ASC").last.status_id 
  		@status = Status.where(id: last_boost_post_status_id)
	    # @all_status = Status.where(account_id: current_user.account.id)
	    boost_post_status = current_user.boost_posts.map(&:status_id)
	    @all_status = []
	    boost_post_status.each do |boost_post_id|
	    	@all_status << Status.find(boost_post_id)
	    end	
	    @all_posts = (@status + @all_status).uniq
	    render json: @all_posts, each_serializer: REST::PostSerializer, total_boost_posts: @total_boost_posts
		else
			@all_posts = Status.where(account_id: current_user.account.id)
	    # render json: {message: "false"}
	    render json: @all_posts, each_serializer: REST::PostSerializer, total_boost_posts: @total_boost_posts
		end    
  end

  def total_post
   	membership_level = current_user.check_membership_pro_plus_user
  	if (membership_level == "Pro plus") && (current_user.available_boost_post == nil)
  		current_user.update(available_boost_post: 2)
  		@total_post_current_month = current_user.available_boost_post
  	else
  		@total_post_current_month = current_user.available_boost_post
  	end	
  	render json: @total_post_current_month
  end

	def boosted_post
		if current_user.boost_posts.present?
			@total_boost_posts = current_user.boost_posts.count
			last_boost_post_status_id = current_user.boost_posts.last.status_id
			@status = Status.where(id: last_boost_post_status_id)
	    boost_post_status = current_user.boost_posts.map(&:status_id)
	    @all_status = []
	    boost_post_status.each do |boost_post_id|
				@all_status << Status.find(boost_post_id)
	    end
	    @all_bosted_posts = (@status + @all_status).uniq
	    render json: @all_bosted_posts, each_serializer: REST::PostSerializer, total_boost_posts: @total_boost_posts
	  else
			render json: {message: "false"}
	  end
	end

	def check_boosted_post
  	membership_level = current_user.check_membership_pro_plus_user
		@status_id = params[:id]
		@boost_post = BoostPost.find_by(status_id: @status_id)
		if @boost_post.present? 
			if ((@boost_post.user_id == current_user.id) && (membership_level == "Pro plus")) || (membership_level == "Free")
				render json: {boosted_post_message: "true"}
			end			
		else
			render json: {boosted_post_message: "false"}
		end
	end

	def check_user_pro_plus
    if (current_user.check_membership_pro_plus_user == "Pro plus")
    	render json: {free_boosted_post: "true"}
    else
			render json: {free_boosted_post: "false"}
		end	
	end

	def boost_again
		@status = Status.find_by(id: params[:id])
		@user = current_user
    created_at = current_user.boost_posts.last.created_at
    after_24_hour_time = created_at+24.hours
    # if (Time.now == after_24_hour_time) || (Time.now > after_24_hour_time)
    	@boost_post = BoostPost.where(status_id: @status.id, user_id: @user.id).last
    	@boost_post = BoostPost.new()
      @boost_post.status_id = @status.id
      @boost_post.user_id = @user.id
      @boost_post.save
      current_user.update(available_boost_post: current_user.available_boost_post - 1)
      render json: {message: "Successfully Boost Post"}

    # else
    #   render json: {message: "Only one post boost can be used each 24 hours"}
    # end      
	end

  private

end
