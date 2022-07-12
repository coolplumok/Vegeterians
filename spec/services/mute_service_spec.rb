require 'rails_helper'

RSpec.describe MuteService, type: :service do
  subject do
    -> { described_class.new.call(account, target_account) }
  end

  let(:account) { Fabricate(:account) }
  let(:target_account) { Fabricate(:account) }

  describe 'home timeline' do
    let(:status) { Fabricate(:status, account: target_account) }
    let(:other_account_status) { Fabricate(:status) }
    let(:home_timeline_key) { FeedManager.instance.key(:home, account.id) }

    before do
      Redis.current.del(home_timeline_key)
    end

    it "clears account's statuses" do
      FeedManager.instance.push_to_home(account, status)
      FeedManager.instance.push_to_home(account, other_account_status)

      is_expected.to change {
        Redis.current.zrange(home_timeline_key, 0, -1)
      }.from([status.id.to_s, other_account_status.id.to_s]).to([other_account_status.id.to_s])
    end
  end

  it 'mutes account' do
    is_expected.to change {
      account.muting?(target_account)
    }.from(false).to(true)
  end

  context 'without specifying a notifications parameter' do
    it 'mutes notifications from the account' do
      is_expected.to change {
        account.muting_notifications?(target_account)
      }.from(false).to(true)
    end
  end

  context 'with a true notifications parameter' do
    subject do
      -> { described_class.new.call(account, target_account, notifications: true) }
    end

    it 'mutes notifications from the account' do
      is_expected.to change {
        account.muting_notifications?(target_account)
      }.from(false).to(true)
    end
  end

  context 'with a false notifications parameter' do
    subject do
      -> { described_class.new.call(account, target_account, notifications: false) }
    end

    it 'does not mute notifications from the account' do
      is_expected.to_not change {
        account.muting_notifications?(target_account)
      }.from(false)
    end
  end
end
