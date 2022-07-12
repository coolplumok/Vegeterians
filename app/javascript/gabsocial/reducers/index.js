import { combineReducers } from 'redux-immutable'
import { loadingBarReducer } from 'react-redux-loading-bar'
import accounts from './accounts'
import accounts_counters from './accounts_counters'
import compose from './compose'
import contexts from './contexts'
import conversations from './conversations'
import custom_emojis from './custom_emojis'
import filters from './filters'
import gab_trends from './gab_trends'
import groups from './groups'
import group_editor from './group_editor'
import group_lists from './group_lists'
import group_relationships from './group_relationships'
import hashtags from './hashtags'
import height_cache from './height_cache'
import lists from './lists'
import listAdder from './list_adder'
import listEditor from './list_editor'
import media_attachments from './media_attachments'
import meta from './meta'
import modal from './modal'
import mutes from './mutes'
import notifications from './notifications'
import polls from './polls'
import popover from './popover'
import push_notifications from './push_notifications'
import relationships from './relationships'
import reports from './reports'
import search from './search'
import settings from './settings'
import shop from './shop'
import shortcuts from './shortcuts'
import sidebar from './sidebar'
import statuses from './statuses'
import status_lists from './status_lists'
import status_revisions from './status_revisions'
import suggestions from './suggestions'
import tenor from './tenor'
import timelines from './timelines'
import user from './user'
import user_lists from './user_lists'

const reducers = {
  accounts,
  accounts_counters,
  compose,
  contexts,
  conversations,
  custom_emojis,
  filters,
  gab_trends,
  groups,
  group_editor,
  group_lists,
  group_relationships,
  hashtags,
  height_cache,
  lists,
  listAdder,
  listEditor,
  loadingBar: loadingBarReducer,
  media_attachments,
  meta,
  modal,
  mutes,
  notifications,
  polls,
  popover,
  push_notifications,
  relationships,
  reports,
  search,
  settings,
  shop,
  shortcuts,
  sidebar,
  statuses,
  status_lists,
  status_revisions,
  suggestions,
  tenor,
  timelines,
  user,
  user_lists,
}

export default combineReducers(reducers)
