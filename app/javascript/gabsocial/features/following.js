import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import debounce from 'lodash.debounce'
import { defineMessages, injectIntl } from 'react-intl'
import {
  fetchFollowing,
  expandFollowing,
} from '../actions/accounts'
import Account from '../components/account'
import ScrollableList from '../components/scrollable_list'
import Block from '../components/block'
import Heading from '../components/heading'

const mapStateToProps = (state, { account }) => {
  const accountId = !!account ? account.get('id') : -1

  return {
    accountId,
    accountIds: state.getIn(['user_lists', 'following', accountId, 'items']),
    hasMore: !!state.getIn(['user_lists', 'following', accountId, 'next']),
    isLoading: state.getIn(['user_lists', 'following', accountId, 'isLoading']),
  }
}

const messages = defineMessages({
  follows: { id: 'account.follows', defaultMessage: 'Following' },
  empty: { id: 'account.follows.empty', defaultMessage: 'This user doesn\'t follow anyone yet.' },
})

export default
@connect(mapStateToProps)
@injectIntl
class Following extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.list,
    account: ImmutablePropTypes.map,
    accountId: PropTypes.string,
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
  }

  componentDidMount() {
    const { accountId } = this.props

    if (!!accountId && accountId !== -1) {
      this.props.dispatch(fetchFollowing(accountId))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!!nextProps.accountId && nextProps.accountId !== -1 && nextProps.accountId !== this.props.accountId) {
      this.props.dispatch(fetchFollowing(nextProps.accountId))
    }
  }

  handleLoadMore = debounce(() => {
    const { accountId } = this.props
    if (!!accountId && accountId !== -1) {
      this.props.dispatch(expandFollowing(accountId))
    }
  }, 300, { leading: true })

  render() {
    const {
      account,
      accountIds,
      hasMore,
      intl,
      isLoading,
    } = this.props

    if (!account) return null

    return (
      <Block>
        <div className={[_s.default, _s.px15, _s.py10, _s.justifyContentCenter].join(' ')}>
          <Heading size='h2'>
            {intl.formatMessage(messages.follows)}
          </Heading>
        </div>
        <div className={[_s.default, _s.py10].join(' ')}>
          <ScrollableList
            scrollKey='following'
            hasMore={hasMore}
            isLoading={isLoading}
            onLoadMore={this.handleLoadMore}
            emptyMessage={intl.formatMessage(messages.empty)}
          >
            {
              accountIds && accountIds.map((id) => (
                <Account key={`following-${id}`} id={id} compact withBio />
              ))
            }
          </ScrollableList>
        </div>
      </Block>
    )
  }

}