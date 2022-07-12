import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { injectIntl, defineMessages } from 'react-intl'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { me } from '../initial_state'
import { connectGroupStream } from '../actions/streaming'
import { expandGroupTimeline } from '../actions/timelines'
import StatusList from '../components/status_list'
import ColumnIndicator from '../components/column_indicator'

const messages = defineMessages({
	tabLatest: { id: 'group.timeline.tab_latest', defaultMessage: 'Latest' },
	show: { id: 'group.timeline.show_settings', defaultMessage: 'Show settings' },
	hide: { id: 'group.timeline.hide_settings', defaultMessage: 'Hide settings' },
	empty: { id: 'empty_column.group', defaultMessage: 'There is nothing in this group yet.\nWhen members of this group post new statuses, they will appear here.' },
})

const mapStateToProps = (state, props) => ({
	group: state.getIn(['groups', props.params.id]),
	relationships: state.getIn(['group_relationships', props.params.id]),
	hasUnread: state.getIn(['timelines', `group:${props.params.id}`, 'unread']) > 0,
})

export default
@connect(mapStateToProps)
@injectIntl
class GroupTimeline extends ImmutablePureComponent {

	static contextTypes = {
		router: PropTypes.object,
	}

	static propTypes = {
		params: PropTypes.object.isRequired,
		dispatch: PropTypes.func.isRequired,
		columnId: PropTypes.string,
		hasUnread: PropTypes.bool,
		group: PropTypes.oneOfType([
			ImmutablePropTypes.map,
			PropTypes.bool,
		]),
		relationships: ImmutablePropTypes.map,
		intl: PropTypes.object.isRequired,
	}

	state = {
		collapsed: true,
	}

	componentDidMount() {
		const { dispatch } = this.props
		const { id } = this.props.params

		dispatch(expandGroupTimeline(id))

		if (!!me) {
			this.disconnect = dispatch(connectGroupStream(id))
		}
	}

	componentWillUnmount() {
		if (this.disconnect && !!me) {
			this.disconnect()
			this.disconnect = null
		}
	}

	handleLoadMore = maxId => {
		const { id } = this.props.params
		this.props.dispatch(expandGroupTimeline(id, { maxId }))
	}

	handleToggleClick = (e) => {
		e.stopPropagation()
		this.setState({ collapsed: !this.state.collapsed })
	}

	render() {
		const { columnId, group, relationships, account, intl } = this.props
		const { collapsed } = this.state
		const { id } = this.props.params

		if (typeof group === 'undefined') {
			return <ColumnIndicator type='loading' />
		} else if (group === false) {
			return <ColumnIndicator type='missing' />
		}

		return (
			<StatusList
				alwaysPrepend
				scrollKey={`group_timeline-${columnId}`}
				timelineId={`group:${id}`}
				onLoadMore={this.handleLoadMore}
				group={group}
				emptyMessage={intl.formatMessage(messages.empty)}
			/>
		)
	}

}
