import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import debounce from 'lodash.debounce'
import { injectIntl, defineMessages } from 'react-intl';
import { me } from '../initial_state'
import {
  CX,
  POPOVER_USER_INFO,
} from '../constants'
import { openPopover, closePopover } from '../actions/popover'
import Icon from './icon'
import Text from './text'

const messages = defineMessages({
  admin: { id: 'display_name.admin', defaultMessage: 'Admin' },
  moderator:  { id: 'display_name.moderator', defaultMessage: 'Mod' },
  follows_you:  { id: 'display_name.follows_you', defaultMessage: 'Follows you' },
});

const mapDispatchToProps = (dispatch) => ({
  openUserInfoPopover(props) {
    dispatch(openPopover(POPOVER_USER_INFO, props))
  },
  closeUserInfoPopover() {
    dispatch(closePopover(POPOVER_USER_INFO))
  }
})

export default
@injectIntl
@connect(null, mapDispatchToProps)
class DisplayName extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map,
    openUserInfoPopover: PropTypes.func.isRequired,
    closeUserInfoPopover: PropTypes.func.isRequired,
    isLarge: PropTypes.bool,
    isMultiline: PropTypes.bool,
    isSmall: PropTypes.bool,
    noHover: PropTypes.bool,
    noRelationship: PropTypes.bool,
    noUsername: PropTypes.bool,
    isComment: PropTypes.bool,
    isCentered: PropTypes.bool,
    isAdmin: PropTypes.bool,
    isModerator: PropTypes.bool,
  }

  updateOnProps = [
    'account',
    'isMultiline',
    'isSmall',
    'isLarge',
    'noHover',
    'noRelationship',
    'noUsername',
    'isComment',
    'isCentered',
    'isAdmin',
    'isModerator',
  ]

  mouseOverTimeout = null

  componentWillUnmount () {
    document.removeEventListener('mousemove', this.handleMouseMove, true)
    clearTimeout(this.mouseOverTimeout)
  }

  handleMouseEnter = () => {
    if (this.mouseOverTimeout) return null
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
      (
        !isElement && !userInfoPopoverEl ||
        (userInfoPopoverEl && isElement && lastTarget && !userInfoPopoverEl.contains(lastTarget)) ||
        (!userInfoPopoverEl && isElement && lastTarget &&  this.node && !this.node.contains(lastTarget))
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
    const {
      intl,
      account,
      isMultiline,
      isLarge,
      noHover,
      noUsername,
      noRelationship,
      isSmall,
      isComment,
      isCentered,
      isAdmin,
      isModerator,
    } = this.props

    if (!account) return null

    const containerClassName = CX({
      default: 1,
      maxWidth100PC: 1,
      alignItemsCenter: !isMultiline,
      flexRow: !isMultiline,
      cursorPointer: !noHover,
      alignItemsCenter: isCentered,
    })

    const displayNameClasses = CX({
      text: 1,
      overflowWrapBreakWord: 1,
      whiteSpaceNoWrap: 1,
      fontWeightBold: 1,
      colorPrimary: 1,
      mr2: 1,
      lineHeight125: !isSmall,
      fs14PX: isSmall,
      fs15PX: !isLarge,
      fs24PX: isLarge && !isSmall,
    })

    const usernameClasses = CX({
      text: 1,
      displayFlex: 1,
      flexNormal: 1,
      flexShrink1: 1,
      overflowWrapBreakWord: 1,
      textOverflowEllipsis: 1,
      colorSecondary: 1,
      fontWeightNormal: 1,
      lineHeight15: isMultiline,
      lineHeight125: !isMultiline,
      ml5: !isMultiline,
      fs14PX: isSmall,
      fs15PX: !isLarge,
      fs16PX: isLarge && !isSmall,
    })

    const iconSize =
      !!isLarge ? 19 :
      !!isComment ? 12 :
      !!isSmall ? 14 : 15

    let relationshipLabel
    if (me && account) {
      const accountId = account.get('id')
      const isFollowedBy = (me !==  accountId && account.getIn(['relationship', 'followed_by']))

      if (isFollowedBy) {
        relationshipLabel = intl.formatMessage(messages.follows_you)
      }
    }

    // {
    //   /* : todo : audio-mute, bot
    //   account.getIn(['relationship', 'muting'])
    //   */
    // }
    // bot: { id: 'account.badges.bot', defaultMessage: 'Bot' },

    return (
      <div
        className={containerClassName}
        onMouseEnter={noHover ? undefined : this.handleMouseEnter}
        onMouseLeave={noHover ? undefined : this.handleMouseLeave}
        ref={this.setRef}
      >
        <span className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.maxWidth100PC].join(' ')}>
          <bdi className={[_s.text, _s.whiteSpaceNoWrap, _s.textOverflowEllipsis].join(' ')}>
            <strong
              className={displayNameClasses}
              dangerouslySetInnerHTML={{ __html: account.get('display_name_html') }}
            />
            {
              account.get('locked') &&
              <Icon id='lock-filled' size={`${iconSize - 3}px`} className={[_s.fillPrimary, _s.ml5].join(' ')} />
            }
          </bdi>
          {
            account.get('is_verified') &&
            <Icon id='verified' size={`${iconSize}px`} className={[_s.ml5, _s.default].join(' ')} />
          }
        </span>
        {
          !noUsername &&
          <span className={usernameClasses}>
            @{account.get('acct')}
            {
              !noRelationship && !!relationshipLabel &&
              <span className={[_s.default, _s.ml5, _s.justifyContentCenter].join(' ')}>
                <Text
                  size='extraSmall'
                  isBadge
                  color='tertiary'
                  className={[_s.bgSecondary, _s.py2].join(' ')}
                >
                  {relationshipLabel}
                </Text>
              </span>
            }

            {
              !!isAdmin &&
              <span className={[_s.default, _s.ml5, _s.justifyContentCenter].join(' ')}>
                <Text
                  size='extraSmall'
                  isBadge
                  color='tertiary'
                  className={[_s.bgSecondary, _s.bgGreen, _s.colorBGPrimary, _s.py2].join(' ')}
                >
                  {intl.formatMessage(messages.admin)}
                </Text>
              </span>
            }

            {
              !!isModerator &&
              <span className={[_s.default, _s.ml5, _s.justifyContentCenter].join(' ')}>
                <Text
                  size='extraSmall'
                  isBadge
                  color='tertiary'
                  className={[_s.bgSecondary, _s.bgGreenLight, _s.colorBGPrimary, _s.py2].join(' ')}
                >
                  {intl.formatMessage(messages.moderator)}
                </Text>
              </span>
            }
          </span>
        }
      </div>
    )
  }

}
