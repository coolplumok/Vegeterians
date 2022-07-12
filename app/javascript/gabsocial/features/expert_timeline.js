import { defineMessages, injectIntl } from 'react-intl'
import { expandExpertTimeline } from '../actions/timelines'
import { connectExpertStream } from '../actions/streaming'
import StatusList from '../components/status_list'

const messages = defineMessages({
  empty: { id: 'empty_column.expert', defaultMessage: 'The expert timeline is empty.' },
})

export default
@injectIntl
@connect(null)
class ExpertTimeline extends PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  }

  componentDidMount () {
    const { dispatch } = this.props

    dispatch(expandExpertTimeline())

    this.disconnect = dispatch(connectExpertStream())
  }

  componentWillUnmount() {
	if (this.disconnect) {
	  this.disconnect()
	  this.disconnect = null
    }
  }
  
  handleLoadMore = (maxId) => {
    const { dispatch } = this.props

    dispatch(expandExpertTimeline({ maxId }))
  }

  render () {
    const { intl } = this.props

    const emptyMessage = intl.formatMessage(messages.empty)

    return (
      <StatusList
        scrollKey='expert_timeline'
        timelineId='expert'
        onLoadMore={this.handleLoadMore}
        emptyMessage={emptyMessage}
      />
    )
  }
}