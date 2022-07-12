class CheckoutService
  class << self
    def create_session_id(user, price_id)
      success, message, session_id = true, 'Success', nil
      begin
        result = Stripe::Checkout::Session.create({
          customer_email: user.email,
          success_url: "#{ENV['REDIRECT_URL']}?result=success",
          cancel_url: "#{ENV['REDIRECT_URL']}?result=error",
          payment_method_types: ['card'],
          line_items: [
            {price: price_id, quantity: 1},
          ],
          mode: 'subscription',
          allow_promotion_codes: true
        })
        session_id = result.id
      rescue Exception => e
        success = false
        message = e.message
      end

      return success, message, session_id
    end
  end
end
