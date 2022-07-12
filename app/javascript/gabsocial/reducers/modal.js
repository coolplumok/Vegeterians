import Immutable from 'immutable'
import {
  MODAL_OPEN,
  MODAL_CLOSE,
} from '../actions/modal'

const initialState = Immutable.Map({
  modalType: null,
  modalProps: null,
})

export default function modal(state = initialState, action) {
  switch(action.type) {
  case MODAL_OPEN:
    return state.withMutations(map => {
      map.set('modalType', action.modalType)
      map.set('modalProps', action.modalProps)
    })
  case MODAL_CLOSE:
    return initialState
  default:
    return state
  }
}
