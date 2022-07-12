import {
  Map as ImmutableMap,
  List as ImmutableList,
} from 'immutable'
import api, { getLinks } from '../api';
import { me } from '../initial_state';
import { importFetchedAccounts } from './importer';
import { fetchRelationships } from './accounts';
import {
  GROUP_LIST_SORTING_TYPE_ALPHABETICAL,
  GROUP_LIST_SORTING_TYPE_MOST_POPULAR,
} from '../constants'

export const GROUP_FETCH_REQUEST = 'GROUP_FETCH_REQUEST';
export const GROUP_FETCH_SUCCESS = 'GROUP_FETCH_SUCCESS';
export const GROUP_FETCH_FAIL    = 'GROUP_FETCH_FAIL';

export const GROUP_RELATIONSHIPS_FETCH_REQUEST = 'GROUP_RELATIONSHIPS_FETCH_REQUEST';
export const GROUP_RELATIONSHIPS_FETCH_SUCCESS = 'GROUP_RELATIONSHIPS_FETCH_SUCCESS';
export const GROUP_RELATIONSHIPS_FETCH_FAIL    = 'GROUP_RELATIONSHIPS_FETCH_FAIL';

export const GROUPS_FETCH_REQUEST = 'GROUPS_FETCH_REQUEST';
export const GROUPS_FETCH_SUCCESS = 'GROUPS_FETCH_SUCCESS';
export const GROUPS_FETCH_FAIL    = 'GROUPS_FETCH_FAIL';

export const GROUP_JOIN_REQUEST = 'GROUP_JOIN_REQUEST';
export const GROUP_JOIN_SUCCESS = 'GROUP_JOIN_SUCCESS';
export const GROUP_JOIN_FAIL    = 'GROUP_JOIN_FAIL';

export const GROUP_LEAVE_REQUEST = 'GROUP_LEAVE_REQUEST';
export const GROUP_LEAVE_SUCCESS = 'GROUP_LEAVE_SUCCESS';
export const GROUP_LEAVE_FAIL    = 'GROUP_LEAVE_FAIL';

export const GROUP_MEMBERS_FETCH_REQUEST = 'GROUP_MEMBERS_FETCH_REQUEST';
export const GROUP_MEMBERS_FETCH_SUCCESS = 'GROUP_MEMBERS_FETCH_SUCCESS';
export const GROUP_MEMBERS_FETCH_FAIL    = 'GROUP_MEMBERS_FETCH_FAIL';

export const GROUP_MEMBERS_EXPAND_REQUEST = 'GROUP_MEMBERS_EXPAND_REQUEST';
export const GROUP_MEMBERS_EXPAND_SUCCESS = 'GROUP_MEMBERS_EXPAND_SUCCESS';
export const GROUP_MEMBERS_EXPAND_FAIL    = 'GROUP_MEMBERS_EXPAND_FAIL';

export const GROUP_REMOVED_ACCOUNTS_FETCH_REQUEST = 'GROUP_REMOVED_ACCOUNTS_FETCH_REQUEST';
export const GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS = 'GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS';
export const GROUP_REMOVED_ACCOUNTS_FETCH_FAIL    = 'GROUP_REMOVED_ACCOUNTS_FETCH_FAIL';

export const GROUP_REMOVED_ACCOUNTS_EXPAND_REQUEST = 'GROUP_REMOVED_ACCOUNTS_EXPAND_REQUEST';
export const GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS = 'GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS';
export const GROUP_REMOVED_ACCOUNTS_EXPAND_FAIL    = 'GROUP_REMOVED_ACCOUNTS_EXPAND_FAIL';

export const GROUP_REMOVED_ACCOUNTS_REMOVE_REQUEST = 'GROUP_REMOVED_ACCOUNTS_REMOVE_REQUEST';
export const GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS = 'GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS';
export const GROUP_REMOVED_ACCOUNTS_REMOVE_FAIL    = 'GROUP_REMOVED_ACCOUNTS_REMOVE_FAIL';

