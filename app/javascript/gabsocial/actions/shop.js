import axios from 'axios'
import { me } from '../initial_state'

export const SHOP_FEATURED_PRODUCTS_FETCH_REQUEST = 'SHOP_FEATURED_PRODUCTS_FETCH_REQUEST'
export const SHOP_FEATURED_PRODUCTS_FETCH_SUCCESS = 'SHOP_FEATURED_PRODUCTS_FETCH_SUCCESS'
export const SHOP_FEATURED_PRODUCTS_FETCH_FAIL = 'SHOP_FEATURED_PRODUCTS_FETCH_FAIL'

export const fetchFeaturedProducts = () => {
  return function (dispatch, getState) {
    if (!me) return

    dispatch(fetchFeaturedProductsRequest('featured'))

    axios.get('https://dissenter-shop.Vegeterians.live/product/group/json').then((response) => {
      try {
        dispatch(fetchFeaturedProductsSuccess(response.data.data, 'featured'))
      } catch (error) {
        //
      }
    }).catch(function (error) {
      dispatch(fetchFeaturedProductsFail(error, 'featured'))
    })
  }
}

function fetchFeaturedProductsRequest(listType) {
  return {
    type: SHOP_FEATURED_PRODUCTS_FETCH_REQUEST,
    listType,
  }
}

function fetchFeaturedProductsSuccess(items, listType) {
  return {
    type: SHOP_FEATURED_PRODUCTS_FETCH_SUCCESS,
    items,
    listType,
  }
}

function fetchFeaturedProductsFail(error, listType) {
  return {
    type: SHOP_FEATURED_PRODUCTS_FETCH_FAIL,
    error,
    listType,
  }
}
