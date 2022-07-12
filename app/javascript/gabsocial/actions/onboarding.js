import { changeSetting, saveSettings } from './settings'

export const saveShownOnboarding = () => (dispatch) => {
  dispatch(changeSetting(['shownOnboarding'], true))
  dispatch(saveSettings())
}