export const GROUP_REMOVED_ACCOUNTS_CREATE_REQUEST = 'GROUP_REMOVED_ACCOUNTS_CREATE_REQUEST';
export const GROUP_REMOVED_ACCOUNTS_CREATE_SUCCESS = 'GROUP_REMOVED_ACCOUNTS_CREATE_SUCCESS';
export const GROUP_REMOVED_ACCOUNTS_CREATE_FAIL    = 'GROUP_REMOVED_ACCOUNTS_CREATE_FAIL';

export const GROUP_REMOVE_STATUS_REQUEST = 'GROUP_REMOVE_STATUS_REQUEST';
export const GROUP_REMOVE_STATUS_SUCCESS = 'GROUP_REMOVE_STATUS_SUCCESS';
export const GROUP_REMOVE_STATUS_FAIL    = 'GROUP_REMOVE_STATUS_FAIL';

export const GROUP_UPDATE_ROLE_REQUEST = 'GROUP_UPDATE_ROLE_REQUEST';
export const GROUP_UPDATE_ROLE_SUCCESS = 'GROUP_UPDATE_ROLE_SUCCESS';
export const GROUP_UPDATE_ROLE_FAIL    = 'GROUP_UPDATE_ROLE_FAIL';

export const GROUP_INVITE_FOLLOWERS_REQUEST = 'GROUP_INVITE_FOLLOWERS_REQUEST';
export const GROUP_INVITE_FOLLOWERS_SUCCESS = 'GROUP_UPDATE_ROLE_SUCCESS';
export const GROUP_INVITE_FOLLOWERS_FAIL    = 'GROUP_UPDATE_ROLE_FAIL';

export const GROUP_MAKE_PRIVATE_REQUEST = 'GROUP_MAKE_PRIVATE_REQUEST';
export const GROUP_MAKE_PRIVATE_SUCCESS = 'GROUP_MAKE_PRIVATE_SUCCESS';
export const GROUP_MAKE_PRIVATE_FAIL    = 'GROUP_MAKE_PRIVATE_FAIL';

export const GROUP_MAKE_PUBLIC_REQUEST = 'GROUP_MAKE_PUBLIC_REQUEST';
export const GROUP_MAKE_PUBLIC_SUCCESS = 'GROUP_MAKE_PUBLIC_SUCCESS';
export const GROUP_MAKE_PUBLIC_FAIL    = 'GROUP_UNPRIVATE_FAIL';

export const GROUP_JOIN_PRIVATE_REQUEST = 'GROUP_JOIN_PRIVATE_REQUEST';
export const GROUP_JOIN_PRIVATE_SUCCESS = 'GROUP_JOIN_PRIVATE_SUCCESS';
export const GROUP_JOIN_PRIVATE_FAIL    = 'GROUP_JOIN_PRIVATE_FAIL';

export const GROUP_PENDING_APPLICATIONS_FETCH_REQUEST = 'GROUP_PENDING_APPLICATIONS_FETCH_REQUEST';
export const GROUP_PENDING_APPLICATIONS_FETCH_SUCCESS = 'GROUP_PENDING_APPLICATIONS_FETCH_SUCCESS';
export const GROUP_PENDING_APPLICATIONS_FETCH_FAIL    = 'GROUP_PENDING_APPLICATIONS_FETCH_FAIL';

export const GROUP_PENDING_APPLICATIONS_EXPAND_REQUEST = 'GROUP_PENDING_APPLICATIONS_EXPAND_REQUEST';
export const GROUP_PENDING_APPLICATIONS_EXPAND_SUCCESS = 'GROUP_PENDING_APPLICATIONS_EXPAND_SUCCESS';
export const GROUP_PENDING_APPLICATIONS_EXPAND_FAIL    = 'GROUP_PENDING_APPLICATIONS_EXPAND_FAIL';

