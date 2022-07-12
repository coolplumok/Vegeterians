import {
  SHORTCUTS_FETCH_REQUEST,
  SHORTCUTS_FETCH_SUCCESS,
  SHORTCUTS_FETCH_FAIL,
  SHORTCUTS_ADD_SUCCESS,
  SHORTCUTS_REMOVE_SUCCESS,
} from '../actions/shortcuts'
import { importFetchedAccount } from '../actions/importer'
import { importGroup } from '../actions/groups'
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable'

const initialState = ImmutableMap({
  items: ImmutableList(),
  isLoading: false,
  isError: false,
})

const normalizeShortcut = (shortcut) => {
  if (shortcut.shortcut_type === 'account') {
    importFetchedAccount(shortcut.shortcut)
    return {
      id: shortcut.id,
      shortcut_type: 'account',
      shortcut_id: shortcut.shortcut_id,
      title: shortcut.shortcut.acct,
      image: shortcut.shortcut.avatar_static,
      to: `/${shortcut.shortcut.acct}`,
    }
  } else if (shortcut.shortcut_type === 'group') {
    importGroup(shortcut.shortcut)
    return {
      id: shortcut.id,
      shortcut_type: 'group',
      shortcut_id: shortcut.shortcut_id,
      title: shortcut.shortcut.title,
      image: shortcut.shortcut.cover_image_url,
      to: `/groups/${shortcut.shortcut.id}`,
    }
  }
}

const normalizeShortcuts = (shortcuts) => {
  return fromJS(shortcuts.map((shortcut) => {
    return normalizeShortcut(shortcut)
  }))
}

export default function shortcutsReducer(state = initialState, action) {
  switch(action.type) {
    case SHORTCUTS_FETCH_REQUEST:
      return state.withMutations((map) => {
        map.set('isLoading', true)
        map.set('isError', false)
      })
    case SHORTCUTS_FETCH_SUCCESS:
      return state.withMutations((map) => {
        map.set('items', normalizeShortcuts(action.shortcuts))
        map.set('isLoading', false)
        map.set('isError', false)
      })
    case SHORTCUTS_FETCH_FAIL:
      return state.withMutations((map) => {
        map.set('isLoading', false)
        map.set('isError', true)
      })
    case SHORTCUTS_ADD_SUCCESS:
      return state.update('items', list => list.push(fromJS(normalizeShortcut(action.shortcut))))
    case SHORTCUTS_REMOVE_SUCCESS:
      return state.update('items', list => list.filterNot((item) => {
        return `${item.get('id')}` === `${action.shortcutId}`
      }))
    default:
      return state
  }
}
