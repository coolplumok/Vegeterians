import { Fragment } from 'react'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl'
import { getWindowDimension } from '../../utils/is_mobile'
import { openModal } from '../../actions/modal'
import { cancelReplyCompose } from '../../actions/compose'
import {
  CX,
  BREAKPOINT_EXTRA_SMALL,
} from '../../constants'
import Responsive from '../../features/ui/util/responsive_component'

const initialState = getWindowDimension()

const messages = defineMessages({
  confirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
  delete: { id: 'confirmations.delete.message', defaultMessage: 'Are you sure you want to delete this status?' },
})

const mapStateToProps = (state) => ({
  composeId: state.getIn(['compose', 'id']),
  composeText: state.getIn(['compose', 'text']),
})

const mapDispatchToProps = (dispatch) => ({
  onOpenModal(type, opts) {
    dispatch(openModal(type, opts))
  },
  onCancelReplyCompose() {
    dispatch(cancelReplyCompose())
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class ModalBase extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
    onOpenModal: PropTypes.func.isRequired,
    onCancelReplyCompose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    composeId: PropTypes.string,
    composeText: PropTypes.string,
    type: PropTypes.string,
    isCenteredXS: PropTypes.bool,
  }

  state = {
    revealed: !!this.props.children,
    width: initialState.width,
  }

  activeElement = this.state.revealed ? document.activeElement : null

  handleKeyUp = (e) => {
    if ((e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) && !!this.props.children) {
      this.handleOnClose()
    }
  }

  handleOnClose = (e) => {
    const { onOpenModal, composeText, composeId, onClose, intl, type, onCancelReplyCompose } = this.props

    if (!!e && this.dialog !== e.target) return

    if (!composeId && composeText && type === 'COMPOSE') {
      onOpenModal('CONFIRM', {
        message: intl.formatMessage(messages.delete),
        confirm: intl.formatMessage(messages.confirm),
        onConfirm: () => onCancelReplyCompose(),
        onCancel: () => onOpenModal('COMPOSE'),
      })
    } else {
      onClose()
    }
  }

  componentDidMount() {
    this.handleResize()
    window.addEventListener('keyup', this.handleKeyUp, false)
    window.addEventListener('resize', this.handleResize, false)
  }

  componentWillReceiveProps(nextProps) {
    if (!!nextProps.children && !this.props.children) {
      this.activeElement = document.activeElement

      this.getSiblings().forEach(sibling => sibling.setAttribute('inert', true))
    } else if (!nextProps.children) {
      this.setState({ revealed: false })
    }

    if (!nextProps.children && !!this.props.children) {
      this.activeElement.focus()
      this.activeElement = null
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.children && !!prevProps.children) {
      this.getSiblings().forEach(sibling => sibling.removeAttribute('inert'))
    }

    if (this.props.children) {
      requestAnimationFrame(() => {
        this.setState({ revealed: true })
      })
    }
  }

  handleResize = () => {
    const { width } = getWindowDimension()

    this.setState({ width })
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyUp)
    window.removeEventListener('resize', this.handleResize, false)
  }

  getSiblings = () => {
    return Array(...this.node.parentElement.childNodes).filter(node => node !== this.node)
  }

  setRef = (n) => {
    this.node = n
  }

  setDialog = (n) => {
    this.dialog = n
  }

  render() {
    const { children, isCenteredXS } = this.props
    const { width } = this.state

    const isXS = width <= BREAKPOINT_EXTRA_SMALL
    const visible = !!children

    const containerClasses = CX({
      default: 1,
      z4: 1,
      height100PC: visible,
      width100PC: visible,
      displayNone: !visible,
    })

    const dialogClasses = CX({
      default: 1,
      posFixed: 1,
      alignItemsCenter: 1,
      justifyContentCenter: !isXS || isCenteredXS,
      justifyContentEnd: isXS && !isCenteredXS,
      z4: 1,
      width100PC: 1,
      height100PC: 1,
      top0: 1,
      rightAuto: 1,
      bottomAuto: 1,
      left0: 1,
    })

    return (
      <div ref={this.setRef} className={containerClasses}>
        {
          !!visible &&
          <Fragment>
            <div
              role='presentation'
              className={[_s.default, _s.bgBlackOpaque, _s.posFixed, _s.z3, _s.top0, _s.right0, _s.bottom0, _s.left0].join(' ')}
            />
            <div
              ref={this.setDialog}
              role='dialog'
              onClick={this.handleOnClose}
              className={dialogClasses}
            >
              {children}
            </div>
          </Fragment>
        }
      </div>
    )
  }

}