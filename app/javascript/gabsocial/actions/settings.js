import api from '../api'
import debounce from 'lodash.debounce'
import { me } from '../initial_state'

export const SETTING_CHANGE = 'SETTING_CHANGE'
export const SETTING_SAVE   = 'SETTING_SAVE'

export function changeSetting(path, value) {
  return dispatch => {
    dispatch({
      type: SETTING_CHANGE,
      path,
      value,
    })

    dispatch(saveSettings())
  }
}

const debouncedSave = debounce((dispatch, getState) => {
  if (!me) return

  if (getState().getIn(['settings', 'saved'])) return

  const data = getState().get('settings').filter((_, path) => path !== 'saved').toJS()

  api().put('/api/web/settings', { data })
    .then(() => dispatch({ type: SETTING_SAVE }))
    .catch(() => { /* */ })
}, 50, { trailing: true })

export function saveSettings() {
  return (dispatch, getState) => debouncedSave(dispatch, getState)
}
