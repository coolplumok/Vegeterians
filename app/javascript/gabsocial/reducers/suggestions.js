import {
  SUGGESTIONS_FETCH_REQUEST,
  SUGGESTIONS_FETCH_SUCCESS,
  SUGGESTIONS_FETCH_FAIL,
  SUGGESTIONS_DISMISS,
} from '../actions/suggestions'
import {
  Map as ImmutableMap,
  List as ImmutableList,
  fromJS,
} from 'immutable'

const initialState = ImmutableMap({
  related: ImmutableMap({
    items: ImmutableList(),
    isLoading: false,
  }),
  verified: ImmutableMap({
    items: ImmutableList(),
    isLoading: false,
  }),
})

export default function suggestionsReducer(state = initialState, action) {
  switch(action.type) {
  case SUGGESTIONS_FETCH_REQUEST:
    return state.setIn([action.suggestionType, 'isLoading'], true)
  case SUGGESTIONS_FETCH_SUCCESS:
    return state.withMutations((map) => {
      map.setIn([action.suggestionType, 'items'], fromJS(action.accounts.map(x => x.id)))
      map.setIn([action.suggestionType, 'isLoading'], false)
    })
  case SUGGESTIONS_FETCH_FAIL:
    return state.setIn([action.suggestionType, 'isLoading'], false)
  case SUGGESTIONS_DISMISS:
    return state.updateIn([action.suggestionType, 'items'], list => list.filterNot(id => id === action.id))
  default:
    return state
  }
}