export const GROUP_APPROVE_PENDING_APPLICATIONS_REQUEST = 'GROUP_APPROVE_PENDING_APPLICATIONS_REQUEST';
export const GROUP_APPROVE_PENDING_APPLICATIONS_SUCCESS = 'GROUP_APPROVE_PENDING_APPLICATIONS_SUCCESS';
export const GROUP_APPROVE_PENDING_APPLICATIONS_FAIL    = 'GROUP_APPROVE_PENDING_APPLICATIONS_FAIL';

export const GROUP_SORT = 'GROUP_SORT'

export const importGroup = (group) => (dispatch) => {
  dispatch(fetchGroupSuccess(group))
}

export const fetchGroup = id => (dispatch, getState) => {
  dispatch(fetchGroupRelationships([id]));

  if (getState().getIn(['groups', id])) {
    return;
  }

  dispatch(fetchGroupRequest(id));

  api(getState).get(`/api/v1/groups/${id}`)
    .then(({ data }) => dispatch(fetchGroupSuccess(data)))
    .catch(err => dispatch(fetchGroupFail(id, err)));
};

export const fetchGroupRequest = id => ({
  type: GROUP_FETCH_REQUEST,
  id,
});

export const fetchGroupSuccess = group => ({
  type: GROUP_FETCH_SUCCESS,
  group,
});

export const fetchGroupFail = (id, error) => ({
  type: GROUP_FETCH_FAIL,
  id,
  error,
});

export function fetchGroupRelationships(groupIds) {
  return (dispatch, getState) => {
    if (!me) return;

    const loadedRelationships = getState().get('group_relationships');
    const newGroupIds = groupIds.filter(id => loadedRelationships.get(id, null) === null);

    if (newGroupIds.length === 0) {
      return;
    }

    dispatch(fetchGroupRelationshipsRequest(newGroupIds));

    api(getState).get(`/api/v1/groups/${newGroupIds[0]}/relationships?${newGroupIds.map(id => `id[]=${id}`).join('&')}`).then(response => {
      dispatch(fetchGroupRelationshipsSuccess(response.data));
    }).catch(error => {
      dispatch(fetchGroupRelationshipsFail(error));
    });
  };
};

export function fetchGroupRelationshipsRequest(ids) {
  return {
    type: GROUP_RELATIONSHIPS_FETCH_REQUEST,
    ids,
    skipLoading: true,
  };
};

export function fetchGroupRelationshipsSuccess(relationships) {
  return {
    type: GROUP_RELATIONSHIPS_FETCH_SUCCESS,
    relationships,
    skipLoading: true,
  };
};

export function fetchGroupRelationshipsFail(error) {
  return {
    type: GROUP_RELATIONSHIPS_FETCH_FAIL,
    error,
    skipLoading: true,
  };
};

export const fetchGroups = (tab) => (dispatch, getState) => {
  if (!me && tab !== 'featured') return

  // Don't refetch or fetch when loading
  const isLoading = getState().getIn(['group_lists', tab, 'isLoading'])
  const isFetched = getState().getIn(['group_lists', tab, 'isFetched'])

  if (isLoading || isFetched) return

  dispatch(fetchGroupsRequest(tab))

  api(getState).get('/api/v1/groups?tab=' + tab)
    .then(({ data }) => {
      dispatch(fetchGroupsSuccess(data, tab))
      dispatch(fetchGroupRelationships(data.map(item => item.id)))
    })
    .catch((err) => dispatch(fetchGroupsFail(err, tab)))
}

export const fetchGroupsRequest = (tab) => ({
  type: GROUPS_FETCH_REQUEST,
  tab,
});

export const fetchGroupsSuccess = (groups, tab) => ({
  type: GROUPS_FETCH_SUCCESS,
  groups,
  tab,
});

export const fetchGroupsFail = (error, tab) => ({
  type: GROUPS_FETCH_FAIL,
  error,
  tab,
});

