import Immutable from 'immutable';

import {
  MUTES_INIT_MODAL,
} from '../actions/mutes';

const initialState = Immutable.Map({
  new: Immutable.Map({
    isSubmitting: false,
    account: null,
    notifications: true,
  }),
});

export default function mutes(state = initialState, action) {
  switch (action.type) {
  case MUTES_INIT_MODAL:
    return state.withMutations((state) => {
      state.setIn(['new', 'isSubmitting'], false);
      state.setIn(['new', 'account'], action.account);
      state.setIn(['new', 'notifications'], true);
    });
  default:
    return state;
  }
}
