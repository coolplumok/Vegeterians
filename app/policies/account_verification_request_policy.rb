# frozen_string_literal: true

class AccountVerificationRequestPolicy < ApplicationPolicy
  def create?
    current_account.is_pro || current_account.is_proplus and AccountVerificationRequest.where(account: current_account).count == 0
  end
end