export function joinGroup(id) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(joinGroupRequest(id));

    api(getState).post(`/api/v1/groups/${id}/accounts`).then(response => {
      dispatch(joinGroupSuccess(response.data));
    }).catch(error => {
      dispatch(joinGroupFail(id, error));
    });
  };
};

export function leaveGroup(id) {
  return (dispatch, getState) => {
    if (!me) return;
    
    dispatch(leaveGroupRequest(id));

    api(getState).delete(`/api/v1/groups/${id}/accounts`).then(response => {
      dispatch(leaveGroupSuccess(response.data));
    }).catch(error => {
      dispatch(leaveGroupFail(id, error));
    });
  };
};

export function joinGroupRequest(id) {
  return {
    type: GROUP_JOIN_REQUEST,
    id,
  };
};

export function joinGroupSuccess(relationship) {
  return {
    type: GROUP_JOIN_SUCCESS,
    relationship
  };
};

export function joinGroupFail(error) {
  return {
    type: GROUP_JOIN_FAIL,
    error,
  };
};

export function leaveGroupRequest(id) {
  return {
    type: GROUP_LEAVE_REQUEST,
    id,
  };
};

export function leaveGroupSuccess(relationship) {
  return {
    type: GROUP_LEAVE_SUCCESS,
    relationship,
  };
};

export function leaveGroupFail(error) {
  return {
    type: GROUP_LEAVE_FAIL,
    error,
  };
};

export function fetchMembers(id) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(fetchMembersRequest(id));

    api(getState).get(`/api/v1/groups/${id}/accounts`).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchMembersSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => {
      dispatch(fetchMembersFail(id, error));
    });
  };
};

export function fetchMembersRequest(id) {
  return {
    type: GROUP_MEMBERS_FETCH_REQUEST,
    id,
  };
};

export function fetchMembersSuccess(id, accounts, next) {
  return {
    type: GROUP_MEMBERS_FETCH_SUCCESS,
    id,
    accounts,
    next,
  };
};

export function fetchMembersFail(id, error) {
  return {
    type: GROUP_MEMBERS_FETCH_FAIL,
    id,
    error,
  };
};

export function expandMembers(id) {
  return (dispatch, getState) => {
    if (!me) return;

    const url = getState().getIn(['user_lists', 'groups', id, 'next'])
    const isLoading = getState().getIn(['user_lists', 'groups', id, 'isLoading'])

    if (url === null || isLoading) return

    dispatch(expandMembersRequest(id));

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(expandMembersSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => {
      dispatch(expandMembersFail(id, error));
    });
  };
};

export function expandMembersRequest(id) {
  return {
    type: GROUP_MEMBERS_EXPAND_REQUEST,
    id,
  };
};

export function expandMembersSuccess(id, accounts, next) {
  return {
    type: GROUP_MEMBERS_EXPAND_SUCCESS,
    id,
    accounts,
    next,
  };
};

export function expandMembersFail(id, error) {
  return {
    type: GROUP_MEMBERS_EXPAND_FAIL,
    id,
    error,
  };
};

export function fetchRemovedAccounts(id) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(fetchRemovedAccountsRequest(id));

    api(getState).get(`/api/v1/groups/${id}/removed_accounts`).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchRemovedAccountsSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => {
      dispatch(fetchRemovedAccountsFail(id, error));
    });
  };
};

export function fetchRemovedAccountsRequest(id) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_FETCH_REQUEST,
    id,
  };
};

export function fetchRemovedAccountsSuccess(id, accounts, next) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_FETCH_SUCCESS,
    id,
    accounts,
    next,
  };
};

export function fetchRemovedAccountsFail(id, error) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_FETCH_FAIL,
    id,
    error,
  };
};

export function expandRemovedAccounts(id) {
  return (dispatch, getState) => {
    if (!me) return;

    const url = getState().getIn(['user_lists', 'groups_removed_accounts', id, 'next']);
    const isLoading = getState().getIn(['user_lists', 'groups_removed_accounts', id, 'isLoading'])

    if (url === null || isLoading) return

    dispatch(expandRemovedAccountsRequest(id));

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(expandRemovedAccountsSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => {
      dispatch(expandRemovedAccountsFail(id, error));
    });
  };
};

