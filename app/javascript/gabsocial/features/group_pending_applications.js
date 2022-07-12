import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import debounce from 'lodash.debounce'
import { defineMessages, injectIntl } from 'react-intl'
import {
  fetchPendingApplications,
  expandPendingApplications,
  approvePendingApplications,
} from '../actions/groups'
import { closeModal } from '../actions/modal'
import Account from '../components/account'
import ScrollableList from '../components/scrollable_list'
import Button from '../components/button'
import Text from '../components/text'

const messages = defineMessages({
  followers: { id: 'account.group_pending_applications', defaultMessage: 'Followers' },
  empty: { id: 'account.group_pending_applications.empty', defaultMessage: 'No one user sent the join request on this group yet.' },
  approve: { id: 'account.group_pending_applications.approve', defaultMessage: 'Approve' },
  select_all: { id: 'account.group_pending_applications.select_all', defaultMessage: 'Select All' },
  unselect_all: { id: 'account.group_pending_applications.unselect_all', defaultMessage: 'Unselect All' },
})

const mapStateToProps = (state, { groupId }) => ({
  group: state.getIn(['groups', groupId]),
  accountIds: state.getIn(['user_lists', 'group_pending_applications', groupId, 'items']),
  hasMore: !!state.getIn(['user_lists', 'group_pending_applications', groupId, 'next']),
  isLoading: state.getIn(['user_lists', 'group_pending_applications', groupId, 'isLoading']),
})

const mapDispatchToProps = (dispatch) => ({
	onFetchPendingApplications(groupId) {
		dispatch(fetchPendingApplications(groupId))
  },
  
	onExpandPendingApplications(groupId) {
		dispatch(expandPendingApplications(groupId))
  },
  
	onGroupInvite(groupId, lockedIds) {
		dispatch(approvePendingApplications(groupId, lockedIds))
		dispatch(closeModal())
	},
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class GroupPendingApplications extends ImmutablePureComponent {

  static propTypes = {
    accountIds: ImmutablePropTypes.list,
    intl: PropTypes.object.isRequired,
    groupId: PropTypes.string,
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
		onFetchPendingApplications: PropTypes.func.isRequired,
		onExpandPendingApplications: PropTypes.func.isRequired,
		onGroupInvite: PropTypes.func.isRequired,
  }

  state = {
    lockedIds: [],
    selectAll: false,
    updated: false,
  }

  componentWillMount() {
    const { groupId } = this.props

    if (groupId && groupId !== -1) {
		  this.props.onFetchPendingApplications(groupId)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!!nextProps.groupId && nextProps.groupId !== -1 && nextProps.groupId !== this.props.groupId) {
      this.setState({
        lockedIds: [],
        updated: false
      })
		  this.props.onFetchPendingApplications(groupId)
    }
  }

  handleLoadMore = debounce(() => {
    const { groupId } = this.props
    if (!!groupId && groupId !== -1) {
		  this.props.onExpandPendingApplications(groupId)
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
    this.props.onGroupInvite(this.props.groupId, this.state.lockedIds)
  }

  render() {
    const {
      accountIds,
      groupId,
      hasMore,
      intl,
      isLoading,
    } = this.props

    const { lockedIds, selectAll } = this.state
    
    if (!groupId) return null

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
                {intl.formatMessage(messages.approve)}
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
          scrollKey='group-pending-applications'
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
                key={`group-pending-applications-${id}-${lockedIds.indexOf(id) != -1}`}
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