import api, { getLinks } from '../api'
import { importFetchedStatuses } from './importer'
import { me } from '../initial_state'

export const FAVORITED_STATUSES_FETCH_REQUEST = 'FAVORITED_STATUSES_FETCH_REQUEST'
export const FAVORITED_STATUSES_FETCH_SUCCESS = 'FAVORITED_STATUSES_FETCH_SUCCESS'
export const FAVORITED_STATUSES_FETCH_FAIL = 'FAVORITED_STATUSES_FETCH_FAIL'

export const FAVORITED_STATUSES_EXPAND_REQUEST = 'FAVORITED_STATUSES_EXPAND_REQUEST'
export const FAVORITED_STATUSES_EXPAND_SUCCESS = 'FAVORITED_STATUSES_EXPAND_SUCCESS'
export const FAVORITED_STATUSES_EXPAND_FAIL = 'FAVORITED_STATUSES_EXPAND_FAIL'

export function fetchFavoritedStatuses() {
  return (dispatch, getState) => {
    if (!me) return

    if (getState().getIn(['status_lists', 'favorites', 'isLoading'])) {
      return
    }

    dispatch(fetchFavoritedStatusesRequest())

    api(getState).get('/api/v1/favourites').then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next')
      dispatch(importFetchedStatuses(response.data))
      dispatch(fetchFavoritedStatusesSuccess(response.data, next ? next.uri : null))
    }).catch(error => {
      dispatch(fetchFavoritedStatusesFail(error))
    })
  }
}

export function fetchFavoritedStatusesRequest() {
  return {
    type: FAVORITED_STATUSES_FETCH_REQUEST,
    skipLoading: true,
  }
}

export function fetchFavoritedStatusesSuccess(statuses, next) {
  return {
    type: FAVORITED_STATUSES_FETCH_SUCCESS,
    statuses,
    next,
    skipLoading: true,
  }
}

export function fetchFavoritedStatusesFail(error) {
  return {
    type: FAVORITED_STATUSES_FETCH_FAIL,
    error,
    skipLoading: true,
  }
}

export function expandFavoritedStatuses() {
  return (dispatch, getState) => {
    if (!me) return

    const url = getState().getIn(['status_lists', 'favorites', 'next'], null)

    if (url === null || getState().getIn(['status_lists', 'favorites', 'isLoading'])) {
      return
    }

    dispatch(expandFavoritedStatusesRequest())

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next')
      dispatch(importFetchedStatuses(response.data))
      dispatch(expandFavoritedStatusesSuccess(response.data, next ? next.uri : null))
    }).catch(error => {
      dispatch(expandFavoritedStatusesFail(error))
    })
  }
}

export function expandFavoritedStatusesRequest() {
  return {
    type: FAVORITED_STATUSES_EXPAND_REQUEST,
  }
}

export function expandFavoritedStatusesSuccess(statuses, next) {
  return {
    type: FAVORITED_STATUSES_EXPAND_SUCCESS,
    statuses,
    next,
  }
}

export function expandFavoritedStatusesFail(error) {
  return {
    type: FAVORITED_STATUSES_EXPAND_FAIL,
    error,
  }
}
