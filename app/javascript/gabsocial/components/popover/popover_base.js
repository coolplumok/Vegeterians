import detectPassiveEvents from 'detect-passive-events'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { Popper } from 'react-popper'
import { CX } from '../../constants'

const listenerOptions = detectPassiveEvents.hasSupport ? { passive: true } : false

const mapStateToProps = (state) => ({
  isModalOpen: !!state.getIn(['modal', 'modalType']),
  popoverPlacement: state.getIn(['popover', 'placement']),
})

export default
@connect(mapStateToProps)
class PopoverBase extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    title: PropTypes.string,
    disabled: PropTypes.bool,
    status: ImmutablePropTypes.map,
    isUserTouching: PropTypes.func,
    isModalOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    position: PropTypes.string,
    visible: PropTypes.bool,
    targetRef: PropTypes.node,
    innerRef: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.func,
    ]),
  }

  static defaultProps = {
    title: 'Menu',
    position: 'bottom',
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick, false)
    document.addEventListener('keydown', this.handleKeyDown, false)
    document.addEventListener('touchend', this.handleDocumentClick, listenerOptions)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, false)
    document.removeEventListener('keydown', this.handleKeyDown, false)
    document.removeEventListener('touchend', this.handleDocumentClick, listenerOptions)
  }

  handleDocumentClick = (e) => {
    const { targetRef, visible, onClose } = this.props
    
    const containsTargetRef = !targetRef ? false : targetRef.contains(e.target)

    if (this.node &&  !this.node.contains(e.target) && !containsTargetRef && visible) {
      onClose()
    }
  }

  handleKeyDown = (e) => {
    const items = Array.from(this.node.getElementsByTagName('a'))
    const index = items.indexOf(document.activeElement)
    let element

    switch (e.key) {
    case 'ArrowDown':
      element = items[index + 1]
      if (element) element.focus()
      break
    case 'ArrowUp':
      element = items[index - 1]
      if (element) element.focus()
      break
    case 'Home':
      element = items[0]
      if (element) element.focus()
      break
    case 'End':
      element = items[items.length - 1]
      if (element) element.focus()
      break
    case 'Escape':
      this.handleClose()
      break
    }
  }

  handleItemClick = (e) => {
    const i = Number(e.currentTarget.getAttribute('data-index'))
    const { action, to } = this.props.items[i]

    this.handleClose()

    if (typeof action === 'function') {
      e.preventDefault()
      action()
    } else if (to) {
      e.preventDefault()
      this.context.router.history.push(to)
    }
  }

  handleClose = () => {
    this.props.onClose()
  }

  setRef = (n) => {
    try {
      this.node = n
      this.props.innerRef = n
    } catch (error) {
      //
    }
  }

  render() {
    const {
      children,
      visible,
      position,
      targetRef,
    } = this.props

    const containerClasses = CX({
      default: 1,
      z4: 1,
      boxShadowPopover: visible,
      displayNone: !visible,
    })

    return (
      <Popper
        placement={position}
        referenceElement={targetRef}
      >
        {({ ref, style, placement, arrowProps }) => (
          <div ref={ref} style={style} data-placement={placement} className={[_s.z4, _s.mt5, _s.mb5, _s.px5, _s.py5].join(' ')}>
            <div ref={arrowProps.ref} style={arrowProps.style} />
            <div ref={this.setRef} data-popover='true' onKeyDown={this.handleKeyDown} className={containerClasses}>
              {children}
            </div>
          </div>
        )}
      </Popper>
    )
  }

}
