import api from '../api';
import { importFetchedAccounts, importFetchedStatus } from './importer';
import { me } from '../initial_state';

export const REPOST_REQUEST = 'REPOST_REQUEST';
export const REPOST_SUCCESS = 'REPOST_SUCCESS';
export const REPOST_FAIL    = 'REPOST_FAIL';

export const FAVORITE_REQUEST = 'FAVORITE_REQUEST';
export const FAVORITE_SUCCESS = 'FAVORITE_SUCCESS';
export const FAVORITE_FAIL    = 'FAVORITE_FAIL';

export const UNREPOST_REQUEST = 'UNREPOST_REQUEST';
export const UNREPOST_SUCCESS = 'UNREPOST_SUCCESS';
export const UNREPOST_FAIL    = 'UNREPOST_FAIL';

export const UNFAVORITE_REQUEST = 'UNFAVORITE_REQUEST';
export const UNFAVORITE_SUCCESS = 'UNFAVORITE_SUCCESS';
export const UNFAVORITE_FAIL    = 'UNFAVORITE_FAIL';

export const REPOSTS_FETCH_REQUEST = 'REPOSTS_FETCH_REQUEST';
export const REPOSTS_FETCH_SUCCESS = 'REPOSTS_FETCH_SUCCESS';
export const REPOSTS_FETCH_FAIL    = 'REPOSTS_FETCH_FAIL';

export const PIN_REQUEST = 'PIN_REQUEST';
export const PIN_SUCCESS = 'PIN_SUCCESS';
export const PIN_FAIL    = 'PIN_FAIL';

export const UNPIN_REQUEST = 'UNPIN_REQUEST';
export const UNPIN_SUCCESS = 'UNPIN_SUCCESS';
export const UNPIN_FAIL    = 'UNPIN_FAIL';

export const BOOKMARK_REQUEST = 'BOOKMARK_REQUEST'
export const BOOKMARK_SUCCESS = 'BOOKMARK_SUCCESS'
export const BOOKMARK_FAIL    = 'BOOKMARK_FAIL'

export const UNBOOKMARK_REQUEST = 'UNBOOKMARK_REQUEST'
export const UNBOOKMARK_SUCCESS = 'UNBOOKMARK_SUCCESS'
export const UNBOOKMARK_FAIL    = 'UNBOOKMARK_FAIL'

export const LIKES_FETCH_REQUEST = 'LIKES_FETCH_REQUEST';
export const LIKES_FETCH_SUCCESS = 'LIKES_FETCH_SUCCESS';
export const LIKES_FETCH_FAIL    = 'LIKES_FETCH_FAIL';

export function repost(status) {
  return function (dispatch, getState) {
    if (!me) return;

    dispatch(repostRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/reblog`).then(function (response) {
      // The reblog API method returns a new status wrapped around the original. In this case we are only
      // interested in how the original is modified, hence passing it skipping the wrapper
      dispatch(importFetchedStatus(response.data.reblog));
      dispatch(repostSuccess(status));
    }).catch(function (error) {
      dispatch(repostFail(status, error));
    });
  };
};

export function unrepost(status) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(unrepostRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/unreblog`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(unrepostSuccess(status));
    }).catch(error => {
      dispatch(unrepostFail(status, error));
    });
  };
};

export function repostRequest(status) {
  return {
    type: REPOST_REQUEST,
    status: status,
    skipLoading: true,
  };
};

export function repostSuccess(status) {
  return {
    type: REPOST_SUCCESS,
    status: status,
    skipLoading: true,
  };
};

export function repostFail(status, error) {
  return {
    type: REPOST_FAIL,
    status: status,
    error: error,
    skipLoading: true,
  };
};

export function unrepostRequest(status) {
  return {
    type: UNREPOST_REQUEST,
    status: status,
    skipLoading: true,
  };
};

export function unrepostSuccess(status) {
  return {
    type: UNREPOST_SUCCESS,
    status: status,
    skipLoading: true,
  };
};

export function unrepostFail(status, error) {
  return {
    type: UNREPOST_FAIL,
    status: status,
    error: error,
    skipLoading: true,
  };
};

export function favorite(status) {
  return function (dispatch, getState) {
    if (!me) return;

    dispatch(favoriteRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/favourite`).then(function (response) {
      dispatch(importFetchedStatus(response.data));
      dispatch(favoriteSuccess(status));
    }).catch(function (error) {
      dispatch(favoriteFail(status, error));
    });
  };
};

export function unfavorite(status) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(unfavoriteRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/unfavourite`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(unfavoriteSuccess(status));
    }).catch(error => {
      dispatch(unfavoriteFail(status, error));
    });
  };
};

export function favoriteRequest(status) {
  return {
    type: FAVORITE_REQUEST,
    status: status,
    skipLoading: true,
  };
};

export function favoriteSuccess(status) {
  return {
    type: FAVORITE_SUCCESS,
    status: status,
    skipLoading: true,
  };
};

