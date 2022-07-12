class MembershipService
  class << self
  	def change_membership(subscription_id, plan_id)
    success, message, result = true, 'Memberships sucessfully updated', nil
    begin
      subscription = Stripe::Subscription.retrieve(subscription_id)
      result = Stripe::Subscription.update(
        subscription.id,
        {
          cancel_at_period_end: false,
          proration_behavior: 'create_prorations',
          items: [
            {
              id: subscription.items.data[0].id,
              price: plan_id
            }
          ]
        }
      )
    rescue Exception => e
      success = false
      message = e.message
    end
    return success, message, result
  end
  end
end
