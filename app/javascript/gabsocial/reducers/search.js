import {
  SEARCH_CHANGE,
  SEARCH_CLEAR,
  SEARCH_FETCH_REQUEST,
  SEARCH_FETCH_FAIL,
  SEARCH_FETCH_SUCCESS,
  SEARCH_SHOW,
} from '../actions/search';
import {
  COMPOSE_MENTION,
  COMPOSE_REPLY,
} from '../actions/compose';
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

const initialState = ImmutableMap({
  value: '',
  submitted: false,
  hidden: false,
  isLoading: false,
  isError: false,
  results: ImmutableMap(),
});

export default function search(state = initialState, action) {
  switch(action.type) {
  case SEARCH_FETCH_REQUEST:
    return state.withMutations(map => {
      map.set('isError', false);
      map.set('isLoading', true);
    });
  case SEARCH_FETCH_FAIL:
    return state.withMutations(map => {
      map.set('isError', true);
      map.set('isLoading', false);
    });
  case SEARCH_CHANGE:
    return state.withMutations(map => {
      map.set('value', action.value);
      map.set('submitted', false);
    });
  case SEARCH_CLEAR:
    return state.withMutations(map => {
      map.set('value', '');
      map.set('results', ImmutableMap());
      map.set('submitted', false);
      map.set('hidden', false);
      map.set('isLoading', false);
      map.set('isError', false);
    });
  case SEARCH_SHOW:
    return state.set('hidden', false);
  case COMPOSE_REPLY:
  case COMPOSE_MENTION:
    return state.set('hidden', true);
  case SEARCH_FETCH_SUCCESS:
    return state.set('results', ImmutableMap({
      accounts: ImmutableList(action.results.accounts.map(item => item.id)),
      statuses: ImmutableList(action.results.statuses.map(item => item.id)),
      hashtags: fromJS(action.results.hashtags),
      groups: fromJS(action.results.groups),
    })).set('submitted', true).set('isLoading', false).set('isError', false);
  default:
    return state;
  }
};
