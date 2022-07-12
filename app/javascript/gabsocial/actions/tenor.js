import api from '../api';
import { me } from '../initial_state'

export const GIFS_CLEAR_RESULTS = 'GIFS_CLEAR_RESULTS'
export const GIF_SET_SELECTED = 'GIF_SET_SELECTED'
export const GIF_CHANGE_SEARCH_TEXT = 'GIF_CHANGE_SEARCH_TEXT'
export const GIF_CLEAR_SELECTED = 'GIF_CLEAR_SELECTED'

export const GIF_RESULTS_FETCH_REQUEST = 'GIF_RESULTS_FETCH_REQUEST'
export const GIF_RESULTS_FETCH_SUCCESS = 'GIF_RESULTS_FETCH_SUCCESS'
export const GIF_RESULTS_FETCH_FAIL = 'GIF_RESULTS_FETCH_FAIL'

export const GIF_CATEGORIES_FETCH_REQUEST = 'GIF_CATEGORIES_FETCH_REQUEST'
export const GIF_CATEGORIES_FETCH_SUCCESS = 'GIF_CATEGORIES_FETCH_SUCCESS'
export const GIF_CATEGORIES_FETCH_FAIL = 'GIF_CATEGORIES_FETCH_FAIL'

// : todo :

export const fetchGifCategories = () => {
  return function (dispatch, getState) {
    if (!me) return

    dispatch(fetchGifCategoriesRequest())

    api(getState).get('/api/v1/gifs/categories').then(response => {
      dispatch(fetchGifCategoriesSuccess(response.data.tags))
    }).catch(function (error) {
      dispatch(fetchGifCategoriesFail(error))
    })
  }
}

export const fetchGifResults = (expand) => {
  return function (dispatch, getState) {
    if (!me) return

    dispatch(fetchGifResultsRequest())

    const search = getState().getIn(['tenor', 'searchText'], '');
    const pos = 0 //expand ? getState().getIn(['tenor', 'results'], []).length

    api(getState).get('/api/v1/gifs/search', { search, pos }).then((response) => {
      dispatch(fetchGifResultsSuccess(response.data))
    }).catch(function (error) {
      dispatch(fetchGifResultsFail(error))
    })
  }
}


export const clearGifResults = () => ({
  type: GIFS_CLEAR_RESULTS,
})

export const clearSelectedGif = () => ({
  type: GIF_CLEAR_SELECTED,
  result,
})

export const setSelectedGif = (result) => ({
  type: GIF_SET_SELECTED,
  result,
})

export function changeGifSearchText(text) {
  return {
    type: GIF_CHANGE_SEARCH_TEXT,
    text,
  }
}

function fetchGifResultsRequest() {
  return {
    type: GIF_RESULTS_FETCH_REQUEST,
  }
}

function fetchGifResultsSuccess(data) {
  return {
    type: GIF_RESULTS_FETCH_SUCCESS,
    data,
  }
}

function fetchGifResultsFail(error) {
  return {
    type: GIF_RESULTS_FETCH_FAIL,
    error,
  }
}

function fetchGifCategoriesRequest() {
  return {
    type: GIF_CATEGORIES_FETCH_REQUEST,
  }
}

function fetchGifCategoriesSuccess(categories) {
  return {
    type: GIF_CATEGORIES_FETCH_SUCCESS,
    categories,
  }
}

function fetchGifCategoriesFail(error) {
  return {
    type: GIF_CATEGORIES_FETCH_FAIL,
    error,
  }
}
