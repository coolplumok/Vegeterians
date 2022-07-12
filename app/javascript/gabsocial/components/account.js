import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { me } from '../initial_state'
import {
  followAccount,
  unfollowAccount,
  blockAccount,
  unblockAccount,
  muteAccount,
  unmuteAccount,
} from '../actions/accounts'
import { openModal } from '../actions/modal'
import { initMuteModal } from '../actions/mutes'
import { unfollowModal } from '../initial_state'
import { makeGetAccount } from '../selectors'
import AccountActionButton from './account_action_button'
import Avatar from './avatar'
import DisplayName from './display_name'
import Button from './button'
import Switch from './switch'

const makeMapStateToProps = (state, props) => ({
  account: makeGetAccount()(state, props.id),
  actionActive: props.actionActive === undefined ? true : props.actionActive
})

const mapDispatchToProps = (dispatch) => ({
  onFollow (account) {
    if (account.getIn(['relationship', 'following']) || account.getIn(['relationship', 'requested'])) {
      if (unfollowModal) {
        dispatch(openModal('UNFOLLOW', {
          account,
        }))
      } else {
        dispatch(unfollowAccount(account.get('id')))
      }
    } else {
      dispatch(followAccount(account.get('id')))
    }
  },

  onBlock (account) {
    if (account.getIn(['relationship', 'blocking'])) {
      dispatch(unblockAccount(account.get('id')))
    } else {
      dispatch(blockAccount(account.get('id')))
    }
  },

  onMute (account) {
    if (account.getIn(['relationship', 'muting'])) {
      dispatch(unmuteAccount(account.get('id')))
    } else {
      dispatch(initMuteModal(account))
    }
  },

  onMuteNotifications (account, notifications) {
    dispatch(muteAccount(account.get('id'), notifications))
  },
})

export default
@injectIntl
@connect(makeMapStateToProps, mapDispatchToProps)
class Account extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    onFollow: PropTypes.func.isRequired,
    onBlock: PropTypes.func.isRequired,
    onMute: PropTypes.func.isRequired,
    onMuteNotifications: PropTypes.func,
    intl: PropTypes.object.isRequired,
    isHidden: PropTypes.bool,
    actionIcon: PropTypes.string,
    actionTitle: PropTypes.string,
    actionActive: PropTypes.bool,
    onActionClick: PropTypes.func,
    compact: PropTypes.bool,
    expanded: PropTypes.bool,
    showDismiss: PropTypes.bool,
    dismissAction: PropTypes.func,
    withBio: PropTypes.bool,
    check: PropTypes.bool,
    locked: PropTypes.bool,
    onLockedClick: PropTypes.func,
    isAdmin: PropTypes.bool,
    isModerator: PropTypes.bool,
  }

  updateOnProps = [
    'account',
    'isHidden',
    'compact',
    'expanded',
    'showDismiss',
    'withBio',
    'lock',
    'locked',
    'isAdmin',
    'isModerator',
  ]

  handleAction = (e) => {
    this.props.onActionClick(this.props.account, e)
  }

  handleUnrequest = () => {
    //
  }
  
  handleLockedChange = ({ target }) => {
    this.props.onLockedClick(target.checked)
  }

  render() {
    const {
      account,
      intl,
      isHidden,
      onActionClick,
      actionIcon,
      actionTitle,
      actionActive,
      compact,
      expanded,
      dismissAction,
      showDismiss,
      withBio,
      lock,
      locked,
      isAdmin,
      isModerator,
    } = this.props

    if (!account) return null

    if (isHidden) {
      return (
        <Fragment>
          {account.get('display_name')}
          {`@${account.get('username')}`}
        </Fragment>
      )
    }

    const actionButton = (onActionClick && actionIcon) ? (
      <Button
        onClick={this.handleAction}
        isOutline={true}
        color='brand'
        backgroundColor='none'
        icon={actionIcon}
        iconSize='10px'
      >
        {actionTitle}
      </Button>
    ) : <AccountActionButton account={account} isSmall />

    const avatarSize = compact ? 42 : 52
    const dismissBtn = !showDismiss ? null : (
      <Button
        isNarrow
        backgroundColor='none'
        className={_s.px5}
        onClick={dismissAction}
        icon='close'
        iconSize='8px'
        iconClassName={_s.fillSecondary}
      />
    )

    const content = { __html: account.get('note_emojified') }

    return (
      <div className={[_s.default, _s.px15, _s.py10, _s.borderBottom1PX, _s.borderColorSecondary, _s.bgSubtle_onHover].join(' ')}>
        <div className={[_s.default, _s.flexRow, _s.alignItemsStart].join(' ')}>

          <NavLink
            className={[_s.default, _s.noUnderline].join(' ')}
            title={account.get('acct')}
            to={`/${account.get('acct')}`}
          >
            <Avatar account={account} size={avatarSize} />
          </NavLink>

          <div className={[_s.default, _s.px10, _s.overflowHidden, _s.flexNormal].join(' ')}>
            <div className={[_s.default, _s.flexRow].join(' ')}>
              <NavLink
                title={account.get('acct')}
                to={`/${account.get('acct')}`}
                className={[_s.default, _s.alignItemsStart, _s.noUnderline, _s.overflowHidden, _s.flexNormal].join(' ')}
              >
                <DisplayName account={account} isMultiline={compact} isAdmin={isAdmin} isModerator={isModerator} />
                {!compact && !lock && actionActive && actionButton}
                {!compact && lock &&
                  <Switch
                    label='Private account'
                    checked={locked}
                    onChange={this.handleLockedChange}
                    />
                }
              </NavLink>

              <div className={[_s.default].join(' ')}>
                {dismissBtn}
                {compact && !lock && actionActive && actionButton}
                {compact && lock &&
                  <Switch
                    checked={locked}
                    onChange={this.handleLockedChange}
                    />
                }
              </div>
            </div>

            {
              withBio &&
              <div className={[_s.py5, _s.dangerousContent].join(' ')} dangerouslySetInnerHTML={content} />
            }
          </div>
        </div>
      </div>
    )
  }

}
