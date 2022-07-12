Stripe.api_key = ENV['STRIPE_SECRET_KEY']
StripeEvent.signing_secret = ENV['STRIPE_SIGNING_KEY']

StripeEvent.configure do |events|
  events.subscribe 'customer.subscription.deleted', Stripe::EventHandler.new
  events.subscribe 'customer.subscription.created', Stripe::EventHandler.new
  events.subscribe 'customer.subscription.pending_update_applied', Stripe::EventHandler.new
  events.subscribe 'customer.subscription.pending_update_expired', Stripe::EventHandler.new
  events.subscribe 'customer.subscription.updated', Stripe::EventHandler.new
  events.subscribe 'customer.subscription.trial_will_end', Stripe::EventHandler.new
end
