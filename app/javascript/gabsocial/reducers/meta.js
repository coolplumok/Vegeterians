'use strict';

import { STORE_HYDRATE } from '../actions/store';
import { Map as ImmutableMap } from 'immutable';

const initialState = ImmutableMap({
  streaming_api_base_url: null,
  access_token: null,
});

export default function meta(state = initialState, action) {
  switch(action.type) {
  case STORE_HYDRATE:
    return state.merge(action.state.get('meta'));
  default:
    return state;
  }
};
