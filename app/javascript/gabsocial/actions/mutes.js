import api, { getLinks } from '../api';
import { fetchRelationships } from './accounts';
import { importFetchedAccounts } from './importer';
import { openModal } from './modal';
import { me } from '../initial_state';

export const MUTES_FETCH_REQUEST = 'MUTES_FETCH_REQUEST';
export const MUTES_FETCH_SUCCESS = 'MUTES_FETCH_SUCCESS';
export const MUTES_FETCH_FAIL    = 'MUTES_FETCH_FAIL';

export const MUTES_EXPAND_REQUEST = 'MUTES_EXPAND_REQUEST';
export const MUTES_EXPAND_SUCCESS = 'MUTES_EXPAND_SUCCESS';
export const MUTES_EXPAND_FAIL    = 'MUTES_EXPAND_FAIL';

export const MUTES_INIT_MODAL = 'MUTES_INIT_MODAL';

export function fetchMutes() {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(fetchMutesRequest());

    api(getState).get('/api/v1/mutes').then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchMutesSuccess(response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => dispatch(fetchMutesFail(error)));
  };
};

export function fetchMutesRequest() {
  return {
    type: MUTES_FETCH_REQUEST,
  };
};

export function fetchMutesSuccess(accounts, next) {
  return {
    type: MUTES_FETCH_SUCCESS,
    accounts,
    next,
  };
};

export function fetchMutesFail(error) {
  return {
    type: MUTES_FETCH_FAIL,
    error,
  };
};

export function expandMutes() {
  return (dispatch, getState) => {
    if (!me) return;
    
    const url = getState().getIn(['user_lists', 'mutes', me, 'next']);
    const isLoading = getState().getIn(['user_lists', 'mutes', me, 'isLoading']);

    if (url === null || isLoading) return

    dispatch(expandMutesRequest());

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedAccounts(response.data));
      dispatch(expandMutesSuccess(response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => dispatch(expandMutesFail(error)));
  };
};

export function expandMutesRequest() {
  return {
    type: MUTES_EXPAND_REQUEST,
  };
};

export function expandMutesSuccess(accounts, next) {
  return {
    type: MUTES_EXPAND_SUCCESS,
    accounts,
    next,
  };
};

export function expandMutesFail(error) {
  return {
    type: MUTES_EXPAND_FAIL,
    error,
  };
};

export function initMuteModal(account) {
  return dispatch => {
    dispatch({
      type: MUTES_INIT_MODAL,
      account,
    });

    dispatch(openModal('MUTE'));
  };
}