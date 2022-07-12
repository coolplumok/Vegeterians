class Settings::MembershipsController < Settings::BaseController
  layout 'admin'
  
  skip_before_action :verify_authenticity_token, only: [:create_checkout_session]
  before_action :authenticate_user!
  before_action :set_account, except: [:create_checkout_session]

  def index
    @subscription_data = @account.membership_subscription
    @is_on_free_plan = (@subscription_data.present? && !@subscription_data[:is_pro_membership] && !@subscription_data[:is_pro_plus_membership]) || !@subscription_data.present?
    @pro_monthly = Stripe::Price.retrieve(ENV['MONTHLY_PRO_PLAN_ID']).unit_amount/100
    @pro_yearly =Stripe::Price.retrieve(ENV['YEARLY_PRO_PLAN_ID']).unit_amount/100
    @proplus_monthly =Stripe::Price.retrieve(ENV['MONTHLY_PRO_PLUS_PLAN_ID']).unit_amount/100
    @proplus_yearly =Stripe::Price.retrieve(ENV['YEARLY_PRO_PLUS_PLAN_ID']).unit_amount/100
  end


  def create_checkout_session
    @success, @message, @session_id = CheckoutService.create_session_id(current_user, params[:price_id])
  end
  
  def cancel
    success, message = true, 'Memberships sucessfully cancelled'
    begin
      result = Stripe::Subscription.update(@account.subscription_id,{cancel_at_period_end: true})
    rescue Exception => e
      success = false
      message = e.message
    end
    if success
      flash[:notice] = message
    else
      flash[:alert] = message
    end  
    redirect_to settings_memberships_path
  end

  def change_membership
    @success, @message, @result = MembershipService.change_membership(@account.subscription_id, params[:plan_id])
    if @success
      flash[:notice] = @message
    else
      flash[:alert] = @message
    end  
     redirect_to settings_memberships_path
  end

  private

  def set_account
    @account = current_user.account
  end

end 