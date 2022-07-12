'use strict'

import detectPassiveEvents from 'detect-passive-events'
import {
  BREAKPOINT_EXTRA_LARGE,
  BREAKPOINT_LARGE,
  BREAKPOINT_MEDIUM,
  BREAKPOINT_SMALL,
  BREAKPOINT_EXTRA_SMALL,
} from '../constants'

export function isMobile(width) {
  return width <= BREAKPOINT_EXTRA_SMALL
}

export function breakpointExtraLarge(width) {
  return width > BREAKPOINT_EXTRA_LARGE
}

export function breakpointLarge(width) {
  return width < BREAKPOINT_LARGE
}

export function breakpointMedium(width) {
  return width < BREAKPOINT_MEDIUM
}

export function breakpointSmall(width) {
  return width < BREAKPOINT_SMALL
}

export function breakpointExtraSmall(width) {
  return width < BREAKPOINT_EXTRA_SMALL
}

export const getWindowDimension = () => {
  const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

  return { width, height }
}

const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

let userTouching = false
const listenerOptions = detectPassiveEvents.hasSupport ? { passive: true } : false

function touchListener() {
  userTouching = true
  window.removeEventListener('touchstart', touchListener, listenerOptions)
}

window.addEventListener('touchstart', touchListener, listenerOptions)

export function isUserTouching() {
  return userTouching
}

export function isIOS() {
  return iOS
}
