# frozen_string_literal: true

class GroupMemberRelationshipsPresenter
    attr_reader :member, :admin, :moderator, :join_sent
  
    def initialize(account_ids, current_group_id, **options)
      @account_ids        = account_ids.map { |a| a.is_a?(Account) ? a.id : a }
      @current_group_id   = current_group_id
  
      @member       = Group.member_member_map(@current_group_id, @account_ids)
      @admin        = Group.member_admin_map(@current_group_id, @account_ids)
      @moderator    = Group.member_moderator_map(@current_group_id, @account_ids)
      @join_sent    = Group.member_join_sent_map(@current_group_id, @account_ids)
    end
  end
  