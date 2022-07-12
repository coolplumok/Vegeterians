import { defineMessages, injectIntl } from 'react-intl'
import { expandProTimeline } from '../actions/timelines'
import { connectProStream } from '../actions/streaming'
import StatusList from '../components/status_list'

const messages = defineMessages({
  empty: { id: 'empty_column.pro', defaultMessage: 'The pro timeline is empty.' },
})

export default
@injectIntl
@connect(null)
class ProTimeline extends PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  }

  componentDidMount () {
    const { dispatch } = this.props

    dispatch(expandProTimeline())

    this.disconnect = dispatch(connectProStream())
  }

  componentWillUnmount() {
		if (this.disconnect) {
			this.disconnect()
			this.disconnect = null
		}
  }
  
  handleLoadMore = (maxId) => {
    const { dispatch } = this.props

    dispatch(expandProTimeline({ maxId }))
  }

  render () {
    const { intl } = this.props

    const emptyMessage = intl.formatMessage(messages.empty)

    return (
      <StatusList
        scrollKey='pro_timeline'
        timelineId='pro'
        onLoadMore={this.handleLoadMore}
        emptyMessage={emptyMessage}
      />
    )
  }

}
