import { Fragment } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { FormattedMessage } from 'react-intl'
import { connectListStream } from '../actions/streaming'
import { expandListTimeline } from '../actions/timelines'
import { fetchList, deleteList } from '../actions/lists'
import { openModal } from '../actions/modal'
import StatusList from '../components/status_list'
import ColumnIndicator from '../components/column_indicator'
import Button from '../components/button'
import Text from '../components/text'
import Block from '../components/block'

const mapStateToProps = (state, props) => ({
  list: state.getIn(['lists', props.params.id]),
})

export default
@connect(mapStateToProps)
class ListTimeline extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    list: PropTypes.oneOfType([
      ImmutablePropTypes.map,
      PropTypes.bool,
    ]),
    intl: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.handleConnect(this.props.params.id)
  }

  componentWillUnmount() {
    this.handleDisconnect()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id !== this.props.params.id) {
      this.handleDisconnect()
      this.handleConnect(nextProps.params.id)
    }
  }

  handleConnect(id) {
    const { dispatch } = this.props

    dispatch(fetchList(id))
    dispatch(expandListTimeline(id))

    this.disconnect = dispatch(connectListStream(id))
  }

  handleDisconnect() {
    if (this.disconnect) {
      this.disconnect()
      this.disconnect = null
    }
  }

  handleLoadMore = (maxId) => {
    const { id } = this.props.params
    this.props.dispatch(expandListTimeline(id, { maxId }))
  }

  handleEditClick = () => {
    // console.log("handleEditClick:", this.props.params.id)
    this.props.dispatch(openModal('LIST_EDITOR', { id: this.props.params.id }))
  }

  render() {
    const { list } = this.props
    const { id } = this.props.params
    const title = list ? list.get('title') : id

    if (typeof list === 'undefined') {
      return <ColumnIndicator type='loading' />
    } else if (list === false) {
      return <ColumnIndicator type='missing' />
    }

    const emptyMessage = (
      <div className={[_s.default, _s.py15, _s.px15, _s.alignItemsCenter].join(' ')}>
        <FormattedMessage
          id='empty_column.list'
          defaultMessage='There is nothing in this list yet. When members of this list post new statuses, they will appear here.'
        />

        <div className={_s.mt10}>
          <Button
            onClick={this.handleEditClick}
            className={[_s.mt10]}
          >
            <Text color='inherit' align='center'>
              <FormattedMessage id='list.click_to_add' defaultMessage='Click here to add people' />
            </Text>
          </Button>
        </div>
      </div>
    )

    return (
      <StatusList
        scrollKey='list_timeline'
        timelineId={`list:${id}`}
        onLoadMore={this.handleLoadMore}
        emptyMessage={emptyMessage}
      />
    )
  }

}
