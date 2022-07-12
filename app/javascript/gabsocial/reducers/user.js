import {
  SAVE_USER_PROFILE_INFORMATION_FETCH_REQUEST,
  SAVE_USER_PROFILE_INFORMATION_FETCH_SUCCESS,
  SAVE_USER_PROFILE_INFORMATION_FETCH_FAIL,
} from '../actions/user'
import { Map as ImmutableMap } from 'immutable'

const initialState = ImmutableMap({
  isLoading: false,
  isError: false,
})

export default function (state = initialState, action) {
  switch (action.type) {
    case SAVE_USER_PROFILE_INFORMATION_FETCH_REQUEST:
      return state.set('isLoading', true)
    case SAVE_USER_PROFILE_INFORMATION_FETCH_SUCCESS:
      return state
    case SAVE_USER_PROFILE_INFORMATION_FETCH_FAIL:
      return state.set('isError', true)
    default:
      return state
  }
}