import {
  HASHTAGS_FETCH_REQUEST,
  HASHTAGS_FETCH_SUCCESS,
  HASHTAGS_FETCH_FAIL,
} from '../actions/hashtags';
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

const initialState = ImmutableMap({
  items: ImmutableList(),
  isLoading: false,
});

export default function hashtagsReducer(state = initialState, action) {
  switch(action.type) {
    case HASHTAGS_FETCH_REQUEST:
      return state.set('isLoading', true);
    case HASHTAGS_FETCH_SUCCESS:
      return state.withMutations(map => {
        map.set('items', fromJS(action.tags.map((x => x))))
        map.set('isLoading', false);
      });
    case HASHTAGS_FETCH_FAIL:
      return state.set('isLoading', false);
    default:
      return state;
  }
};
