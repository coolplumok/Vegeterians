export const POPOVER_OPEN = 'POPOVER_OPEN'
export const POPOVER_CLOSE = 'POPOVER_CLOSE'

export function openPopover(type, props) {
  return function (dispatch, getState) {
    const currentlyOpenPopover = getState().getIn(['popover', 'popoverType'])

    if (currentlyOpenPopover === type) {
      dispatch(closePopover(type))
    } else {
      dispatch(handleOpenPopover(type, props))
    }
  }
}

export function closePopover(type) {
  return {
    type: POPOVER_CLOSE,
    popoverType: type,
  }
}

const handleOpenPopover = (type, props) => {
  return {
    type: POPOVER_OPEN,
    popoverType: type,
    popoverProps: props,
  }
}