import api from '../api';
import openDB from '../storage/db';
import { evictStatus } from '../storage/modifier';
import { deleteFromTimelines } from './timelines';
import { importFetchedStatus, importFetchedStatuses, importAccount, importStatus } from './importer';
import { openModal } from './modal';
import { me } from '../initial_state';

export const STATUS_FETCH_REQUEST = 'STATUS_FETCH_REQUEST';
export const STATUS_FETCH_SUCCESS = 'STATUS_FETCH_SUCCESS';
export const STATUS_FETCH_FAIL    = 'STATUS_FETCH_FAIL';

export const STATUS_DELETE_REQUEST = 'STATUS_DELETE_REQUEST';
export const STATUS_DELETE_SUCCESS = 'STATUS_DELETE_SUCCESS';
export const STATUS_DELETE_FAIL    = 'STATUS_DELETE_FAIL';

export const CONTEXT_FETCH_REQUEST = 'CONTEXT_FETCH_REQUEST';
export const CONTEXT_FETCH_SUCCESS = 'CONTEXT_FETCH_SUCCESS';
export const CONTEXT_FETCH_FAIL    = 'CONTEXT_FETCH_FAIL';

export const COMMENTS_FETCH_REQUEST = 'COMMENTS_FETCH_REQUEST';
export const COMMENTS_FETCH_SUCCESS = 'COMMENTS_FETCH_SUCCESS';
export const COMMENTS_FETCH_FAIL    = 'COMMENTS_FETCH_FAIL';

export const STATUS_MUTE_REQUEST = 'STATUS_MUTE_REQUEST';
export const STATUS_MUTE_SUCCESS = 'STATUS_MUTE_SUCCESS';
export const STATUS_MUTE_FAIL    = 'STATUS_MUTE_FAIL';

export const STATUS_UNMUTE_REQUEST = 'STATUS_UNMUTE_REQUEST';
export const STATUS_UNMUTE_SUCCESS = 'STATUS_UNMUTE_SUCCESS';
export const STATUS_UNMUTE_FAIL    = 'STATUS_UNMUTE_FAIL';

export const STATUS_REVEAL = 'STATUS_REVEAL';
export const STATUS_HIDE   = 'STATUS_HIDE';

export const STATUS_EDIT = 'STATUS_EDIT';

export function fetchStatusRequest(id, skipLoading) {
  return {
    type: STATUS_FETCH_REQUEST,
    id,
    skipLoading,
  };
};

function getFromDB(dispatch, getState, accountIndex, index, id) {
  return new Promise((resolve, reject) => {
    const request = index.get(id);

    request.onerror = reject;

    request.onsuccess = () => {
      const promises = [];

      if (!request.result) {
        reject();
        return;
      }

      dispatch(importStatus(request.result));

      if (getState().getIn(['accounts', request.result.account], null) === null) {
        promises.push(new Promise((accountResolve, accountReject) => {
          const accountRequest = accountIndex.get(request.result.account);

          accountRequest.onerror = accountReject;
          accountRequest.onsuccess = () => {
            if (!request.result) {
              accountReject();
              return;
            }

            dispatch(importAccount(accountRequest.result));
            accountResolve();
          };
        }));
      }

      if (request.result.reblog && getState().getIn(['statuses', request.result.reblog], null) === null) {
        promises.push(getFromDB(dispatch, getState, accountIndex, index, request.result.reblog));
      }

      resolve(Promise.all(promises));
    };
  });
}

export function fetchStatus(id) {
  return (dispatch, getState) => {
    const skipLoading = getState().getIn(['statuses', id], null) !== null;

    // if (skipLoading) {
    //   return;
    // }

    dispatch(fetchStatusRequest(id, skipLoading));

    openDB().then(db => {
      const transaction = db.transaction(['accounts', 'statuses'], 'read');
      const accountIndex = transaction.objectStore('accounts').index('id');
      const index = transaction.objectStore('statuses').index('id');

      return getFromDB(dispatch, getState, accountIndex, index, id).then(() => {
        db.close();
      }, error => {
        db.close();
        throw error;
      });
    }).then(() => {
      dispatch(fetchStatusSuccess(skipLoading));
    }, () => api(getState).get(`/api/v1/statuses/${id}`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(fetchStatusSuccess(skipLoading));
    })).catch(error => {
      dispatch(fetchStatusFail(id, error, skipLoading));
    });
  };
};

export function fetchStatusSuccess(skipLoading) {
  return {
    type: STATUS_FETCH_SUCCESS,
    skipLoading,
  };
};

export function fetchStatusFail(id, error, skipLoading) {
  return {
    type: STATUS_FETCH_FAIL,
    id,
    error,
    skipLoading,
    skipAlert: true,
  };
};

export function editStatus(status) {
  return dispatch => {
    dispatch({
      type: STATUS_EDIT,
      status,
    });

    dispatch(openModal('COMPOSE'));
  };
};

