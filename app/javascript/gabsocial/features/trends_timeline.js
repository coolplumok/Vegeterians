import { defineMessages, injectIntl } from 'react-intl'
import { expandTrendsTimeline } from '../actions/timelines'
import { connectTrendsStream } from '../actions/streaming'
import StatusList from '../components/status_list'

const messages = defineMessages({
  empty: { id: 'empty_column.trends', defaultMessage: 'The Vegeterians news is empty.' },
})

export default
@injectIntl
@connect(null)
class TrendsTimeline extends PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  }

  componentDidMount () {
    const { dispatch } = this.props

    dispatch(expandTrendsTimeline())

    this.disconnect = dispatch(connectTrendsStream())
  }

  componentWillUnmount() {
	if (this.disconnect) {
	  this.disconnect()
	  this.disconnect = null
    }
  }
  
  handleLoadMore = (maxId) => {
    const { dispatch } = this.props

    dispatch(expandTrendsTimeline({ maxId }))
  }

  render () {
    const { intl } = this.props

    const emptyMessage = intl.formatMessage(messages.empty)

    return (
      <StatusList
        scrollKey='trends_timeline'
        timelineId='trends'
        onLoadMore={this.handleLoadMore}
        emptyMessage={emptyMessage}
      />
    )
  }
}