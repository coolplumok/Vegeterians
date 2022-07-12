import { defineMessages, injectIntl } from 'react-intl'
import {
  fetchRelatedSuggestions,
  dismissRelatedSuggestion,
} from '../../actions/suggestions'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Account from '../../components/account'
import PanelLayout from './panel_layout'

const messages = defineMessages({
  dismissSuggestion: { id: 'suggestions.dismiss', defaultMessage: 'Dismiss suggestion' },
  title: { id: 'who_to_follow.title', defaultMessage: 'Who to Follow' },
  show_more: { id: 'who_to_follow.more', defaultMessage: 'Show more' },
})

const mapStateToProps = (state) => ({
  suggestions: state.getIn(['suggestions', 'related', 'items']),
})

const mapDispatchToProps = (dispatch) => ({
  fetchRelatedSuggestions: () => dispatch(fetchRelatedSuggestions()),
  dismissRelatedSuggestion: (account) => dispatch(dismissRelatedSuggestion(account.get('id'))),
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class WhoToFollowPanel extends ImmutablePureComponent {

  static propTypes = {
    dismissRelatedSuggestion: PropTypes.func.isRequired,
    fetchRelatedSuggestions: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    suggestions: ImmutablePropTypes.list.isRequired,
    isLazy: PropTypes.bool,
  }

  state = {
    fetched: !this.props.isLazy,
  }

  updateOnProps = [
    'suggestions',
    'isLazy',
    'shouldLoad',
  ]

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.shouldLoad && !prevState.fetched) {
      return { fetched: true }
    }

    return null
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.fetched && this.state.fetched) {
      this.props.fetchRelatedSuggestions()
    }
  }

  componentDidMount() {
    if (!this.props.isLazy) {
      this.props.fetchRelatedSuggestions()
    }
  }

  render() {
    const {
      intl,
      suggestions,
      dismissRelatedSuggestion,
    } = this.props

    if (suggestions.isEmpty()) return null

    return (
      <PanelLayout
        noPadding
        title={intl.formatMessage(messages.title)}
        footerButtonTitle={intl.formatMessage(messages.show_more)}
        footerButtonTo='/explore'
      >
        <div className={_s.default}>
          {
            suggestions.map(accountId => (
              <Account
                compact
                showDismiss
                key={accountId}
                id={accountId}
                dismissAction={dismissRelatedSuggestion}
              />
            ))
          }
        </div>
      </PanelLayout>
    )
  }
}