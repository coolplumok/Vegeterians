# == Schema Information
#
# Table name: boost_posts
#
#  id         :bigint(8)        not null, primary key
#  user_id    :integer
#  status_id  :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class BoostPost < ApplicationRecord
	belongs_to :user
end
