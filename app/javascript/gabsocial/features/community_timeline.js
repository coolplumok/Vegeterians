import { defineMessages, injectIntl } from 'react-intl'
import { expandCommunityTimeline } from '../actions/timelines'
import StatusList from '../components/status_list'

const messages = defineMessages({
  empty: { id: 'empty_column.community', defaultMessage: 'The community timeline is empty. Write something publicly to get the ball rolling!' },
})

const mapStateToProps = (state) => ({
  onlyMedia: state.getIn(['settings', 'community', 'other', 'onlyMedia'])
})

export default
@connect(mapStateToProps)
@injectIntl
class CommunityTimeline extends PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    onlyMedia: PropTypes.bool,
  }

  componentDidMount () {
    const { dispatch, onlyMedia } = this.props

    dispatch(expandCommunityTimeline({ onlyMedia }))
  }

  componentDidUpdate (prevProps) {
    if (prevProps.onlyMedia !== this.props.onlyMedia) {
      const { dispatch, onlyMedia } = this.props

      dispatch(expandCommunityTimeline({ onlyMedia }))
    }
  }

  handleLoadMore = maxId => {
    const { dispatch, onlyMedia } = this.props

    dispatch(expandCommunityTimeline({ maxId, onlyMedia }))
  }

  render () {
    const { intl, onlyMedia } = this.props

    const emptyMessage = intl.formatMessage(messages.empty)

    return (
      <StatusList
        scrollKey='community_timeline'
        timelineId={`community${onlyMedia ? ':media' : ''}`}
        onLoadMore={this.handleLoadMore}
        emptyMessage={emptyMessage}
      />
    )
  }

}
