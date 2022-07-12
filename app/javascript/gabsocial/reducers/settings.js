import { SETTING_CHANGE, SETTING_SAVE } from '../actions/settings'
import { STORE_HYDRATE } from '../actions/store'
import { EMOJI_USE } from '../actions/emojis'
import { LIST_DELETE_SUCCESS, LIST_FETCH_FAIL } from '../actions/lists'
import { COMMENT_SORTING_TYPE_OLDEST } from '../constants'
import { Map as ImmutableMap, fromJS } from 'immutable'
import uuid from '../utils/uuid'

const initialState = ImmutableMap({
  saved: true,
  shownOnboarding: false,
  skinTone: 1,
  commentSorting: COMMENT_SORTING_TYPE_OLDEST,

  displayOptions: ImmutableMap({
    fontSize: 'normal',
    radiusSmallDisabled: false,
    radiusCircleDisabled: false,
    theme: 'light',
  }),

  home: ImmutableMap({
    shows: ImmutableMap({
      reply: true,
      repost: true,
    }),
  }),

  community: ImmutableMap({
    shows: ImmutableMap({
      onlyMedia: false,
    }),
  }),
});

const defaultColumns = fromJS([
  { id: 'COMPOSE', uuid: uuid(), params: {} },
  { id: 'HOME', uuid: uuid(), params: {} },
  { id: 'NOTIFICATIONS', uuid: uuid(), params: {} },
]);

const hydrate = (state, settings) => state.mergeDeep(settings).update('columns', (val = defaultColumns) => val);

const updateFrequentEmojis = (state, emoji) => state.update('frequentlyUsedEmojis', ImmutableMap(), map => map.update(emoji.id, 0, count => count + 1)).set('saved', false);

const filterDeadListColumns = (state, listId) => state.update('columns', columns => columns.filterNot(column => column.get('id') === 'LIST' && column.get('params').get('id') === listId));

export default function settings(state = initialState, action) {
  switch(action.type) {
  case STORE_HYDRATE:
    return hydrate(state, action.state.get('settings'));
  case SETTING_CHANGE:
    return state
      .setIn(action.path, action.value)
      .set('saved', false);
  case EMOJI_USE:
    return updateFrequentEmojis(state, action.emoji);
  case SETTING_SAVE:
    return state.set('saved', true);
  case LIST_FETCH_FAIL:
    return action.error.response.status === 404 ? filterDeadListColumns(state, action.id) : state;
  case LIST_DELETE_SUCCESS:
    return filterDeadListColumns(state, action.id);
  default:
    return state;
  }
};