export function expandRemovedAccountsRequest(id) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_EXPAND_REQUEST,
    id,
  };
};

export function expandRemovedAccountsSuccess(id, accounts, next) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_EXPAND_SUCCESS,
    id,
    accounts,
    next,
  };
};

export function expandRemovedAccountsFail(id, error) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_EXPAND_FAIL,
    id,
    error,
  };
};

export function removeRemovedAccount(groupId, id) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(removeRemovedAccountRequest(groupId, id));

    api(getState).delete(`/api/v1/groups/${groupId}/removed_accounts?account_id=${id}`).then(response => {
      dispatch(removeRemovedAccountSuccess(groupId, id));
    }).catch(error => {
      dispatch(removeRemovedAccountFail(groupId, id, error));
    });
  };
};

export function removeRemovedAccountRequest(groupId, id) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_REMOVE_REQUEST,
    groupId,
    id,
  };
};

export function removeRemovedAccountSuccess(groupId, id) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_REMOVE_SUCCESS,
    groupId,
    id,
  };
};

export function removeRemovedAccountFail(groupId, id, error) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_REMOVE_FAIL,
    groupId,
    id,
    error,
  };
};

export function createRemovedAccount(groupId, id) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(createRemovedAccountRequest(groupId, id));

    api(getState).post(`/api/v1/groups/${groupId}/removed_accounts?account_id=${id}`).then(response => {
      dispatch(createRemovedAccountSuccess(groupId, id));
      dispatch(fetchMembers(groupId));
    }).catch(error => {
      dispatch(createRemovedAccountFail(groupId, id, error));
    });
  };
};

export function createRemovedAccountRequest(groupId, id) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_CREATE_REQUEST,
    groupId,
    id,
  };
};

export function createRemovedAccountSuccess(groupId, id) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_CREATE_SUCCESS,
    groupId,
    id,
  };
};

export function createRemovedAccountFail(groupId, id, error) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_CREATE_FAIL,
    groupId,
    id,
    error,
  };
};

export function groupRemoveStatus(groupId, id) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(groupRemoveStatusRequest(groupId, id));

    api(getState).delete(`/api/v1/groups/${groupId}/statuses/${id}`).then(response => {
      dispatch(groupRemoveStatusSuccess(groupId, id));
    }).catch(error => {
      dispatch(groupRemoveStatusFail(groupId, id, error));
    });
  };
};

export function groupRemoveStatusRequest(groupId, id) {
  return {
    type: GROUP_REMOVE_STATUS_REQUEST,
    groupId,
    id,
  };
};

export function groupRemoveStatusSuccess(groupId, id) {
  return {
    type: GROUP_REMOVE_STATUS_SUCCESS,
    groupId,
    id,
  };
};

export function groupRemoveStatusFail(groupId, id, error) {
  return {
    type: GROUP_REMOVE_STATUS_FAIL,
    groupId,
    id,
    error,
  };
};

export function updateRole(groupId, id, role) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(updateRoleRequest(groupId, id));

    api(getState).patch(`/api/v1/groups/${groupId}/accounts?account_id=${id}`, { role }).then(response => {
      dispatch(importFetchedAccounts([response.data]));
      dispatch(updateRoleSuccess(groupId, id));
      dispatch(fetchRelationships(response.data.id));
    }).catch(error => {
      dispatch(updateRoleFail(groupId, id, error));
    });
  };
};

export function updateRoleRequest(groupId, id) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_CREATE_REQUEST,
    groupId,
    id,
  };
};

export function updateRoleSuccess(groupId, id) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_CREATE_SUCCESS,
    groupId,
    id,
  };
};

export function updateRoleFail(groupId, id, error) {
  return {
    type: GROUP_REMOVED_ACCOUNTS_CREATE_FAIL,
    groupId,
    id,
    error,
  };
};

