class Api::V1::PlansController < Api::BaseController
  
  def price
    @pro_monthly     = get_price(ENV['MONTHLY_PRO_PLAN_ID'])
    @pro_yearly      = get_price(ENV['YEARLY_PRO_PLAN_ID'])
    @proplus_monthly = get_price(ENV['MONTHLY_PRO_PLUS_PLAN_ID'])
    @proplus_yearly  = get_price(ENV['YEARLY_PRO_PLUS_PLAN_ID'])

    render json: {all_data: {pro_monthly: @pro_monthly, pro_yearly: @pro_yearly,proplus_monthly: @proplus_monthly, proplus_yearly:@proplus_yearly}}
  end  

  def checkout_session
    success, message, session_id = CheckoutService.create_session_id(current_user, params[:price_id])
    render json: {success: success, session_id: session_id, message: message}
  end

  def change_membership
    subscription_id = current_user.account.subscription_id
    success, message, result = MembershipService.change_membership(subscription_id, params[:plan_id])
    render json:{success: success, message:message}
  end

  private
    def get_price(price_id)
      Stripe::Price.retrieve(price_id).unit_amount / 100.to_f
    end

end
