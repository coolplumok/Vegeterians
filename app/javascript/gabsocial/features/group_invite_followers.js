import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import debounce from 'lodash.debounce'
import { defineMessages, injectIntl } from 'react-intl'
import {
  fetchGroupInviteFollowers,
  expandGroupInviteFollowers,
} from '../actions/accounts'
import {
  inviteFollowers,
} from '../actions/groups'
import { closeModal } from '../actions/modal'
import { me } from '../initial_state'
import Account from '../components/account'
import ScrollableList from '../components/scrollable_list'
import Button from '../components/button'
import Text from '../components/text'

const messages = defineMessages({
  followers: { id: 'account.group_invite_followers', defaultMessage: 'Followers' },
  empty: { id: 'account.group_invite_followers.empty', defaultMessage: 'No one follows to invite on this group yet.' },
  invite: { id: 'account.group_invite_followers.invite', defaultMessage: 'Send Invite' },
  select_all: { id: 'account.group_invite_followers.select_all', defaultMessage: 'Select All' },
  unselect_all: { id: 'account.group_invite_followers.unselect_all', defaultMessage: 'Unselect All' },
})

const mapStateToProps = (state) => {
  const accountId = !!me ? me : -1

  return {
    accountId,
    accountIds: state.getIn(['user_lists', 'group_invite_followers', accountId, 'items']),
    hasMore: !!state.getIn(['user_lists', 'group_invite_followers', accountId, 'next']),
    isLoading: state.getIn(['user_lists', 'group_invite_followers', accountId, 'isLoading']),
  }
}

export default
@injectIntl
@connect(mapStateToProps)
class GroupInviteFollowers extends ImmutablePureComponent {

  static propTypes = {
    accountId: PropTypes.string,
    accountIds: ImmutablePropTypes.list,
    intl: PropTypes.object.isRequired,
    groupId: PropTypes.string,
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
  }

  state = {
    lockedIds: [],
    selectAll: false,
    updated: false,
  }

  componentWillMount() {
    const { accountId, groupId } = this.props

    if (accountId && accountId !== -1) {
      this.props.dispatch(fetchGroupInviteFollowers(accountId, groupId))
    }
  }

  componentWillReceiveProps(nextProps) {
    if ((!!nextProps.accountId && nextProps.accountId !== -1 && nextProps.accountId !== this.props.accountId)
    || (!!nextProps.groupId && nextProps.groupId !== -1 && nextProps.groupId !== this.props.groupId)) {
      this.setState({
        lockedIds: [],
        updated: false
      })
      this.props.dispatch(fetchGroupInviteFollowers(nextProps.accountId, nextProps.groupId))
    }
  }

  handleLoadMore = debounce(() => {
    const { accountId, groupId } = this.props
    if (!!accountId && accountId !== -1 && !!groupId && groupId !== -1) {
      this.props.dispatch(expandGroupInviteFollowers(accountId, groupId))
    }
  }, 300, { leading: true })

  handleLockedClick = (id, locked) => {
    let lockedIds = this.state.lockedIds
    let idIndex = lockedIds.indexOf(id)
    if (locked) {
      if (idIndex == -1) {
        this.setState({
          lockedIds: lockedIds.concat(id),
          selectAll: this.props.accountIds._tail.array.length == lockedIds.length + 1,
          updated: !this.state.updated,
        })
      } else {
        lockedIds.splice(idIndex, 1)
        this.setState({
          lockedIds: lockedIds,
          selectAll: false,
          updated: !this.state.updated,
        })
      }
    } else {
      lockedIds.splice(idIndex, 1)
      this.setState({
        lockedIds: lockedIds,
        selectAll: false,
        updated: !this.state.updated,
      })
    }
  }

  handleToggleSelectAll = () => {
    let lockedIds = this.state.lockedIds
    if (this.state.selectAll) {
      lockedIds = []
    } else {
      lockedIds = this.props.accountIds && this.props.accountIds.map((id) => 
        id
      )
    }
    this.setState({
      lockedIds: lockedIds,
      selectAll: !this.state.selectAll,
      updated: !this.state.updated,
    })
  }

  handleGroupInvite = () => {
    this.props.dispatch(inviteFollowers(this.props.groupId, this.state.lockedIds))
    this.props.dispatch(closeModal())
  }

  render() {
    const {
      accountId,
      accountIds,
      groupId,
      hasMore,
      intl,
      isLoading,
    } = this.props

    const { lockedIds, selectAll } = this.state
    
    if (!accountId || !groupId) return null

    return (
      <div className={[_s.default].join(' ')}>
        <div className={[_s.default, _s.flexRow, _s.px10].join(' ')}>
          <div className={[_s.mlAuto, _s.my10, _s.mrAuto].join(' ')}>
            <Button
              small
              backgroundColor='brand'
              color='white'
              className={_s.justifyContentCenter}
              onClick={this.handleGroupInvite}
              isDisabled={!lockedIds.length}
            >
              <Text size='medium' color='inherit' weight='bold' align='center'>
                {intl.formatMessage(messages.invite)}
              </Text>
            </Button>
          </div>
          <div className={[_s.mlAuto, _s.my10, _s.mrAuto].join(' ')}>
            <Button
              small
              backgroundColor='brand'
              color='white'
              className={_s.justifyContentCenter}
              onClick={this.handleToggleSelectAll}
            >
              <Text size='medium' color='inherit' weight='bold' align='center'>
                { !!selectAll && intl.formatMessage(messages.unselect_all)}
                { !selectAll && intl.formatMessage(messages.select_all)}
              </Text>
            </Button>
          </div>
        </div>

        <ScrollableList
          scrollKey='followers'
          hasMore={hasMore}
          isLoading={isLoading}
          onLoadMore={this.handleLoadMore}
          emptyMessage={intl.formatMessage(messages.empty)}
        >
          {
            accountIds && accountIds.map((id) => (
              <Account
                compact
                lock
                id={id}
                key={`group-invite-follower-${id}-${lockedIds.indexOf(id) != -1}`}
                onLockedClick={(locked) => this.handleLockedClick(id, locked)}
                locked={lockedIds.indexOf(id) != -1}
              />
            ))
          }
        </ScrollableList>
      </div>
    )
  }

}