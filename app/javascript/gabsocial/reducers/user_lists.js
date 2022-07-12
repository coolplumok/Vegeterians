import { Map as ImmutableMap, List as ImmutableList } from 'immutable'
import { me } from '../initial_state'
import {
  FOLLOWERS_FETCH_REQUEST,
  FOLLOWERS_FETCH_SUCCESS,
  FOLLOWERS_EXPAND_SUCCESS,
  FOLLOWERS_FETCH_FAIL,
  FOLLOWERS_EXPAND_REQUEST,
  FOLLOWERS_EXPAND_FAIL,
  FOLLOWING_FETCH_REQUEST,
  FOLLOWING_FETCH_FAIL,
  FOLLOWING_EXPAND_REQUEST,
  FOLLOWING_FETCH_SUCCESS,
  FOLLOWING_EXPAND_SUCCESS,
  FOLLOWING_EXPAND_FAIL,
  FOLLOW_REQUESTS_FETCH_REQUEST,
  FOLLOW_REQUESTS_FETCH_FAIL,
  FOLLOW_REQUESTS_EXPAND_REQUEST,
  FOLLOW_REQUESTS_FETCH_SUCCESS,
  FOLLOW_REQUESTS_EXPAND_SUCCESS,
  FOLLOW_REQUESTS_EXPAND_FAIL,
  FOLLOW_REQUEST_AUTHORIZE_SUCCESS,
  FOLLOW_REQUEST_REJECT_SUCCESS,
  SUGGESTION_FETCH_REQUEST,
  SUGGESTION_FETCH_FAIL,
  SUGGESTION_EXPAND_REQUEST,
  SUGGESTION_FETCH_SUCCESS,
  SUGGESTION_EXPAND_SUCCESS,
  SUGGESTION_EXPAND_FAIL,
  GROUP_INVITE_FOLLOWERS_FETCH_REQUEST,
  GROUP_INVITE_FOLLOWERS_FETCH_SUCCESS,
  GROUP_INVITE_FOLLOWERS_EXPAND_SUCCESS,
  GROUP_INVITE_FOLLOWERS_FETCH_FAIL,
  GROUP_INVITE_FOLLOWERS_EXPAND_REQUEST,
  GROUP_INVITE_FOLLOWERS_EXPAND_FAIL,
} from '../actions/accounts'
import {
  REPOSTS_FETCH_SUCCESS,
  LIKES_FETCH_SUCCESS,
} from '../actions/interactions'
import {
  BLOCKS_FETCH_REQUEST,
  BLOCKS_FETCH_SUCCESS,
  BLOCKS_FETCH_FAIL,
  BLOCKS_EXPAND_REQUEST,
  BLOCKS_EXPAND_SUCCESS,
  BLOCKS_EXPAND_FAIL,
} from '../actions/blocks'
import {
  MUTES_FETCH_REQUEST,
  MUTES_FETCH_SUCCESS,
  MUTES_FETCH_FAIL,
  MUTES_EXPAND_REQUEST,
  MUTES_EXPAND_SUCCESS,
  MUTES_EXPAND_FAIL,
} from '../actions/mutes'
import {
  GROUP_MEMBERS_FETCH_SUCCESS,
  GROUP_MEMBERS_EXPAND_SUCCESS,
  GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS,
  GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS,
  GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS,
  GROUP_PENDING_APPLICATIONS_FETCH_REQUEST,
  GROUP_PENDING_APPLICATIONS_FETCH_SUCCESS,
  GROUP_PENDING_APPLICATIONS_EXPAND_SUCCESS,
  GROUP_PENDING_APPLICATIONS_FETCH_FAIL,
  GROUP_PENDING_APPLICATIONS_EXPAND_REQUEST,
  GROUP_PENDING_APPLICATIONS_EXPAND_FAIL,
} from '../actions/groups'

