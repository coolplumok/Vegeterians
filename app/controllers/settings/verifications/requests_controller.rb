require 'twilio-ruby'

class Settings::Verifications::RequestsController < Settings::BaseController
	include Authorization

	layout 'admin'
  before_action :authenticate_user!
  before_action :set_verification_msg

	def index
    @account_verification_request = AccountVerificationRequest.where(account: current_account)[0] || AccountVerificationRequest.new
    @otp_show = false
	end

	def create
      authorize :account_verification_request, :create?

      # POST requests didn't work with only binary input under account_verification_request tag
      # Acts like dict input is empty
      params = resource_params
      params['account'] = current_account

      @account_verification_request = AccountVerificationRequest.new(params)

      if @account_verification_request.save
        redirect_to settings_verifications_requests_path, notice: I18n.t('verifications.requests.created_msg')
      else
        render :index
      end
    end

    def resource_params
      params.require(:account_verification_request).permit(:image, :phone_number, :code)
    end

  def send_code
    params = resource_params
    params['account'] = current_account

    @account_verification_request = AccountVerificationRequest.where(account: current_account)[0] || AccountVerificationRequest.new(params)
    @account_verification_request.phone_number = params[:phone_number]
    @otp_show = false

    if @account_verification_request.save

      @client = Twilio::REST::Client.new(ENV['TWILIO_ACCOUNT_SID'], ENV['TWILIO_AUTH_TOKEN'])

      begin
        verification = @client
                      .verify
                      .services(ENV['TWILIO_SERVICE_SID'])
                      .verifications
                      .create(to: params[:phone_number], channel: 'sms')

        if verification.status == 'pending'
          @otp_show = true
          flash.now[:notice] = I18n.t('verifications.requests.sent_code_msg')
          render :index
        else
          render :index
        end
      rescue Twilio::REST::TwilioError => e

        if e.code == 60203 # Max send attempts reached
          flash.now[:alert] = I18n.t('verifications.requests.limit_sent_code_msg')
        else
          flash.now[:alert] = I18n.t('verifications.requests.failed_sent_code_msg')
        end

        render :index
      end
    else
      render :index
    end
  end

  def verify_code
    params = resource_params
    @account_verification_request = AccountVerificationRequest.where(account: current_account)[0]
    phone_number = @account_verification_request[:phone_number]
    if params[:code] == ''
      params[:code] = '000000'
    end

    @client = Twilio::REST::Client.new(ENV['TWILIO_ACCOUNT_SID'], ENV['TWILIO_AUTH_TOKEN'])

    begin
      verification_check = @client
                    .verify
                    .services(ENV['TWILIO_SERVICE_SID'])
                    .verification_checks
                    .create(to: phone_number, code: params[:code])

      if verification_check.status == 'approved'
        # Mark user as verified
        current_account.is_verified = true
        current_account.save()

        # Notify user
        UserMailer.verification_approved(current_account.user).deliver_later!

        # Remove all traces
        @account_verification_request.destroy()

        # Redirect back to the form
        redirect_to settings_verifications_requests_path
      elsif verification_check.valid == false
        @otp_show = true
        flash.now[:alert] = I18n.t('verifications.requests.failed_verification_msg')
        render :index
      end
    rescue Twilio::REST::TwilioError => e
      @otp_show = true
      flash.now[:alert] = I18n.t('verifications.requests.resend_code_msg')
      render :index
    end
  end

  private

  def set_verification_msg
    if not current_account.is_verified
      flash.now[:alert] = I18n.t('verifications.requests.require_phone_verification_msg')
    end
  end
end
