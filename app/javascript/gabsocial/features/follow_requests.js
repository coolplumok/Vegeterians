import { FormattedMessage } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import debounce from 'lodash.debounce'
import { me } from '../initial_state'
import { fetchFollowRequests, expandFollowRequests } from '../actions/accounts'
import AccountAuthorize from '../components/account_authorize'
import Block from '../components/block'
import ScrollableList from '../components/scrollable_list'
import Text from '../components/text'

const mapStateToProps = (state) => ({
  accountIds: state.getIn(['user_lists', 'follow_requests', me, 'items']),
  isLoading: state.getIn(['user_lists', 'follow_requests', me, 'isLoading']),
  hasMore: !!state.getIn(['user_lists', 'follow_requests', me, 'next']),
  locked: !!state.getIn(['accounts', me, 'locked']),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchFollowRequests() {
    dispatch(fetchFollowRequests())
  },
  onExpandFollowRequests() {
    dispatch(expandFollowRequests())
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
class FollowRequests extends ImmutablePureComponent {

  static propTypes = {
    accountIds: ImmutablePropTypes.list,
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
    locked: PropTypes.bool,
    onFetchFollowRequests: PropTypes.func.isRequired,
    onExpandFollowRequests: PropTypes.func.isRequired,
  }

  componentWillMount () {
    this.props.onFetchFollowRequests()
  }

  handleLoadMore = debounce(() => {
    this.props.onExpandFollowRequests()
  }, 300, { leading: true })

  render () {
    const {
      accountIds,
      hasMore,
      isLoading,
      locked,
    } = this.props

    const unlockedPrependMessage = locked ? null : (
      <div className={[_s.default, _s.px15, _s.py15].join(' ')}>
        <Text>
          <FormattedMessage
            id='follow_requests.unlocked_explanation'
            defaultMessage='Even though your account is not locked, the {domain} staff thought you might want to review follow requests from these accounts manually.'
            values={{ domain: 'Vegeterians.live' }}
          />
        </Text>
      </div>
    )

    return (
      <Block>
        {unlockedPrependMessage}

        <ScrollableList
          scrollKey='follow_requests'
          onLoadMore={this.handleLoadMore}
          hasMore={hasMore}
          isLoading={isLoading}
          emptyMessage={<FormattedMessage id='empty_column.follow_requests' defaultMessage="You don't have any follow requests yet. When you receive one, it will show up here." />}
        >
          {
            accountIds && accountIds.map((id) =>
              <AccountAuthorize key={id} id={id} />
            )
          }
        </ScrollableList>
      </Block>
    )
  }

}
