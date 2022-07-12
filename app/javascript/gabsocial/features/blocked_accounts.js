import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import debounce from 'lodash.debounce'
import { me } from '../initial_state'
import { fetchBlocks, expandBlocks } from '../actions/blocks'
import Account from '../components/account'
import Block from '../components/block'
import Heading from '../components/heading'
import ScrollableList from '../components/scrollable_list'

const messages = defineMessages({
  empty: { id: 'empty_column.blocks', defaultMessage: 'You haven\'t blocked any users yet.' },
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
})

const mapStateToProps = (state) => ({
  accountIds: state.getIn(['user_lists', 'blocks', me, 'items']),
  hasMore: !!state.getIn(['user_lists', 'blocks', me, 'next']),
  isLoading: state.getIn(['user_lists', 'blocks', me, 'isLoading']),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchBlocks: () => dispatch(fetchBlocks()),
  onExpandBlocks: () => dispatch(expandBlocks()),
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class Blocks extends ImmutablePureComponent {

  static propTypes = {
    accountIds: ImmutablePropTypes.list,
    hasMore: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    onExpandBlocks: PropTypes.func.isRequired,
    onFetchBlocks: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.onFetchBlocks()
  }

  handleLoadMore = debounce(() => {
    this.props.onExpandBlocks()
  }, 300, { leading: true })

  render() {
    const {
      intl,
      accountIds,
      hasMore,
      isLoading,
    } = this.props

    const emptyMessage = intl.formatMessage(messages.empty)

    return (
      <Block>
        <div className={[_s.default, _s.px15, _s.py10, _s.justifyContentCenter].join(' ')}>
          <Heading size='h2'>
            {intl.formatMessage(messages.blocks)}
          </Heading>
        </div>
        <ScrollableList
          scrollKey='blocked_accounts'
          onLoadMore={this.handleLoadMore}
          hasMore={hasMore}
          isLoading={isLoading}
          emptyMessage={emptyMessage}
        >
          {
            accountIds && accountIds.map((id) =>
              <Account
                key={`blocked-accounts-${id}`}
                id={id}
                compact
              />
            )
          }
        </ScrollableList>
      </Block>
    )
  }

}
