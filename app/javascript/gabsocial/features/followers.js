import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import debounce from 'lodash.debounce'
import { defineMessages, injectIntl } from 'react-intl'
import {
  fetchFollowers,
  expandFollowers,
} from '../actions/accounts'
import Account from '../components/account'
import ScrollableList from '../components/scrollable_list'
import Block from '../components/block'
import Heading from '../components/heading'

const mapStateToProps = (state, { account }) => {
  const accountId = !!account ? account.get('id') : -1

  return {
    accountId,
    accountIds: state.getIn(['user_lists', 'followers', accountId, 'items']),
    hasMore: !!state.getIn(['user_lists', 'followers', accountId, 'next']),
    isLoading: state.getIn(['user_lists', 'followers', accountId, 'isLoading']),
  }
}

const messages = defineMessages({
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  empty: { id: 'account.followers.empty', defaultMessage: 'No one follows this user yet.' },
})

export default
@connect(mapStateToProps)
@injectIntl
class Followers extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    accountId: PropTypes.string,
    intl: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.list,
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
  }

  componentWillMount() {
    const { accountId } = this.props

    if (accountId && accountId !== -1) {
      this.props.dispatch(fetchFollowers(accountId))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!!nextProps.accountId && nextProps.accountId !== -1 && nextProps.accountId !== this.props.accountId) {
      this.props.dispatch(fetchFollowers(nextProps.accountId))
    }
  }

  handleLoadMore = debounce(() => {
    const { accountId } = this.props
    if (!!accountId && accountId !== -1) {
      this.props.dispatch(expandFollowers(accountId))
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
            {intl.formatMessage(messages.followers)}
          </Heading>
        </div>
        <div className={[_s.default, _s.py10].join(' ')}>
          <ScrollableList
            scrollKey='followers'
            hasMore={hasMore}
            isLoading={isLoading}
            onLoadMore={this.handleLoadMore}
            emptyMessage={intl.formatMessage(messages.empty)}
          >
            {
              accountIds && accountIds.map((id) => (
                <Account key={`follower-${id}`} id={id} compact withBio />
              ))
            }
          </ScrollableList>
        </div>
      </Block>
    )
  }

}
