import {
  SHOP_FEATURED_PRODUCTS_FETCH_REQUEST,
  SHOP_FEATURED_PRODUCTS_FETCH_SUCCESS,
  SHOP_FEATURED_PRODUCTS_FETCH_FAIL,
} from '../actions/shop'
import {
  Map as ImmutableMap,
  List as ImmutableList,
  fromJS,
} from 'immutable'

const initialState = ImmutableMap({
  featured: ImmutableMap({
    items: ImmutableList(),
    isError: false,
    isLoading: false,
  }),
})

export default function suggestionsReducer(state = initialState, action) {
  switch(action.type) {
  case SHOP_FEATURED_PRODUCTS_FETCH_REQUEST:
    return state.withMutations((map) => {
      map.setIn([action.listType, 'isError'], false)
      map.setIn([action.listType, 'isLoading'], true)
    })
  case SHOP_FEATURED_PRODUCTS_FETCH_SUCCESS:
    return state.withMutations((map) => {
      map.setIn([action.listType, 'items'], action.items)
      map.setIn([action.listType, 'isError'], false)
      map.setIn([action.listType, 'isLoading'], false)
    })
  case SHOP_FEATURED_PRODUCTS_FETCH_FAIL:
    return state.withMutations((map) => {
      map.setIn([action.listType, 'isError'], true)
      map.setIn([action.listType, 'isLoading'], false)
    })
  default:
    return state
  }
}
