import { Map as ImmutableMap, List as ImmutableList } from 'immutable'
import {
  GROUPS_FETCH_REQUEST,
  GROUPS_FETCH_SUCCESS,
  GROUPS_FETCH_FAIL,
  GROUP_SORT,
} from '../actions/groups'

const tabs = ['all', 'new', 'featured', 'privated', 'member', 'admin', 'onboarding']

const initialState = ImmutableMap({
  all: ImmutableMap({
    isFetched: false,
    isLoading: false,
    items: ImmutableList(),
  }),
  new: ImmutableMap({
    isFetched: false,
    isLoading: false,
    items: ImmutableList(),
  }),
  featured: ImmutableMap({
    isFetched: false,
    isLoading: false,
    items: ImmutableList(),
  }),
  privated: ImmutableMap({
    isFetched: false,
    isLoading: false,
    items: ImmutableList(),
  }),
  member: ImmutableMap({
    isFetched: false,
    isLoading: false,
    items: ImmutableList(),
  }),
  admin: ImmutableMap({
    isFetched: false,
    isLoading: false,
    items: ImmutableList(),
  }),
  onboarding: ImmutableMap({
    isFetched: false,
    isLoading: false,
    items: ImmutableList(),
  }),
})

export default function groupLists(state = initialState, action) {
  if (tabs.indexOf(action.tab) === -1) return state
  
  switch(action.type) {
    case GROUPS_FETCH_REQUEST:
      return state.withMutations((mutable) => {
        mutable.setIn([action.tab, 'isLoading'], true)
      });
    case GROUPS_FETCH_SUCCESS:
      return state.withMutations((mutable) => {
        let list = ImmutableList(action.groups.map(item => item.id))
        if (action.tab === 'featured') list = list.sortBy(Math.random)
        mutable.setIn([action.tab, 'items'], list)
        mutable.setIn([action.tab, 'isLoading'], false)
        mutable.setIn([action.tab, 'isFetched'], true)
      })
    case GROUPS_FETCH_FAIL:
      return state.withMutations((mutable) => {
        mutable.setIn([action.tab, 'items'], ImmutableList())
        mutable.setIn([action.tab, 'isLoading'], false)
        mutable.setIn([action.tab, 'isFetched'], true)
      })
    case GROUP_SORT:
      return state.withMutations((mutable) => {
        mutable.setIn([action.tab, 'items'], ImmutableList(action.groupIds))
      })
    default:
      return state
  }
}