export function deleteStatus(id, routerHistory) {
  return (dispatch, getState) => {
    if (!me) return;

    let status = getState().getIn(['statuses', id]);

    if (status.get('poll')) {
      status = status.set('poll', getState().getIn(['polls', status.get('poll')]));
    }

    dispatch(deleteStatusRequest(id));

    api(getState).delete(`/api/v1/statuses/${id}`).then(response => {
      evictStatus(id);
      dispatch(deleteStatusSuccess(id));
      dispatch(deleteFromTimelines(id));
    }).catch(error => {
      dispatch(deleteStatusFail(id, error));
    });
  };
};

export function deleteStatusRequest(id) {
  return {
    type: STATUS_DELETE_REQUEST,
    id: id,
  };
};

export function deleteStatusSuccess(id) {
  return {
    type: STATUS_DELETE_SUCCESS,
    id: id,
  };
};

export function deleteStatusFail(id, error) {
  return {
    type: STATUS_DELETE_FAIL,
    id: id,
    error: error,
  };
};

export function fetchContext(id, ensureIsReply) {
  return (dispatch, getState) => {
    if (ensureIsReply) {
      const isReply = !!getState().getIn(['statuses', id, 'in_reply_to_id'], null)
      if (!isReply) return;
    }

    dispatch(fetchContextRequest(id));

    api(getState).get(`/api/v1/statuses/${id}/context`).then(response => {
      dispatch(importFetchedStatuses(response.data.ancestors.concat(response.data.descendants)));
      dispatch(fetchContextSuccess(id, response.data.ancestors, response.data.descendants));

    }).catch(error => {
      if (error.response && error.response.status === 404) {
        dispatch(deleteFromTimelines(id));
      }

      dispatch(fetchContextFail(id, error));
    });
  };
};

export function fetchComments(id) {
  return (dispatch, getState) => {
    dispatch(fetchCommentsRequest(id));

    api(getState).get(`/api/v1/statuses/${id}/comments`).then(response => {
      dispatch(importFetchedStatuses(response.data.descendants));
      dispatch(fetchCommentsSuccess(id, response.data.descendants));

    }).catch(error => {
      if (error.response && error.response.status === 404) {
        dispatch(deleteFromTimelines(id));
      }

      dispatch(fetchCommentsFail(id, error));
    });
  };
};

export function fetchContextRequest(id) {
  return {
    type: CONTEXT_FETCH_REQUEST,
    id,
  };
};

export function fetchContextSuccess(id, ancestors, descendants) {
  return {
    type: CONTEXT_FETCH_SUCCESS,
    id,
    ancestors,
    descendants,
    statuses: ancestors.concat(descendants),
  };
};

export function fetchContextFail(id, error) {
  return {
    type: CONTEXT_FETCH_FAIL,
    id,
    error,
    skipAlert: true,
  };
};

export function fetchCommentsRequest(id) {
  return {
    type: COMMENTS_FETCH_REQUEST,
    id,
  };
};

export function fetchCommentsSuccess(id, descendants) {
  return {
    type: COMMENTS_FETCH_SUCCESS,
    id,
    descendants,
  };
};

export function fetchCommentsFail(id, error) {
  return {
    type: COMMENTS_FETCH_FAIL,
    id,
    error,
    skipAlert: true,
  };
};

export function muteStatus(id) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(muteStatusRequest(id));

    api(getState).post(`/api/v1/statuses/${id}/mute`).then(() => {
      dispatch(muteStatusSuccess(id));
    }).catch(error => {
      dispatch(muteStatusFail(id, error));
    });
  };
};

export function muteStatusRequest(id) {
  return {
    type: STATUS_MUTE_REQUEST,
    id,
  };
};

export function muteStatusSuccess(id) {
  return {
    type: STATUS_MUTE_SUCCESS,
    id,
  };
};

export function muteStatusFail(id, error) {
  return {
    type: STATUS_MUTE_FAIL,
    id,
    error,
  };
};

export function unmuteStatus(id) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(unmuteStatusRequest(id));

    api(getState).post(`/api/v1/statuses/${id}/unmute`).then(() => {
      dispatch(unmuteStatusSuccess(id));
    }).catch(error => {
      dispatch(unmuteStatusFail(id, error));
    });
  };
};

export function unmuteStatusRequest(id) {
  return {
    type: STATUS_UNMUTE_REQUEST,
    id,
  };
};

export function unmuteStatusSuccess(id) {
  return {
    type: STATUS_UNMUTE_SUCCESS,
    id,
  };
};

export function unmuteStatusFail(id, error) {
  return {
    type: STATUS_UNMUTE_FAIL,
    id,
    error,
  };
};

export function hideStatus(ids) {
  if (!Array.isArray(ids)) {
    ids = [ids];
  }

  return {
    type: STATUS_HIDE,
    ids,
  };
};

export function revealStatus(ids) {
  if (!Array.isArray(ids)) {
    ids = [ids];
  }

  return {
    type: STATUS_REVEAL,
    ids,
  };
};
