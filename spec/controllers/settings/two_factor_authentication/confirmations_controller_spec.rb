# frozen_string_literal: true

require 'rails_helper'

describe Settings::TwoFactorAuthentication::ConfirmationsController do
  render_views

  let(:user) { Fabricate(:user, email: 'local-part@domain', otp_secret: 'thisisasecretforthespecofnewview') }
  let(:user_without_otp_secret) { Fabricate(:user, email: 'local-part@domain') }

  shared_examples 'renders :new' do
    it 'renders the new view' do
      subject

      expect(assigns(:confirmation)).to be_instance_of Form::TwoFactorConfirmation
      expect(assigns(:provision_url)).to eq 'otpauth://totp/local-part@domain?secret=thisisasecretforthespecofnewview&issuer=cb6e6126.ngrok.io'
      expect(assigns(:qrcode)).to be_instance_of RQRCode::QRCode
      expect(response).to have_http_status(200)
      expect(response).to render_template(:new)
    end
  end

  describe 'GET #new' do
    context 'when signed in' do
      subject do
        sign_in user, scope: :user
        get :new
      end

      include_examples 'renders :new'
    end

    it 'redirects if not signed in' do
      get :new
      expect(response).to redirect_to('/auth/sign_in')
    end

    it 'redirects if user do not have otp_secret' do
      sign_in user_without_otp_secret, scope: :user
      get :new
      expect(response).to redirect_to('/settings/two_factor_authentication')
    end
  end

  describe 'POST #create' do
    context 'when signed in' do
      before do
        sign_in user, scope: :user
      end

      describe 'when form_two_factor_confirmation parameter is not provided' do
        it 'raises ActionController::ParameterMissing' do
          expect { post :create, params: {} }.to raise_error(ActionController::ParameterMissing)
        end
      end

      describe 'when creation succeeds' do
        it 'renders page with success' do
          otp_backup_codes = user.generate_otp_backup_codes!
          expect_any_instance_of(User).to receive(:generate_otp_backup_codes!) do |value|
            expect(value).to eq user
            otp_backup_codes
          end
          expect_any_instance_of(User).to receive(:validate_and_consume_otp!) do |value, arg|
            expect(value).to eq user
            expect(arg).to eq '123456'
            true
          end

          post :create, params: { form_two_factor_confirmation: { code: '123456' } }

          expect(assigns(:recovery_codes)).to eq otp_backup_codes
          expect(flash[:notice]).to eq 'Two-factor authentication successfully enabled'
          expect(response).to have_http_status(200)
          expect(response).to render_template('settings/two_factor_authentication/recovery_codes/index')
        end
      end

      describe 'when creation fails' do
        subject do
          expect_any_instance_of(User).to receive(:validate_and_consume_otp!) do |value, arg|
            expect(value).to eq user
            expect(arg).to eq '123456'
            false
          end

          post :create, params: { form_two_factor_confirmation: { code: '123456' } }
        end

        it 'renders the new view' do
          subject
          expect(response.body).to include 'The entered code was invalid! Are server time and device time correct?'
        end

        include_examples 'renders :new'
      end
    end

    context 'when not signed in' do
      it 'redirects if not signed in' do
        post :create, params: { form_two_factor_confirmation: { code: '123456' } }
        expect(response).to redirect_to('/auth/sign_in')
      end
    end
  end
end
