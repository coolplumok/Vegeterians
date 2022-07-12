import {
  GIFS_CLEAR_RESULTS,
  GIF_SET_SELECTED,
  GIF_CLEAR_SELECTED,
  GIF_CHANGE_SEARCH_TEXT,
  GIF_RESULTS_FETCH_REQUEST,
  GIF_RESULTS_FETCH_SUCCESS,
  GIF_RESULTS_FETCH_FAIL,
  GIF_CATEGORIES_FETCH_REQUEST,
  GIF_CATEGORIES_FETCH_SUCCESS,
  GIF_CATEGORIES_FETCH_FAIL,
} from '../actions/tenor'
import { Map as ImmutableMap } from 'immutable'

const initialState = ImmutableMap({
  categories: [],
  results: [],
  searchText: '',
  next: 0,
  loading: false,
  error: false,
  selectedGif: ImmutableMap({
    id: '',
    title: '',
    src: '',
  })
})

export default function (state = initialState, action) {
  switch (action.type) {
  case GIF_RESULTS_FETCH_REQUEST:
  case GIF_CATEGORIES_FETCH_REQUEST:
    return state.set('loading', true)
  case GIF_RESULTS_FETCH_SUCCESS:
    return state.withMutations(map => {
      map.set('results', action.data.results);
      map.set('next', action.data.next);
      map.set('error', false);
      map.set('loading', false);
    });
  case GIF_CATEGORIES_FETCH_SUCCESS:
    return state.withMutations(map => {
      map.set('categories', action.categories);
      map.set('error', false);
      map.set('loading', false);
    });
  case GIF_RESULTS_FETCH_FAIL:
  case GIF_CATEGORIES_FETCH_FAIL:
    return state.withMutations(map => {
      map.set('error', !!action.error);
      map.set('loading', false);
    });
  case GIFS_CLEAR_RESULTS:
    return state.set('results', [])
  case GIF_SET_SELECTED:
    return state.set('selectedGif', ImmutableMap({
      id: action.result.id,
      title: action.result.title,
      src: action.result.media[0].gif.url,
    }))
  case GIF_CLEAR_SELECTED:
    return state.set('selectedGif', ImmutableMap())
  case GIF_CHANGE_SEARCH_TEXT:
    return state.set('searchText', action.text.trim());
  default:
    return state
  }
}