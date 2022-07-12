import api from '../api'

export const STATUS_REVISIONS_LOAD = 'STATUS_REVISIONS_LOAD'
export const STATUS_REVISIONS_LOAD_SUCCESS = 'STATUS_REVISIONS_SUCCESS'
export const STATUS_REVISIONS_LOAD_FAIL = 'STATUS_REVISIONS_FAIL'

const loadStatusRevisionsSuccess = (data) => ({
  type: STATUS_REVISIONS_LOAD_SUCCESS,
  revisions: data,
})

const loadStatusRevisionsFail = () => ({
  type: STATUS_REVISIONS_LOAD_FAIL,
  error: true,
})

export function loadStatusRevisions(statusId) {
  return (dispatch, getState) => {
    api(getState).get(`/api/v1/statuses/${statusId}/revisions`)
      .then(res => dispatch(loadStatusRevisionsSuccess(res.data)))
      .catch(() => dispatch(loadStatusRevisionsFail()))
  }
}