# frozen_string_literal: true

class GroupRelationshipsPresenter
    attr_reader :member, :admin, :moderator, :join_sent
  
    def initialize(group_ids, current_account_id, **options)
      @group_ids          = group_ids.map { |a| a.is_a?(Group) ? a.id : a }
      @current_account_id = current_account_id
  
      @member       = Group.member_map(@group_ids, @current_account_id)
      @admin        = Group.admin_map(@group_ids, @current_account_id)
      @moderator    = Group.moderator_map(@group_ids, @current_account_id)
      @join_sent    = Group.join_sent_map(@group_ids, @current_account_id)
    end
  end
  