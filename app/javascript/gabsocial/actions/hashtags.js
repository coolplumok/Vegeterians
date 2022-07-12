import api from '../api';

export const HASHTAGS_FETCH_REQUEST = 'HASHTAGS_FETCH_REQUEST';
export const HASHTAGS_FETCH_SUCCESS = 'HASHTAGS_FETCH_SUCCESS';
export const HASHTAGS_FETCH_FAIL    = 'HASHTAGS_FETCH_FAIL';

export function fetchHashtags() {
  return (dispatch, getState) => {
    dispatch(fetchHashtagsRequest());

    api(getState).get('/api/v1/trends').then(response => {
      dispatch(fetchHashtagsSuccess(response.data));
    }).catch(error => dispatch(fetchHashtagsFail(error)));
  };
};

export function fetchHashtagsRequest() {
  return {
    type: HASHTAGS_FETCH_REQUEST,
    skipLoading: true,
  };
};

export function fetchHashtagsSuccess(tags) {
  return {
    tags,
    type: HASHTAGS_FETCH_SUCCESS,
    skipLoading: true,
  };
};

export function fetchHashtagsFail(error) {
  return {
    error,
    type: HASHTAGS_FETCH_FAIL,
    skipLoading: true,
    skipAlert: true,
  };
};
