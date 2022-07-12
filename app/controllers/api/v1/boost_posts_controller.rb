# frozen_string_literal: true

class Api::V1::BoostPostsController < Api::BaseController

  def add_boost_post
  	@user = current_user
  	@status = Status.find_by(id: params[:status_id])
  	if current_user.boost_posts.present?
  		created_at = current_user.boost_posts.last.created_at
  		after_24_hour_time = created_at+24.hours

      posts = @user.boost_posts.where(created_at: Time.now.beginning_of_month..Time.now.end_of_month)

  		if (posts.count == 2)
  			render json: {message: "You Have already 2 times Boost your posts"}
  		elsif (Time.now == after_24_hour_time) || (Time.now > after_24_hour_time)
  			@boost_post = BoostPost.new(bootpost_params)
		  	@boost_post.user_id = @user.id
		  	if @boost_post.save
		      render json: {message: ""}
		    end
  		else
  			render json: {message: "Only one post boost can be used each 24 hours"}	
  		end	
  	else	
	  	@boost_post = BoostPost.new(bootpost_params)
	  	@boost_post.user_id = @user.id
	  	if @boost_post.save
	      render json: {message: ""}
	    end
	  end  
  end

  private

   	def bootpost_params
    	params.permit(:status_id)
  	end
end
