import { defineMessages, injectIntl } from 'react-intl'
import { withRouter } from 'react-router-dom'
import throttle from 'lodash.throttle'
import {
  expandHomeTimeline,
  forceDequeueTimeline,
} from '../actions/timelines'
import StatusList from '../components/status_list'

const messages = defineMessages({
  title: { id: 'column.home', defaultMessage: 'Home' },
  empty: { id: 'empty_timeline.home', defaultMessage: 'Your home timeline is empty. Start following other users to receive their content here.' },
})

const mapStateToProps = (state) => ({
  isPartial: state.getIn(['timelines', 'home', 'isPartial']),
})

const mapDispatchToProps = (dispatch) => ({
  onExpandHomeTimeline(options) {
    if (!options) dispatch(forceDequeueTimeline('home'))
    dispatch(expandHomeTimeline(options))
  },
})

export default
@injectIntl
@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class HomeTimeline extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    isPartial: PropTypes.bool,
    onExpandHomeTimeline: PropTypes.func.isRequired,
  }

  componentDidMount () {
    this._checkIfReloadNeeded(false, this.props.isPartial)
  }

  componentDidUpdate (prevProps) {
    this._checkIfReloadNeeded(prevProps.isPartial, this.props.isPartial)
    
    //Check if clicked on "home" button, if so, reload
    if (prevProps.location.key !== this.props.location.key &&
        prevProps.location.pathname === '/home' &&
        this.props.location.pathname === '/home') {
      this.handleReload()
    }
  }

  componentWillUnmount () {
    this._stopPolling()
  }

  handleLoadMore = (maxId) => {
    this.props.onExpandHomeTimeline({ maxId })
  }

  handleReload = throttle(() => {
    this.props.onExpandHomeTimeline()
  }, 5000)

  _checkIfReloadNeeded (wasPartial, isPartial) {
    const { onExpandHomeTimeline } = this.props

    if (!wasPartial && isPartial) {
      this.polling = setInterval(() => {
        onExpandHomeTimeline()
      }, 3000)
    } else if (wasPartial && !isPartial) {
      this._stopPolling()
    }
  }

  _stopPolling () {
    if (this.polling) {
      clearInterval(this.polling)
      this.polling = null
    }
  }

  render () {
    const { intl } = this.props

    const emptyMessage = intl.formatMessage(messages.empty)

    return (
      <StatusList
        scrollKey='home_timeline'
        onLoadMore={this.handleLoadMore}
        timelineId='home'
        emptyMessage={emptyMessage}
      />
    )
  }

}