const initialState = ImmutableMap({
  followers: ImmutableMap(),
  following: ImmutableMap(),
  reblogged_by: ImmutableMap(),
  liked_by: ImmutableMap(),
  follow_requests: ImmutableMap(),
  blocks: ImmutableMap(),
  mutes: ImmutableMap(),
  groups: ImmutableMap(),
  groups_removed_accounts: ImmutableMap(),
  suggestion: ImmutableMap(),
  group_invite_followers: ImmutableMap(),
  group_pending_applications: ImmutableMap(),
});

const setListFailed = (state, type, id) => {
  return state.setIn([type, id], ImmutableMap({
    next: null,
    items: ImmutableList(),
    isLoading: false,
  }))
}

const normalizeList = (state, type, id, accounts, next) => {
  return state.setIn([type, id], ImmutableMap({
    next,
    items: ImmutableList(accounts.map(item => item.id)),
    isLoading: false,
  }))
}

const appendToList = (state, type, id, accounts, next) => {
  return state.updateIn([type, id], (map) => {
    return map
      .set('next', next)
      .set('isLoading', false)
      .update('items', (list) => {
        return list.concat(accounts.map(item => item.id))
      })
  })
}

export default function userLists(state = initialState, action) {
  switch(action.type) {

  case FOLLOWERS_FETCH_SUCCESS:
    return normalizeList(state, 'followers', action.id, action.accounts, action.next);
  case FOLLOWERS_EXPAND_SUCCESS:
    return appendToList(state, 'followers', action.id, action.accounts, action.next);
  case FOLLOWERS_FETCH_REQUEST:
  case FOLLOWERS_EXPAND_REQUEST:
    return state.setIn(['followers', action.id, 'isLoading'], true);
  case FOLLOWERS_FETCH_FAIL:
  case FOLLOWERS_EXPAND_FAIL:
    return setListFailed(state, 'followers', action.id)

  case FOLLOWING_FETCH_SUCCESS:
    return normalizeList(state, 'following', action.id, action.accounts, action.next);
  case FOLLOWING_EXPAND_SUCCESS:
    return appendToList(state, 'following', action.id, action.accounts, action.next);
  case FOLLOWING_FETCH_REQUEST:
  case FOLLOWING_EXPAND_REQUEST:
    return state.setIn(['following', action.id, 'isLoading'], true);
  case FOLLOWING_FETCH_FAIL:
  case FOLLOWING_EXPAND_FAIL:
    return state.setIn(['following', action.id, 'isLoading'], false);

  case REPOSTS_FETCH_SUCCESS:
    return state.setIn(['reblogged_by', action.id], ImmutableList(action.accounts.map(item => item.id)));

  case LIKES_FETCH_SUCCESS:
    return state.setIn(['liked_by', action.id], ImmutableList(action.accounts.map(item => item.id)));

  case FOLLOW_REQUESTS_FETCH_SUCCESS:
    return normalizeList(state, 'follow_requests', me, action.accounts, action.next);
  case FOLLOW_REQUESTS_EXPAND_SUCCESS:
    return appendToList(state, 'follow_requests', action.id, action.accounts, action.next);
  case FOLLOW_REQUESTS_FETCH_REQUEST:
  case FOLLOW_REQUESTS_EXPAND_REQUEST:
    return state.setIn(['follow_requests', me, 'isLoading'], true);
  case FOLLOW_REQUESTS_FETCH_FAIL:
  case FOLLOW_REQUESTS_EXPAND_FAIL:
    return state.setIn(['follow_requests', me, 'isLoading'], false);
  case FOLLOW_REQUEST_AUTHORIZE_SUCCESS:
  case FOLLOW_REQUEST_REJECT_SUCCESS:
    return state.updateIn(['follow_requests', me, 'items'], list => list.filterNot(item => item === action.id));

  case BLOCKS_FETCH_REQUEST:
  case BLOCKS_EXPAND_REQUEST:
    return state.setIn(['blocks', me, 'isLoading'], true)
  case BLOCKS_FETCH_SUCCESS:
    return normalizeList(state, 'blocks', me, action.accounts, action.next)
  case BLOCKS_EXPAND_SUCCESS:
    return appendToList(state, 'blocks', me, action.accounts, action.next)
  case BLOCKS_FETCH_FAIL:
  case BLOCKS_EXPAND_FAIL:
    return setListFailed(state, 'blocks', me)

  case MUTES_FETCH_REQUEST:
  case MUTES_EXPAND_REQUEST:
    return state.setIn(['mutes', me, 'isLoading'], true)
  case MUTES_FETCH_SUCCESS:
    return normalizeList(state, 'mutes', me, action.accounts, action.next)
  case MUTES_EXPAND_SUCCESS:
    return appendToList(state, 'mutes', me, action.accounts, action.next)
  case MUTES_FETCH_FAIL:
  case MUTES_EXPAND_FAIL:
    return setListFailed(state, 'mutes', me)

  case GROUP_MEMBERS_FETCH_SUCCESS:
    return normalizeList(state, 'groups', action.id, action.accounts, action.next);
  case GROUP_MEMBERS_EXPAND_SUCCESS:
    return appendToList(state, 'groups', action.id, action.accounts, action.next);
  
  case GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS:
    return normalizeList(state, 'groups_removed_accounts', action.id, action.accounts, action.next);
  case GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS:
    return appendToList(state, 'groups_removed_accounts', action.id, action.accounts, action.next);
  case GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS:
    return state.updateIn(['groups_removed_accounts', action.groupId, 'items'], list => list.filterNot(item => item === action.id));
  
  case SUGGESTION_FETCH_SUCCESS:
    return normalizeList(state, 'suggestion', action.id, action.accounts, action.next);
  case SUGGESTION_EXPAND_SUCCESS:
    return appendToList(state, 'suggestion', action.id, action.accounts, action.next);
  case SUGGESTION_FETCH_REQUEST:
  case SUGGESTION_EXPAND_REQUEST:
    return state.setIn(['suggestion', action.id, 'isLoading'], true);
  case SUGGESTION_FETCH_FAIL:
  case SUGGESTION_EXPAND_FAIL:
    return state.setIn(['suggestion', action.id, 'isLoading'], false);

  case GROUP_INVITE_FOLLOWERS_FETCH_SUCCESS:
    return normalizeList(state, 'group_invite_followers', action.id, action.accounts, action.next);
  case GROUP_INVITE_FOLLOWERS_EXPAND_SUCCESS:
    return appendToList(state, 'group_invite_followers', action.id, action.accounts, action.next);
  case GROUP_INVITE_FOLLOWERS_FETCH_REQUEST:
  case GROUP_INVITE_FOLLOWERS_EXPAND_REQUEST:
    return state.setIn(['group_invite_followers', action.id, 'isLoading'], true);
  case GROUP_INVITE_FOLLOWERS_FETCH_FAIL:
  case GROUP_INVITE_FOLLOWERS_EXPAND_FAIL:
    return setListFailed(state, 'group_invite_followers', action.id)

  case GROUP_PENDING_APPLICATIONS_FETCH_SUCCESS:
    return normalizeList(state, 'group_pending_applications', action.id, action.accounts, action.next);
  case GROUP_PENDING_APPLICATIONS_EXPAND_SUCCESS:
    return appendToList(state, 'group_pending_applications', action.id, action.accounts, action.next);
  case GROUP_PENDING_APPLICATIONS_FETCH_REQUEST:
  case GROUP_PENDING_APPLICATIONS_EXPAND_REQUEST:
    return state.setIn(['group_pending_applications', action.id, 'isLoading'], true);
  case GROUP_PENDING_APPLICATIONS_FETCH_FAIL:
  case GROUP_PENDING_APPLICATIONS_EXPAND_FAIL:
    return setListFailed(state, 'group_pending_applications', action.id)

  default:
    return state;
  }
};
