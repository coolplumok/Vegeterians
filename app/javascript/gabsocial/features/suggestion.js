import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import debounce from 'lodash.debounce'
import { defineMessages, injectIntl } from 'react-intl'
import { me } from '../initial_state';
import {
  fetchSuggestion,
  expandSuggestion,
} from '../actions/accounts'
import Account from '../components/account'
import ScrollableList from '../components/scrollable_list'
import Block from '../components/block'
import Heading from '../components/heading'

const mapStateToProps = (state) => {
  const accountId = !!me ? me : -1

  return {
    accountId,
    accountIds: state.getIn(['user_lists', 'suggestion', accountId, 'items']),
    hasMore: !!state.getIn(['user_lists', 'suggestion', accountId, 'next']),
    isLoading: state.getIn(['user_lists', 'suggestion', accountId, 'isLoading']),
  }
}

const messages = defineMessages({
  suggestion: { id: 'account.suggestion', defaultMessage: 'Who to Follow' },
  empty: { id: 'account.suggestion.empty', defaultMessage: 'There is no user to follow yet.' },
  load_more: { id: 'account.load_more', defaultMessage: 'View more' },
})

export default
@connect(mapStateToProps)
@injectIntl
class Suggestion extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.list,
    accountId: PropTypes.string,
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
  }

  componentDidMount() {
    const { accountId } = this.props

    if (!!accountId && accountId !== -1) {
      this.props.dispatch(fetchSuggestion(accountId))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!!nextProps.accountId && nextProps.accountId !== -1 && nextProps.accountId !== this.props.accountId) {
      this.props.dispatch(fetchSuggestion(nextProps.accountId))
    }
  }

  handleLoadMore = debounce(() => {
    const { accountId } = this.props
    if (!!accountId && accountId !== -1) {
      this.props.dispatch(expandSuggestion(accountId))
    }
  }, 300, { leading: true })

  render() {
    const {
      accountId,
      accountIds,
      hasMore,
      intl,
      isLoading,
    } = this.props

    if (!accountId) return null

    return (
      <Block>
        <div className={[_s.default, _s.px15, _s.py10, _s.justifyContentCenter].join(' ')}>
          <Heading size='h2'>
            {intl.formatMessage(messages.suggestion)}
          </Heading>
        </div>
        <div className={[_s.default, _s.py10].join(' ')}>
          <ScrollableList
            scrollKey='suggestion'
            hasMore={hasMore}
            isLoading={isLoading}
            onLoadMore={this.handleLoadMore}
            emptyMessage={intl.formatMessage(messages.empty)}
            loadmoreMessage={intl.formatMessage(messages.load_more)}
            twoColumns={true}
          >
            {
              accountIds && accountIds.map((id) => (
                <Account key={`suggestion-${id}`} id={id} compact />
              ))
            }
          </ScrollableList>
        </div>
      </Block>
    )
  }

}