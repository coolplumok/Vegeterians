import { me } from '../initial_state'
import api from '../api'

export const SHORTCUTS_FETCH_REQUEST = 'SHORTCUTS_FETCH_REQUEST'
export const SHORTCUTS_FETCH_SUCCESS = 'SHORTCUTS_FETCH_SUCCESS'
export const SHORTCUTS_FETCH_FAIL    = 'SHORTCUTS_FETCH_FAIL'

export const SHORTCUTS_ADD_REQUEST = 'SHORTCUTS_ADD_REQUEST'
export const SHORTCUTS_ADD_SUCCESS = 'SHORTCUTS_ADD_SUCCESS'
export const SHORTCUTS_ADD_FAIL    = 'SHORTCUTS_ADD_FAIL'

export const SHORTCUTS_REMOVE_REQUEST = 'SHORTCUTS_REMOVE_REQUEST'
export const SHORTCUTS_REMOVE_SUCCESS = 'SHORTCUTS_REMOVE_SUCCESS'
export const SHORTCUTS_REMOVE_FAIL    = 'SHORTCUTS_REMOVE_FAIL'

export function fetchShortcuts() {
  return (dispatch, getState) => {
    if (!me) return

    dispatch(fetchShortcutsRequest())

    api(getState).get('/api/v1/shortcuts').then(response => {
      dispatch(fetchShortcutsSuccess(response.data))
    }).catch(error => dispatch(fetchShortcutsFail(error)))
  }
}

export function fetchShortcutsRequest() {
  return {
    type: SHORTCUTS_FETCH_REQUEST,
  }
}

export function fetchShortcutsSuccess(shortcuts) {
  return {
    shortcuts,
    type: SHORTCUTS_FETCH_SUCCESS,
  }
}

export function fetchShortcutsFail(error) {
  return {
    error,
    type: SHORTCUTS_FETCH_FAIL,
  }
}

export function addShortcut(shortcutType, shortcutId) {
  return (dispatch, getState) => {
    if (!me) return

    dispatch(addShortcutsRequest())

    api(getState).post('/api/v1/shortcuts', {
      shortcut_type: shortcutType,
      shortcut_id: shortcutId,
    }).then(response => {
      dispatch(addShortcutsSuccess(response.data))
    }).catch(error => dispatch(addShortcutsFail(error)))
  }
}

export function addShortcutsRequest() {
  return {
    type: SHORTCUTS_ADD_REQUEST,
  }
}

export function addShortcutsSuccess(shortcut) {
  return {
    shortcut,
    type: SHORTCUTS_ADD_SUCCESS,
  }
}

export function addShortcutsFail(error) {
  return {
    error,
    type: SHORTCUTS_ADD_FAIL,
  }
}

export function removeShortcut(shortcutObjectId, shortcutType, shortcutId) {
  return (dispatch, getState) => {
    if (!me) return
    
    let id
    if (shortcutObjectId) {
      id = shortcutObjectId
    } else if (shortcutType && shortcutId) {
      const shortcuts = getState().getIn(['shortcuts', 'items'])
      const shortcut = shortcuts.find((s) => {
        return s.get('shortcut_id') == shortcutId && s.get('shortcut_type') === shortcutType
      })
      if (!!shortcut) {
        id = shortcut.get('id')
      }
    }

    if (!id) return

    dispatch(removeShortcutsRequest())

    api(getState).delete(`/api/v1/shortcuts/${id}`).then(response => {
      dispatch(removeShortcutsSuccess(response.data.id))
    }).catch(error => dispatch(removeShortcutsFail(error)))
  }
}

export function removeShortcutsRequest() {
  return {
    type: SHORTCUTS_REMOVE_REQUEST,
  }
}

export function removeShortcutsSuccess(shortcutId) {
  return {
    shortcutId,
    type: SHORTCUTS_REMOVE_SUCCESS,
  }
}

export function removeShortcutsFail(error) {
  return {
    error,
    type: SHORTCUTS_REMOVE_FAIL,
  }
}
