# frozen_string_literal: true

require 'rails_helper'

RSpec.describe RemoteFollow do
  before do
    stub_request(:get, 'https://quitter.no/.well-known/webfinger?resource=acct:robcolbert@quitter.no').to_return(request_fixture('webfinger.txt'))
  end

  let(:attrs)         { nil }
  let(:remote_follow) { described_class.new(attrs) }

  describe '.initialize' do
    subject { remote_follow.acct }

    context 'attrs with acct' do
      let(:attrs) { { acct: 'robcolbert@quitter.no' } }

      it 'returns acct' do
        is_expected.to eq 'robcolbert@quitter.no'
      end
    end

    context 'attrs without acct' do
      let(:attrs) { {} }

      it do
        is_expected.to be_nil
      end
    end
  end

  describe '#valid?' do
    subject { remote_follow.valid? }

    context 'attrs with acct' do
      let(:attrs) { { acct: 'robcolbert@quitter.no' } }

      it do
        is_expected.to be true
      end
    end

    context 'attrs without acct' do
      let(:attrs) { {} }

      it do
        is_expected.to be false
      end
    end
  end

  describe '#subscribe_address_for' do
    before do
      remote_follow.valid?
    end

    let(:attrs)   { { acct: 'robcolbert@quitter.no' } }
    let(:account) { Fabricate(:account, username: 'alice') }

    subject { remote_follow.subscribe_address_for(account) }

    it 'returns subscribe address' do
      is_expected.to eq 'https://quitter.no/main/ostatussub?profile=alice%40cb6e6126.ngrok.io'
    end
  end
end
