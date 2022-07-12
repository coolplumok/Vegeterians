import { defineMessages, injectIntl } from 'react-intl'
import { fetchPopularSuggestions } from '../../actions/suggestions'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Account from '../account'
import PanelLayout from './panel_layout'

const messages = defineMessages({
  dismissSuggestion: { id: 'suggestions.dismiss', defaultMessage: 'Dismiss suggestion' },
  title: { id: 'who_to_follow.title', defaultMessage: 'Who to Follow' },
  show_more: { id: 'who_to_follow.more', defaultMessage: 'Load more' },
})

const mapStateToProps = (state) => ({
  suggestions: state.getIn(['suggestions', 'verified', 'items']),
})

const mapDispatchToProps = (dispatch) => ({
  fetchPopularSuggestions: () => dispatch(fetchPopularSuggestions()),
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class VerifiedAccountsPanel extends ImmutablePureComponent {

  static propTypes = {
    fetchPopularSuggestions: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    suggestions: ImmutablePropTypes.list.isRequired,
    isLazy: PropTypes.bool,
  }

  state = {
    fetched: !this.props.isLazy,
    visible:5
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
      this.props.fetchPopularSuggestions()
    }
  }

  componentDidMount() {
    if (!this.props.isLazy) {
      this.props.fetchPopularSuggestions()
    }
  }

  loadMore = () => { 
    this.setState((prev) => {
      return {visible: prev.visible + 3};
    });
  }

  render() {
    const { intl, suggestions } = this.props
    const {visible} = this.state

    if (suggestions.isEmpty()) return null

    return (
      <PanelLayout
        noPadding
        title={intl.formatMessage(messages.title)}
        footerButtonTitle={intl.formatMessage(messages.show_more)}
        footerButtonTo='/home'
        loadMore={this.loadMore}
        loadMore_btn ={suggestions.size}
        visible={visible}
      >
        <div className={_s.default}>
          { 
            suggestions.slice(0,visible).map(accountId => (
              <Account
                compact
                key={accountId}
                id={accountId}
              />
            ))
          }
        </div>
      </PanelLayout>
    )
  }
}