namespace :boost_post do
  desc 'Update Boost Post For Pro plus User'
  task boost_post_update: :environment do
    if (Date.today.at_beginning_of_month.to_s == Date.today.to_s)
    	User.all.each do |user|
    		if (user.check_membership_pro_plus_user == "Pro plus")
	    		user.update(available_boost_post: user.available_boost_post.to_i + 2)
	    	end
    	end	
  	end
  end
end
