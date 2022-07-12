import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { injectIntl, defineMessages } from 'react-intl'
import { fetchGroups } from '../actions/groups'
import { openPopover } from '../actions/popover'
import { POPOVER_GROUP_LIST_SORT_OPTIONS } from '../constants'
import Block from '../components/block'
import Button from '../components/button'
import ColumnIndicator from '../components/column_indicator'
import Heading from '../components/heading'
import GroupListItem from '../components/group_list_item'

const messages = defineMessages({
	empty: { id: 'groups.empty', defaultMessage: 'There are no groups to display' },
	all: { id: 'all', defaultMessage: 'All' },
	featured: { id: 'featured', defaultMessage: 'Featured' },
	privated: { id: 'privated', defaultMessage: 'Private' },
	new: { id: 'new', defaultMessage: 'Just Added' },
	member: { id: 'my_groups', defaultMessage: 'My Groups' },
	admin: { id: 'admin', defaultMessage: 'Admin' },
})

const mapStateToProps = (state, { activeTab }) => ({
	groupIds: state.getIn(['group_lists', activeTab, 'items']),
	isFetched: state.getIn(['group_lists', activeTab, 'isFetched']),
	isLoading: state.getIn(['group_lists', activeTab, 'isLoading']),
})

const mapDispatchToProps = (dispatch) => ({
	onFetchGroups: (tab) => dispatch(fetchGroups(tab)),
	onOpenSortPopover(tab, targetRef) {
		dispatch(openPopover(POPOVER_GROUP_LIST_SORT_OPTIONS, {
			targetRef,
			tab,
			position: 'bottom',
		}))
	}
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class GroupsCollection extends ImmutablePureComponent {

	static propTypes = {
		activeTab: PropTypes.string.isRequired,
		groupIds: ImmutablePropTypes.list,
		intl: PropTypes.object.isRequired,
		isFetched: PropTypes.bool.isRequired,
		isLoading: PropTypes.bool.isRequired,
		onFetchGroups: PropTypes.func.isRequired,
		onOpenSortPopover: PropTypes.func.isRequired,
	}

	componentWillMount() {
		this.props.onFetchGroups(this.props.activeTab)
	}

	componentDidUpdate(oldProps) {
		if (this.props.activeTab && this.props.activeTab !== oldProps.activeTab) {
			this.props.onFetchGroups(this.props.activeTab)
		}
	}

	handleOnOpenSortPopover = () => {
		this.props.onOpenSortPopover(this.props.activeTab, this.sortBtn)
	}

	setSortBtn = (n) => {
		this.sortBtn = n
	}

	render() {
		const {
			activeTab,
			groupIds,
			intl,
			isLoading,
			isFetched,
		} = this.props

		if (isLoading && groupIds.size === 0) {
			return <ColumnIndicator type='loading' />
		} else if (isFetched && groupIds.size === 0) {
			return <ColumnIndicator type='error' message={intl.formatMessage(messages.empty)} />
		}

		const isAddable = ['all', 'featured', 'privated', 'new'].indexOf(activeTab) > -1

		return (
			<Block>
				<div className={[_s.default, _s.flexRow, _s.px15, _s.pt10, _s.justifyContentCenter].join(' ')}>
					<div className={[_s.default, _s.flexGrow1, _s.maxWidth80PC, _s.justifyContentCenter, _s.overflowHidden].join(' ')}>
						<Heading size='h2'>
							{intl.formatMessage(messages[activeTab])}
						</Heading>
					</div>
					<div className={[_s.default, _s.flexRow, _s.mlAuto].join(' ')}>
						<Button
							icon='sort'
							className={_s.px10}
							color='primary'
							backgroundColor='none'
							iconSize='14px'
							onClick={this.handleOnOpenSortPopover}
							buttonRef={this.setSortBtn}
						/>
					</div>
				</div>
				<div className={[_s.default, _s.py10, _s.width100PC].join(' ')}>
					{
						groupIds.map((groupId, i) => (
							<GroupListItem
								isAddable={isAddable}
								key={`group-collection-item-${i}`}
								id={groupId}
								isLast={groupIds.count() - 1 === i}
							/>
						))
					}
				</div>
			</Block>
		)
	}

}