export const sortGroups = (tab, sortType) => (dispatch, getState) => {
  const groupIdsByTab = getState().getIn(['group_lists', tab, 'items'], ImmutableList()).toJS()
  const allGroups = getState().get('groups', ImmutableMap()).toJS()

  let groupsByTab = []
  
  for (const key in allGroups) {
    const block = allGroups[key]
    if (groupIdsByTab.indexOf(block.id > -1)) {
      groupsByTab.push(block)
    }
  }

  if (sortType === GROUP_LIST_SORTING_TYPE_ALPHABETICAL) {
    groupsByTab.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortType === GROUP_LIST_SORTING_TYPE_MOST_POPULAR) {
    groupsByTab.sort((a, b) => (a.member_count < b.member_count) ? 1 : -1)
  }

  const sortedGroupsIdsByTab = groupsByTab.map((group) => group.id)

  dispatch(groupsSort(tab, sortedGroupsIdsByTab))
};

export function groupsSort(tab, groupIds) {
  return {
    type: GROUP_SORT,
    tab,
    groupIds,
  }
}


export function inviteFollowers(id, follwers, reblogs = true) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(inviteFollowersRequest(id));

    api(getState).post(`/api/v1/groups/${id}/invite`, { followers: follwers, reblogs: reblogs }).then(response => {
      dispatch(inviteFollowersSuccess(response.data));
    }).catch(error => {
      dispatch(inviteFollowersFail(id, error));
    });
  };
};

export function inviteFollowersRequest(id) {
  return {
    type: GROUP_INVITE_FOLLOWERS_REQUEST,
    id,
  };
};

export function inviteFollowersSuccess(relationship) {
  return {
    type: GROUP_INVITE_FOLLOWERS_SUCCESS,
    relationship
  };
};

export function inviteFollowersFail(error) {
  return {
    type: GROUP_INVITE_FOLLOWERS_FAIL,
    error,
  };
};


export function makePrivateGroup(id) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(makePrivateGroupRequest(id));

    api(getState).post(`/api/v1/groups/${id}/make_private`).then(response => {
      dispatch(makePrivateGroupSuccess(response.data));
    }).catch(error => {
      dispatch(makePrivateGroupFail(id, error));
    });

    dispatch(fetchGroupRelationships([id]));

    dispatch(fetchGroupRequest(id));

    setTimeout(function() {
      api(getState).get(`/api/v1/groups/${id}`)
        .then(({ data }) => dispatch(fetchGroupSuccess(data)))
        .catch(err => dispatch(fetchGroupFail(id, err)));
    }, 100)
  };
};

export function makePrivateGroupRequest(id) {
  return {
    type: GROUP_MAKE_PRIVATE_REQUEST,
    id,
  };
};

export function makePrivateGroupSuccess(relationship) {
  return {
    type: GROUP_MAKE_PRIVATE_SUCCESS,
    relationship
  };
};

export function makePrivateGroupFail(error) {
  return {
    type: GROUP_MAKE_PRIVATE_FAIL,
    error,
  };
};

export function makePublicGroup(id) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(makePublicGroupRequest(id));

    api(getState).post(`/api/v1/groups/${id}/make_public`).then(response => {
      dispatch(makePublicGroupSuccess(response.data));
    }).catch(error => {
      dispatch(makePublicGroupFail(id, error));
    });

    dispatch(fetchGroupRelationships([id]));

    dispatch(fetchGroupRequest(id));

    setTimeout(function() {
      api(getState).get(`/api/v1/groups/${id}`)
        .then(({ data }) => dispatch(fetchGroupSuccess(data)))
        .catch(err => dispatch(fetchGroupFail(id, err)));
    }, 100)
  };
};

export function makePublicGroupRequest(id) {
  return {
    type: GROUP_MAKE_PUBLIC_REQUEST,
    id,
  };
};