export function favoriteFail(status, error) {
  return {
    type: FAVORITE_FAIL,
    status: status,
    error: error,
    skipLoading: true,
  };
};

export function unfavoriteRequest(status) {
  return {
    type: UNFAVORITE_REQUEST,
    status: status,
    skipLoading: true,
  };
};

export function unfavoriteSuccess(status) {
  return {
    type: UNFAVORITE_SUCCESS,
    status: status,
    skipLoading: true,
  };
};

export function unfavoriteFail(status, error) {
  return {
    type: UNFAVORITE_FAIL,
    status: status,
    error: error,
    skipLoading: true,
  };
};

export function fetchReposts(id) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(fetchRepostsRequest(id));

    api(getState).get(`/api/v1/statuses/${id}/reblogged_by`).then(response => {
      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchRepostsSuccess(id, response.data));
    }).catch(error => {
      dispatch(fetchRepostsFail(id, error));
    });
  };
};

export function fetchRepostsRequest(id) {
  return {
    type: REPOSTS_FETCH_REQUEST,
    id,
  };
};

export function fetchRepostsSuccess(id, accounts) {
  return {
    type: REPOSTS_FETCH_SUCCESS,
    id,
    accounts,
  };
};

export function fetchRepostsFail(id, error) {
  return {
    type: REPOSTS_FETCH_FAIL,
    error,
  };
};

export function pin(status) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(pinRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/pin`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(pinSuccess(status));
    }).catch(error => {
      dispatch(pinFail(status, error));
    });
  };
};

export function pinRequest(status) {
  return {
    type: PIN_REQUEST,
    status,
    skipLoading: true,
  };
};

export function pinSuccess(status) {
  return {
    type: PIN_SUCCESS,
    status,
    skipLoading: true,
  };
};

export function pinFail(status, error) {
  return {
    type: PIN_FAIL,
    status,
    error,
    skipLoading: true,
  };
};

export function unpin (status) {
  return (dispatch, getState) => {
    if (!me) return;
    
    dispatch(unpinRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/unpin`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(unpinSuccess(status));
    }).catch(error => {
      dispatch(unpinFail(status, error));
    });
  };
};

export function unpinRequest(status) {
  return {
    type: UNPIN_REQUEST,
    status,
    skipLoading: true,
  };
};

export function unpinSuccess(status) {
  return {
    type: UNPIN_SUCCESS,
    status,
    skipLoading: true,
  };
};

export function unpinFail(status, error) {
  return {
    type: UNPIN_FAIL,
    status,
    error,
    skipLoading: true,
  };
};

export function fetchLikes(id) {
  return (dispatch, getState) => {
    dispatch(fetchLikesRequest(id));

    api(getState).get(`/api/v1/statuses/${id}/favourited_by`).then(response => {
      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchLikesSuccess(id, response.data));
    }).catch(error => {
      dispatch(fetchLikesFail(id, error));
    });
  };
};

export function fetchLikesRequest(id) {
  return {
    type: LIKES_FETCH_REQUEST,
    id,
  };
};

export function fetchLikesSuccess(id, accounts) {
  return {
    type: LIKES_FETCH_SUCCESS,
    id,
    accounts,
  };
};

export function fetchLikesFail(id, error) {
  return {
    type: LIKES_FETCH_FAIL,
    error,
  };
};

export function bookmark(status) {
  return function (dispatch, getState) {
    dispatch(bookmarkRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/bookmark`).then(function (response) {
      dispatch(importFetchedStatus(response.data));
      dispatch(bookmarkSuccess(status, response.data));
    }).catch(function (error) {
      dispatch(bookmarkFail(status, error))
    })
  }
}

export function unbookmark(status) {
  return (dispatch, getState) => {
    dispatch(unbookmarkRequest(status))

    api(getState).post(`/api/v1/statuses/${status.get('id')}/unbookmark`).then(response => {
      dispatch(importFetchedStatus(response.data))
      dispatch(unbookmarkSuccess(status, response.data))
    }).catch(error => {
      dispatch(unbookmarkFail(status, error))
    })
  }
}

export function bookmarkRequest(status) {
  return {
    type: BOOKMARK_REQUEST,
    status: status,
  }
}

export function bookmarkSuccess(status, response) {
  return {
    type: BOOKMARK_SUCCESS,
    status: status,
    response: response,
  }
}

export function bookmarkFail(status, error) {
  return {
    type: BOOKMARK_FAIL,
    status: status,
    error: error,
  }
}

export function unbookmarkRequest(status) {
  return {
    type: UNBOOKMARK_REQUEST,
    status: status,
  }
}

export function unbookmarkSuccess(status, response) {
  return {
    type: UNBOOKMARK_SUCCESS,
    status: status,
    response: response,
  }
}

export function unbookmarkFail(status, error) {
  return {
    type: UNBOOKMARK_FAIL,
    status: status,
    error: error,
  }
}