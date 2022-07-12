module Stripe
 # stripe main class EventHandler
  class EventHandler

    def call(event)
      update_user_subcription(event)
    rescue JSON::ParserError => e
      render json: { status: 400, error: 'Invalid payload' }
    rescue Stripe::SignatureVerificationError => e
      render json: { status: 400, error: 'Invalid signature' }
    end

    private

      def update_user_subcription(event)
        customer = Stripe::Customer.retrieve(event.data.object.customer)
        email = customer.email rescue nil
        subscription_id =  event.data.object.id
        if ["active", "trialing"].include?(event.data.object.status)
          action = true
        else
          action = false  
        end
        user = User.find_by(email: email)
        if user
          plan_id = event.data.object.plan.id
          if [ENV['MONTHLY_PRO_PLAN_ID'], ENV['YEARLY_PRO_PLAN_ID']].include?(plan_id)
            user.account.is_pro = action
            user.account.is_proplus = false if action
          elsif [ENV['MONTHLY_PRO_PLUS_PLAN_ID'], ENV['YEARLY_PRO_PLUS_PLAN_ID']].include?(plan_id)
            user.account.is_proplus = action
            user.account.is_pro = false if action
          end
          user.account.subscription_id = subscription_id
          user.save
        end
      end
  end
end