export function makePublicGroupSuccess(relationship) {
  return {
    type: GROUP_MAKE_PUBLIC_SUCCESS,
    relationship
  };
};

export function makePublicGroupFail(error) {
  return {
    type: GROUP_MAKE_PUBLIC_FAIL,
    error,
  };
};


export function joinPrivateGroup(id, description, reblogs = true) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(joinPrivateGroupRequest(id));

    api(getState).post(`/api/v1/groups/${id}/join_private`, { description: description, reblogs: reblogs }).then(response => {
      dispatch(joinPrivateGroupSuccess(response.data));
    }).catch(error => {
      dispatch(joinPrivateGroupFail(id, error));
    });
  };
};

export function joinPrivateGroupRequest(id) {
  return {
    type: GROUP_JOIN_PRIVATE_REQUEST,
    id,
  };
};

export function joinPrivateGroupSuccess(relationship) {
  return {
    type: GROUP_JOIN_PRIVATE_SUCCESS,
    relationship
  };
};

export function joinPrivateGroupFail(error) {
  return {
    type: GROUP_JOIN_PRIVATE_FAIL,
    error,
  };
};


export function fetchPendingApplications(id) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(fetchPendingApplicationsRequest(id));

    api(getState).get(`/api/v1/groups/${id}/join_private`).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchPendingApplicationsSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => {
      dispatch(fetchPendingApplicationsFail(id, error));
    });
  };
};

export function fetchPendingApplicationsRequest(id) {
  return {
    type: GROUP_PENDING_APPLICATIONS_FETCH_REQUEST,
    id,
  };
};

export function fetchPendingApplicationsSuccess(id, accounts, next) {
  return {
    type: GROUP_PENDING_APPLICATIONS_FETCH_SUCCESS,
    id,
    accounts,
    next,
  };
};

export function fetchPendingApplicationsFail(id, error) {
  return {
    type: GROUP_PENDING_APPLICATIONS_FETCH_FAIL,
    id,
    error,
  };
};

export function expandPendingApplications(id) {
  return (dispatch, getState) => {
    if (!me) return;

    const url = getState().getIn(['user_lists', 'group_pending_applications', id, 'next']);
    const isLoading = getState().getIn(['user_lists', 'group_pending_applications', id, 'isLoading'])

    if (url === null || isLoading) return

    dispatch(expandPendingApplicationsRequest(id));

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(expandPendingApplicationsSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => {
      dispatch(expandPendingApplicationsFail(id, error));
    });
  };
};

export function expandPendingApplicationsRequest(id) {
  return {
    type: GROUP_PENDING_APPLICATIONS_EXPAND_REQUEST,
    id,
  };
};

export function expandPendingApplicationsSuccess(id, accounts, next) {
  return {
    type: GROUP_PENDING_APPLICATIONS_EXPAND_SUCCESS,
    id,
    accounts,
    next,
  };
};

export function expandPendingApplicationsFail(id, error) {
  return {
    type: GROUP_PENDING_APPLICATIONS_EXPAND_FAIL,
    id,
    error,
  };
};


export function approvePendingApplications(id, account_ids, reblogs = true) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(approvePendingApplicationsRequest(id));

    api(getState).post(`/api/v1/groups/${id}/approve_join_private`, { account_ids: account_ids, reblogs: reblogs }).then(response => {
      dispatch(approvePendingApplicationsSuccess(response.data));
    }).catch(error => {
      dispatch(approvePendingApplicationsFail(id, error));
    });
  };
};

export function approvePendingApplicationsRequest(id) {
  return {
    type:  GROUP_APPROVE_PENDING_APPLICATIONS_REQUEST,
    id,
  };
};

export function approvePendingApplicationsSuccess(group) {
  return {
    type: GROUP_APPROVE_PENDING_APPLICATIONS_SUCCESS,
    group,
  };
};

export function approvePendingApplicationsFail(error) {
  return {
    type: GROUP_APPROVE_PENDING_APPLICATIONS_FAIL,
    error,
  };
};