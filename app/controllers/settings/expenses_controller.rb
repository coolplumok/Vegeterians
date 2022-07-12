class Settings::ExpensesController < Admin::BaseController
	def index
    @amount = Redis.current.get("monthly_funding_amount") || 0
	end

  def create
    Redis.current.set("monthly_funding_amount", params[:amount])
		redirect_to settings_expenses_path
	end

end
