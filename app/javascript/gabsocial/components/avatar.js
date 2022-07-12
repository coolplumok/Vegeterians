import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import debounce from 'lodash.debounce'
import { autoPlayGif } from '../initial_state'
import { openPopover, closePopover } from '../actions/popover'
import Image from './image'

const mapDispatchToProps = (dispatch) => ({
  openUserInfoPopover(props) {
    dispatch(openPopover('USER_INFO', props))
  },
  closeUserInfoPopover() {
    dispatch(closePopover('USER_INFO'))
  }
})

/**
 * Renders an avatar component
 * @param {map} [props.account] - the account for image
 * @param {number} [props.size=40] - the size of the avatar
 */
export default
@connect(null, mapDispatchToProps)
class Avatar extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    noHover: PropTypes.bool,
    openUserInfoPopover: PropTypes.func.isRequired,
    size: PropTypes.number,
  }

  static defaultProps = {
    size: 40,
  }

  state = {
    hovering: false,
    sameImg: !this.props.account ? false : this.props.account.get('avatar') === this.props.account.get('avatar_static'),
  }

  updateOnProps = [
    'account',
    'noHover',
    'size',
  ]

  mouseOverTimeout = null

  componentDidUpdate (prevProps) {
    if (prevProps.account !== this.props.account) {
      this.setState({
        sameImg: !this.props.account ? false : this.props.account.get('avatar') === this.props.account.get('avatar_static'),
      })
    }
  }

  componentWillUnmount () {
    document.removeEventListener('mousemove', this.handleMouseMove, true)
    clearTimeout(this.mouseOverTimeout)
  }

  handleMouseEnter = () => {
    this.setState({ hovering: true })

    if (this.mouseOverTimeout || this.props.noHover) return null

    this.mouseOverTimeout = setTimeout(() => {
      this.props.openUserInfoPopover({
        targetRef: this.node,
        position: 'top',
        accountId: this.props.account.get('id'),
      })
      document.addEventListener('mousemove', this.handleMouseMove, true)
    }, 1250)
  }

  handleMouseLeave = debounce((e) => {
    this.setState({ hovering: false })
    this.attemptToHidePopover(e)
  }, 250)

  handleMouseMove = debounce((e) => {
    this.attemptToHidePopover(e)
  }, 100)

  attemptToHidePopover = (e) => {
    const lastTarget = e.toElement || e.relatedTarget
    const isElement = (lastTarget instanceof Element || lastTarget instanceof HTMLDocument)
    const userInfoPopoverEl = document.getElementById('user-info-popover')

    if (this.mouseOverTimeout &&
        !this.props.noHover &&
      (
        !isElement && !userInfoPopoverEl ||
        (userInfoPopoverEl && isElement && lastTarget && !userInfoPopoverEl.contains(lastTarget)) ||
        (!userInfoPopoverEl && isElement && lastTarget && this.node && !this.node.contains(lastTarget))
      )) {
      document.removeEventListener('mousemove', this.handleMouseMove, true)
      clearTimeout(this.mouseOverTimeout)
      this.mouseOverTimeout = null
      this.props.closeUserInfoPopover()
    }
  }

  setRef = (n) => {
    this.node = n
  }

  render() {
    const { account, size } = this.props
    const { hovering, sameImg } = this.state

    const isPro     = !!account ? account.get('is_pro') : false
    const isProPlus = !!account ? account.get('is_proplus') : false
    const alt = !account ? '' : `${account.get('display_name')} ${isPro ? '(PRO)' : ''}`.trim()
    const classes = [_s.default, _s.circle, _s.overflowHidden]
    if (isPro) {
      classes.push(_s.boxShadowAvatarPro)
    }

    if (isProPlus) {
      classes.push(_s.boxShadowAvatarProPlus)
    }

    const options = {
      onMouseEnter: this.handleMouseEnter,
      onMouseLeave: this.handleMouseLeave,
      src: !account ? undefined : account.get(((hovering || autoPlayGif) && !sameImg) ? 'avatar' : 'avatar_static'),
      alt: !account ? undefined : account.get('display_name'),
      style: {
        width: `${size}px`,
        height: `${size}px`,
      },
    }

    return (
      <Image
        alt={alt}
        imageRef={this.setRef}
        className={classes.join(' ')}
        {...options}
      />
    )
  }

}
