import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { List as ImmutableList } from 'immutable'
import { injectIntl, defineMessages } from 'react-intl'
import { expandAccountFeaturedTimeline, expandAccountTimeline } from '../actions/timelines'
import StatusList from '../components/status_list'

const messages = defineMessages({
  empty: { id: 'empty_column.account_timeline', defaultMessage: 'No posts here!' },
})

const emptyList = ImmutableList()

const mapStateToProps = (state, { account, commentsOnly = false }) => {
  const accountId = !!account ? account.getIn(['id'], null) : -1

  const path = commentsOnly ? `${accountId}:comments_only` : accountId

  return {
    accountId,
    statusIds: state.getIn(['timelines', `account:${path}`, 'items'], emptyList),
    featuredStatusIds: commentsOnly ? ImmutableList() : state.getIn(['timelines', `account:${accountId}:pinned`, 'items'], emptyList),
    isLoading: state.getIn(['timelines', `account:${path}`, 'isLoading']),
    hasMore: state.getIn(['timelines', `account:${path}`, 'hasMore']),
  }
}

export default
@connect(mapStateToProps)
@injectIntl
class AccountTimeline extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    statusIds: ImmutablePropTypes.list,
    featuredStatusIds: ImmutablePropTypes.list,
    isLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
    commentsOnly: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  }

  componentWillMount() {
    const { accountId, commentsOnly } = this.props

    if (accountId && accountId !== -1) {
      if (!commentsOnly) {
        this.props.dispatch(expandAccountFeaturedTimeline(accountId))
      }

      this.props.dispatch(expandAccountTimeline(accountId, { commentsOnly }))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountId && nextProps.accountId !== -1 && (nextProps.accountId !== this.props.accountId && nextProps.accountId) || nextProps.commentsOnly !== this.props.commentsOnly) {
      if (!nextProps.commentsOnly) {
        this.props.dispatch(expandAccountFeaturedTimeline(nextProps.accountId))
      }

      this.props.dispatch(expandAccountTimeline(nextProps.accountId, { commentsOnly: nextProps.commentsOnly }))
    }
  }

  handleLoadMore = maxId => {
    if (this.props.accountId && this.props.accountId !== -1) {
      this.props.dispatch(expandAccountTimeline(this.props.accountId, {
        maxId,
        commentsOnly: this.props.commentsOnly
      }))
    }
  }

  render() {
    const {
      account,
      statusIds,
      featuredStatusIds,
      isLoading,
      hasMore,
      intl
    } = this.props

    if (!account) return null

    return (
      <StatusList
        scrollKey='account_timeline'
        statusIds={statusIds}
        featuredStatusIds={featuredStatusIds}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={this.handleLoadMore}
        emptyMessage={intl.formatMessage(messages.empty)}
      />
    )
  }

}
