import api from '../api'
import { importFetchedAccounts } from './importer'
import { me } from '../initial_state'
import {
  SUGGESTION_TYPE_VERIFIED,
  SUGGESTION_TYPE_RELATED,
} from '../constants'

export const SUGGESTIONS_FETCH_REQUEST = 'SUGGESTIONS_FETCH_REQUEST'
export const SUGGESTIONS_FETCH_SUCCESS = 'SUGGESTIONS_FETCH_SUCCESS'
export const SUGGESTIONS_FETCH_FAIL    = 'SUGGESTIONS_FETCH_FAIL'

export const SUGGESTIONS_DISMISS = 'SUGGESTIONS_DISMISS'

export function fetchPopularSuggestions() {
  return (dispatch, getState) => {
    if (!me) return false

    dispatch(fetchSuggestionsRequest(SUGGESTION_TYPE_VERIFIED))

    api(getState).get(`/api/v1/suggestions?type=${SUGGESTION_TYPE_VERIFIED}`).then(response => {
      dispatch(importFetchedAccounts(response.data))
      dispatch(fetchSuggestionsSuccess(response.data, SUGGESTION_TYPE_VERIFIED))
    }).catch(error => dispatch(fetchSuggestionsFail(error, SUGGESTION_TYPE_VERIFIED)))
  }
}

export function fetchRelatedSuggestions() {
  return (dispatch, getState) => {
    if (!me) return false

    dispatch(fetchSuggestionsRequest(SUGGESTION_TYPE_RELATED))

    api(getState).get(`/api/v1/suggestions?type=${SUGGESTION_TYPE_RELATED}`).then(response => {
      dispatch(importFetchedAccounts(response.data))
      dispatch(fetchSuggestionsSuccess(response.data, SUGGESTION_TYPE_RELATED))
    }).catch(error => dispatch(fetchSuggestionsFail(error, SUGGESTION_TYPE_RELATED)))
  }
}

export function fetchSuggestionsRequest(suggestionType) {
  return {
    type: SUGGESTIONS_FETCH_REQUEST,
    skipLoading: true,
    suggestionType,
  }
}

export function fetchSuggestionsSuccess(accounts, suggestionType) {
  return {
    type: SUGGESTIONS_FETCH_SUCCESS,
    skipLoading: true,
    accounts,
    suggestionType
  }
}

export function fetchSuggestionsFail(error, suggestionType) {
  return {
    type: SUGGESTIONS_FETCH_FAIL,
    skipLoading: true,
    skipAlert: true,
    error,
    suggestionType,
  }
}

export const dismissRelatedSuggestion = (accountId) => (dispatch, getState) => {
  if (!me) return

  dispatch({
    type: SUGGESTIONS_DISMISS,
    id: accountId,
  })

  api(getState).delete(`/api/v1/suggestions/related/${accountId}`)
}