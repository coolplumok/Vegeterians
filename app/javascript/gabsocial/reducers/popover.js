import Immutable from 'immutable'
import {
  POPOVER_OPEN,
  POPOVER_CLOSE,
} from '../actions/popover'

const initialState = Immutable.Map({
  popoverType: null,
  popoverProps: null,
})

export default function popoverMenu(state = initialState, action) {
  switch (action.type) {
  case POPOVER_OPEN:
    return state.withMutations(map => {
      map.set('popoverType', action.popoverType)
      map.set('popoverProps', action.popoverProps)
    })
  case POPOVER_CLOSE:
    return initialState
  default:
    return state
  }
}
