import { defineMessages, injectIntl } from 'react-intl'
import {
  followAccount,
  unfollowAccount,
  unblockAccount,
  unmuteAccount,
} from '../../actions/accounts'
import {
  mentionCompose,
} from '../../actions/compose'
import {
  addShortcut,
  removeShortcut,
} from '../../actions/shortcuts'
import { initReport } from '../../actions/reports'
import { openModal } from '../../actions/modal'
import { closePopover } from '../../actions/popover'
import { unfollowModal, me, isStaff } from '../../initial_state'
import { makeGetAccount } from '../../selectors'
import PopoverLayout from './popover_layout'
import List from '../list'

const messages = defineMessages({
  blockAndReport: { id: 'confirmations.block.block_and_report', defaultMessage: 'Block & Report' },
  unfollow: { id: 'account.unfollow', defaultMessage: 'Unfollow' },
  follow: { id: 'account.follow', defaultMessage: 'Follow' },
  requested: { id: 'account.requested', defaultMessage: 'Awaiting approval. Click to cancel follow request' },
  unblock: { id: 'account.unblock', defaultMessage: 'Unblock @{name}' },
  edit_profile: { id: 'account.edit_profile', defaultMessage: 'Edit profile' },
  linkVerifiedOn: { id: 'account.link_verified_on', defaultMessage: 'Ownership of this link was checked on {date}' },
  account_locked: { id: 'account.locked_info', defaultMessage: 'This account privacy status is set to locked. The owner manually reviews who can follow them.' },
  mention: { id: 'account.mention', defaultMessage: 'Mention' },
  unmute: { id: 'account.unmute', defaultMessage: 'Unmute @{name}' },
  block: { id: 'account.block', defaultMessage: 'Block @{name}' },
  mute: { id: 'account.mute', defaultMessage: 'Mute @{name}' },
  report: { id: 'account.report', defaultMessage: 'Report @{name}' },
  share: { id: 'account.share', defaultMessage: 'Share @{name}\'s profile' },
  media: { id: 'account.media', defaultMessage: 'Media' },
  hideReposts: { id: 'account.hide_reblogs', defaultMessage: 'Hide reposts from @{name}' },
  showReposts: { id: 'account.show_reblogs', defaultMessage: 'Show reposts from @{name}' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Muted users' },
  admin_account: { id: 'admin_account', defaultMessage: 'Open moderation interface' },
  add_to_list: { id: 'lists.account.add', defaultMessage: 'Add to list' },
  add_to_shortcuts: { id: 'account.add_to_shortcuts', defaultMessage: 'Add to shortcuts' },
  remove_from_shortcuts: { id: 'account.remove_from_shortcuts', defaultMessage: 'Remove from shortcuts' },
  accountBlocked: { id: 'account.blocked', defaultMessage: 'Blocked' },
  accountMuted: { id: 'account.muted', defaultMessage: 'Muted' },
});

const mapStateToProps = (state, { account }) => {
  const getAccount = makeGetAccount()
  const accountId = !!account ? account.get('id') : -1
  const shortcuts = state.getIn(['shortcuts', 'items'])
  const isShortcut = !!shortcuts.find((s) => {
    return s.get('shortcut_id') == accountId && s.get('shortcut_type') === 'account'
  })

  return {
    isShortcut,
    account: getAccount(state, accountId),
  }
}

const mapDispatchToProps = (dispatch, { intl }) => ({
  onFollow(account) {
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
  onBlock(account) {
    dispatch(closePopover())
  
    if (account.getIn(['relationship', 'blocking'])) {
      dispatch(unblockAccount(account.get('id')));
    } else {
      dispatch(openModal('BLOCK_ACCOUNT', {
        accountId: account.get('id'),
      }));
    }
  },
  onMention(account) {
    dispatch(closePopover())
    dispatch(mentionCompose(account));
  },
  onRepostToggle(account) {
    dispatch(closePopover())
    if (account.getIn(['relationship', 'showing_reblogs'])) {
      dispatch(followAccount(account.get('id'), false));
    } else {
      dispatch(followAccount(account.get('id'), true));
    }
  },
  onReport(account) {
    dispatch(closePopover())
    dispatch(initReport(account));
  },
  onMute(account) {
    dispatch(closePopover())
    if (account.getIn(['relationship', 'muting'])) {
      dispatch(unmuteAccount(account.get('id')));
    } else {
      dispatch(openModal('MUTE', {
        accountId: account.get('id'),
      }))
    }
  },
  onAddToList(account) {
    dispatch(closePopover())
    dispatch(openModal('LIST_ADD_USER', {
      accountId: account.get('id'),
    }));
  },
  onClosePopover: () => dispatch(closePopover()),
  onAddShortcut(accountId) {
    dispatch(closePopover())
    dispatch(addShortcut('account', accountId))
  },
  onRemoveShortcut(accountId) {
    dispatch(closePopover())
    dispatch(removeShortcut(null, 'account', accountId))
  },
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class ProfileOptionsPopover extends PureComponent {

  static defaultProps = {
    isXS: PropTypes.bool,
    isShortcut: PropTypes.bool,
  }

  makeMenu() {
    const {
      account,
      intl,
      isShortcut,
    } = this.props;

    let menu = [];

    if (!account) return menu
    if (account.get('id') === me) return menu

    if ('share' in navigator) {
      menu.push({
        hideArrow: true,
        icon: 'share',
        title: intl.formatMessage(messages.share, { name: account.get('username') }),
        onClick: this.handleShare
      });
    }

    menu.push({
      hideArrow: true,
      icon: 'comment',
      title: intl.formatMessage(messages.mention, { name: account.get('acct') }),
      onClick: this.handleOnMention
    });

    if (account.getIn(['relationship', 'following'])) {
      const showingReblogs = account.getIn(['relationship', 'showing_reblogs'])
      menu.push({
        hideArrow: true,
        icon: 'repost',
        title: intl.formatMessage(showingReblogs ? messages.hideReposts : messages.showReposts, {
          name: account.get('username')
        }),
        onClick: this.handleRepostToggle,
      })
    }

    const isMuting = account.getIn(['relationship', 'muting'])
    menu.push({
      hideArrow: true,
      icon: 'audio-mute',
      title: intl.formatMessage(isMuting ? messages.unmute : messages.mute, {
        name: account.get('username')
      }),
      onClick: this.handleMute,
    })

    const isBlocking = account.getIn(['relationship', 'blocking'])
    menu.push({
      hideArrow: true,
      icon: 'block',
      title: intl.formatMessage(isBlocking ? messages.unblock : messages.block, {
        name: account.get('username')
      }),
      onClick: this.handleBlock
    })

    menu.push({
      hideArrow: true,
      icon: 'report',
      title: intl.formatMessage(messages.report, { name: account.get('username') }),
      onClick: this.handleReport
    })

    // menu.push({
    //   hideArrow: true,
    //   icon: 'list',
    //   title: intl.formatMessage(messages.add_to_list),
    //   onClick: this.handleAddToList
    // })

    menu.push({
      hideArrow: true,
      icon: 'star',
      title: intl.formatMessage(isShortcut ? messages.remove_from_shortcuts : messages.add_to_shortcuts),
      onClick: this.handleToggleShortcuts,
    })

    if (isStaff) {
      menu.push({
        hideArrow: true,
        icon: 'circle',
        title: intl.formatMessage(messages.admin_account),
        href: `/admin/accounts/${account.get('id')}`
      })
    }

    return menu
  }

  handleShare = () => {
    // : todo :
  }

  handleFollow = () => {
    this.props.onFollow(this.props.account);
  }

  handleBlock = () => {
    this.props.onBlock(this.props.account);
  }

  handleOnMention = () => {
    this.props.onMention(this.props.account);
  }

  handleReport = () => {
    this.props.onReport(this.props.account);
  }

  handleRepostToggle = () => {
    this.props.onRepostToggle(this.props.account);
  }

  handleMute = () => {
    this.props.onMute(this.props.account);
  }

  handleAddToList = () => {
    this.props.onAddToList(this.props.account);
  }

  handleToggleShortcuts = () => {
    if (this.props.isShortcut) {
      this.props.onRemoveShortcut(this.props.account.get('id'))
    } else {
      this.props.onAddShortcut(this.props.account.get('id'))
    }
  }

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  render() {
    const { isXS } = this.props
    const listItems = this.makeMenu()

    return (
      <PopoverLayout
        width={250}
        isXS={isXS}
        onClose={this.handleOnClosePopover}
      >
        <List
          scrollKey='profile_options'
          items={listItems}
          size={isXS ? 'large' : 'small'}
        />
      </PopoverLayout>
    )
  }
}