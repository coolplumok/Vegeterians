import {
  SIDEBAR_OPEN,
  SIDEBAR_CLOSE,
} from '../actions/sidebar'

const initialState = {
  open: false,
}

export default function sidebar(state = initialState, action) {
  switch(action.type) {
  case SIDEBAR_OPEN:
    return { open: true }
  case SIDEBAR_CLOSE:
    return { open: false }
  default:
    return state
  }
}
