import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import { fetchGroups } from '../../actions/groups'
import PanelLayout from './panel_layout'
import GroupListItem from '../group_list_item'
import ScrollableList from '../scrollable_list'

const messages = defineMessages({
  title: { id: 'groups.sidebar-panel.title', defaultMessage: 'Groups you\'re in' },
  show_all: { id: 'groups.sidebar-panel.show_all', defaultMessage: 'Show all' },
  all: { id: 'groups.sidebar-panel.all', defaultMessage: 'All' },
})

const mapStateToProps = (state) => ({
  groupIds: state.getIn(['group_lists', 'member', 'items']),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchGroups: (type) => dispatch(fetchGroups(type))
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class GroupSidebarPanel extends ImmutablePureComponent {

  static propTypes = {
    groupIds: ImmutablePropTypes.list,
    isLazy: PropTypes.bool, 
    isSlim: PropTypes.bool,
    onFetchGroups: PropTypes.func.isRequired,
    shouldLoad: PropTypes.bool,
  }

  state = {
    fetched: false,
  }

  updateOnProps = [
    'groupIds',
    'isLazy',
    'isSlim',
    'shouldLoad',
  ]

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.shouldLoad && !prevState.fetched) {
      return { fetched: true }
    }

    return null
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!prevState.fetched && this.state.fetched) {
      this.props.onFetchGroups('member')
    }
  }

  componentDidMount() {
    if (!this.props.isLazy) {
      this.props.onFetchGroups('member')
      this.setState({ fetched: true })
    }
  }
  
  render() {
    const { intl, groupIds, isSlim } = this.props
    const { fetched } = this.state

    const count = !!groupIds ? groupIds.count() : 0
    const maxCount = isSlim ? 12 : 6

    if (count === 0 && fetched) return null

    return (
      <PanelLayout
        title={intl.formatMessage(messages.title)}
        headerButtonTitle={intl.formatMessage(messages.all)}
        headerButtonTo='/groups/browse/member'
        footerButtonTitle={count > maxCount ? intl.formatMessage(messages.show_all) : undefined}
        footerButtonTo={count > maxCount ? '/groups/browse/member' : undefined}
        noPadding
      >
        <ScrollableList
          scrollKey='groups_panel'
          showLoading={!fetched}
        >
          {
            groupIds && groupIds.slice(0, maxCount).map((groupId, i) => (
              <GroupListItem
                key={`group-panel-item-${groupId}`}
                id={groupId}
                isLast={groupIds.count() - 1 === i}
              />
            ))
          }
        </ScrollableList>
      </PanelLayout>
    )
  }

}