# frozen_string_literal: true

require 'rails_helper'

describe StatusesController do
  render_views

  describe '#show' do
    context 'account is suspended' do
      it 'returns gone' do
        account = Fabricate(:account, suspended: true)
        status = Fabricate(:status, account: account)

        get :show, params: { account_username: account.username, id: status.id }

        expect(response).to have_http_status(410)
      end
    end

    context 'status is not permitted' do
      it 'raises ActiveRecord::RecordNotFound' do
        user = Fabricate(:user)
        status = Fabricate(:status)
        status.account.block!(user.account)

        sign_in(user)
        get :show, params: { account_username: status.account.username, id: status.id }

        expect(response).to have_http_status(404)
      end
    end

    context 'status is a reblog' do
      it 'redirects to the original status' do
        original_account = Fabricate(:account, domain: 'example.com')
        original_status = Fabricate(:status, account: original_account, uri: 'tag:example.com,2017:foo', url: 'https://example.com/123')
        status = Fabricate(:status, reblog: original_status)

        get :show, params: { account_username: status.account.username, id: status.id }

        expect(response).to redirect_to(original_status.url)
      end
    end

    context 'account is not suspended and status is permitted' do
      it 'assigns @account' do
        status = Fabricate(:status)
        get :show, params: { account_username: status.account.username, id: status.id }
        expect(assigns(:account)).to eq status.account
      end

      it 'assigns @status' do
        status = Fabricate(:status)
        get :show, params: { account_username: status.account.username, id: status.id }
        expect(assigns(:status)).to eq status
      end

      it 'assigns @stream_entry' do
        status = Fabricate(:status)
        get :show, params: { account_username: status.account.username, id: status.id }
        expect(assigns(:stream_entry)).to eq status.stream_entry
      end

      it 'assigns @type' do
        status = Fabricate(:status)
        get :show, params: { account_username: status.account.username, id: status.id }
        expect(assigns(:type)).to eq 'status'
      end

      it 'returns a success' do
        status = Fabricate(:status)
        get :show, params: { account_username: status.account.username, id: status.id }
        expect(response).to have_http_status(200)
      end

      it 'renders the React front-end' do
        status = Fabricate(:status)
        get :show, params: { account_username: status.account.username, id: status.id }
        expect(response).to render_template 'react/react'
      end
    end
  end
end
