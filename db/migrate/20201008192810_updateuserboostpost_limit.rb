class UpdateuserboostpostLimit < ActiveRecord::Migration[5.2]
  def change
  	@user = User.find_by(email: "info@Vegeterians.network")
		if @user.present?
			@user.update(available_boost_post: 10)
		end
  end
end
