import ImmutablePropTypes from 'react-immutable-proptypes'
import { FormattedMessage } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import debounce from 'lodash.debounce'
import { fetchFavoritedStatuses, expandFavoritedStatuses } from '../actions/favorites'
import { meUsername } from '../initial_state'
import StatusList from '../components/status_list'
import ColumnIndicator from '../components/column_indicator'

const mapStateToProps = (state, { params: { username } }) => {
  return {
    isMyAccount: (username.toLowerCase() === meUsername.toLowerCase()),
    statusIds: state.getIn(['status_lists', 'favorites', 'items']),
    isLoading: state.getIn(['status_lists', 'favorites', 'isLoading'], true),
    hasMore: !!state.getIn(['status_lists', 'favorites', 'next']),
  }
}

export default
@connect(mapStateToProps)
class LikedStatuses extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    statusIds: ImmutablePropTypes.list.isRequired,
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
    isMyAccount: PropTypes.bool.isRequired,
  }

  componentWillMount() {
    this.props.dispatch(fetchFavoritedStatuses())
  }

  handleLoadMore = debounce(() => {
    this.props.dispatch(expandFavoritedStatuses())
  }, 300, { leading: true })

  render() {
    const { statusIds, hasMore, isLoading, isMyAccount } = this.props

    if (!isMyAccount) {
      return <ColumnIndicator type='missing' />
    }

    return (
      <StatusList
        statusIds={statusIds}
        scrollKey='liked_statuses'
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={this.handleLoadMore}
        emptyMessage={<FormattedMessage id='empty_column.liked_statuses' defaultMessage="You don't have any liked posts yet. When you like one, it will show up here." />}
      />
    )
  }

}
