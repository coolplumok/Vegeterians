import ImmutablePropTypes from 'react-immutable-proptypes'
import { FormattedMessage } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import debounce from 'lodash.debounce'
import { fetchBookmarkedStatuses, expandBookmarkedStatuses } from '../actions/bookmarks'
import { meUsername } from '../initial_state'
import StatusList from '../components/status_list'
import ColumnIndicator from '../components/column_indicator'

const mapStateToProps = (state, { params: { username } }) => {
  return {
    isMyAccount: (username.toLowerCase() === meUsername.toLowerCase()),
    statusIds: state.getIn(['status_lists', 'bookmarks', 'items']),
    isLoading: state.getIn(['status_lists', 'bookmarks', 'isLoading'], true),
    hasMore: !!state.getIn(['status_lists', 'bookmarks', 'next']),
  }
}

export default
@connect(mapStateToProps)
class BookmarkedStatuses extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    statusIds: ImmutablePropTypes.list.isRequired,
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
    isMyAccount: PropTypes.bool.isRequired,
  }

  componentWillMount() {
    this.props.dispatch(fetchBookmarkedStatuses())
  }

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandBookmarkedStatuses())
  }, 300, { leading: true })

  render() {
    const { statusIds, hasMore, isLoading, isMyAccount } = this.props

    if (!isMyAccount) {
      return <ColumnIndicator type='missing' />
    }

    return (
      <StatusList
        statusIds={statusIds}
        scrollKey='bookmarked_statuses'
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={this.handleLoadMore}
        emptyMessage={<FormattedMessage id='empty_column.bookmarked_statuses' defaultMessage="You don't have any bookmarked posts yet. If you are VegeteriansPro/VegeteriansProPlus, when you bookmark one, it will show up here." />}
      />
    )
  }

}

