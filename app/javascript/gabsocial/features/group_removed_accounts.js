import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import debounce from 'lodash.debounce'
import {
	fetchRemovedAccounts,
	expandRemovedAccounts,
	removeRemovedAccount,
} from '../actions/groups'
import { FormattedMessage } from 'react-intl'
import Account from '../components/account'
import ScrollableList from '../components/scrollable_list'
import { defineMessages, injectIntl } from 'react-intl'

const messages = defineMessages({
	remove: { id: 'groups.removed_accounts', defaultMessage: 'Allow joining' },
})

const mapStateToProps = (state, { groupId }) => ({
	group: state.getIn(['groups', groupId]),
	accountIds: state.getIn(['user_lists', 'groups_removed_accounts', groupId, 'items']),
	hasMore: !!state.getIn(['user_lists', 'groups_removed_accounts', groupId, 'next']),
})

export default
@connect(mapStateToProps)
@injectIntl
class GroupRemovedAccounts extends ImmutablePureComponent {

	static propTypes = {
		groupId: PropTypes.string.isRequired,
		dispatch: PropTypes.func.isRequired,
		accountIds: ImmutablePropTypes.list,
		hasMore: PropTypes.bool,
	}

	componentWillMount() {
		const { groupId } = this.props

		this.props.dispatch(fetchRemovedAccounts(groupId))
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.groupId !== this.props.groupId) {
			this.props.dispatch(fetchRemovedAccounts(nextProps.groupId))
		}
	}

	handleLoadMore = debounce(() => {
		this.props.dispatch(expandRemovedAccounts(this.props.groupId))
	}, 300, { leading: true })

	render() {
		const { accountIds, hasMore, group, intl } = this.props

		return (
			<ScrollableList
				scrollKey='removed_accounts'
				hasMore={hasMore}
				showLoading={(!group || !accountIds)}
				onLoadMore={this.handleLoadMore}
				emptyMessage={<FormattedMessage id='group.removed_accounts.empty' defaultMessage='This group does not has any removed accounts.' />}
			>
				{
					accountIds && accountIds.map((id) => (
						<Account
							key={id}
							id={id}
							actionIcon='subtract'
							onActionClick={() => this.props.dispatch(removeRemovedAccount(group.get('id'), id))}
							actionTitle={intl.formatMessage(messages.remove)}
						/>
					))
				}
			</ScrollableList>
		)
	}

}
