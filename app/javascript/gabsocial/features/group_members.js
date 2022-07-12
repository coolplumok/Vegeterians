import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { List as ImmutableList } from 'immutable'
import debounce from 'lodash.debounce'
import { FormattedMessage } from 'react-intl'
import { me } from '../initial_state';
import {
	fetchMembers,
	expandMembers,
} from '../actions/groups'
import { openPopover } from '../actions/popover'
import Account from '../components/account'
import ScrollableList from '../components/scrollable_list'

const mapStateToProps = (state, { groupId }) => {
	const accountIds = state.getIn(['user_lists', 'groups', groupId, 'items'])
	let accounts = ImmutableList()
	!!accountIds && accountIds.forEach((accountId) => {
		const account = state.getIn(['accounts', accountId])
		accounts = accounts.set(accounts.size, account)
	})
	return {
		group: state.getIn(['groups', groupId]),
		relationships: state.getIn(['group_relationships', groupId]),
		accountIds,
		accounts,
		hasMore: !!state.getIn(['user_lists', 'groups', groupId, 'next']),
	}
}

const mapDispatchToProps = (dispatch) => ({
	onFetchMembers(groupId) {
		dispatch(fetchMembers(groupId))
	},
	onExpandMembers(groupId) {
		dispatch(expandMembers(groupId))
	},
	onOpenGroupMemberOptions(targetRef, accountId, groupId, isModerator) {
		dispatch(openPopover('GROUP_MEMBER_OPTIONS', {
			targetRef,
			accountId,
			groupId,
			isModerator,
			position: 'top',
		}))
	},
})

export default
@connect(mapStateToProps, mapDispatchToProps)
class GroupMembers extends ImmutablePureComponent {

	static propTypes = {
		groupId: PropTypes.string.isRequired,
		accountIds: ImmutablePropTypes.list,
		accounts: ImmutablePropTypes.list,
		hasMore: PropTypes.bool,
		onExpandMembers: PropTypes.func.isRequired,
		onFetchMembers: PropTypes.func.isRequired,
		onOpenGroupMemberOptions: PropTypes.func.isRequired,
	}

	componentWillMount() {
		const { groupId } = this.props

		this.props.onFetchMembers(groupId)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.groupId !== this.props.groupId) {
			this.props.onFetchMembers(nextProps.groupId)
		}
	}

	handleOpenGroupMemberOptions = (e, accountId) => {
		const { relationships, groupId } = this.props

		const isMod = !!relationships ? relationships.get('moderator') : true
		this.props.onOpenGroupMemberOptions(e.currentTarget, accountId, groupId, isMod)
	} 

	handleLoadMore = debounce(() => {
		this.props.onExpandMembers(this.props.groupId)
	}, 300, { leading: true })

	actionActive = (accountId) => {
		const account = this.props.accounts.find(acct => accountId === acct.getIn(['id']))
		const isMod = !!this.props.relationships ? this.props.relationships.get('moderator') : true

    const group_admin = account.get('group_admin')
    const group_moderator = account.get('group_moderator')
		if (accountId === me || (isMod && (group_admin || group_moderator))) {
			return false
		}
		return true
	}

	isAdmin = (accountId) => {
		const account = this.props.accounts.find(acct => accountId === acct.getIn(['id']))

    const group_admin = account.get('group_admin')
		return group_admin
	}

	isModerator = (accountId) => {
		const account = this.props.accounts.find(acct => accountId === acct.getIn(['id']))

    const group_moderator = account.get('group_moderator')
		return group_moderator
	}

	render() {
		const {
			accountIds,
			hasMore,
			group,
			relationships,
		} = this.props

		return (
			<ScrollableList
				scrollKey='group-members'
				hasMore={hasMore}
				showLoading={(!group || !accountIds || !relationships)}
				onLoadMore={this.handleLoadMore}
				emptyMessage={<FormattedMessage id='group.members.empty' defaultMessage='This group does not has any members.' />}
			>
				{
					accountIds && accountIds.map((id) => (
						<Account
							compact
							key={id}
							id={id}
							isAdmin={this.isAdmin(id)}
							isModerator={this.isModerator(id)}
							actionActive={this.actionActive(id)}
							actionIcon={'ellipsis'}
							onActionClick={(data, event) => {
								return this.handleOpenGroupMemberOptions(event, id)
							}}
						/>
					))
				}
			</ScrollableList>
		)
	}

}
