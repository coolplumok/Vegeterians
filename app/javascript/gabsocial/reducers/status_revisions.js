import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable'
import {
  STATUS_REVISIONS_LOAD,
  STATUS_REVISIONS_LOAD_SUCCESS,
  STATUS_REVISIONS_LOAD_FAIL
} from '../actions/status_revisions'

const initialState = ImmutableMap({
  loading: false,
  error: null,
  revisions: ImmutableList(),
})

export default function statusRevisions(state = initialState, action) {
  switch (action.type) {
    case STATUS_REVISIONS_LOAD:
      return initialState
    case STATUS_REVISIONS_LOAD_SUCCESS:
      return state.withMutations(mutable => {
        mutable.set('loading', false)
        mutable.set('revisions', fromJS(action.revisions).reverse())
      })
    case STATUS_REVISIONS_LOAD_FAIL:
      return state.withMutations(mutable => {
        mutable.set('loading', false)
        mutable.set('error', action.error)
      })
    default:
      return state
  }
}
