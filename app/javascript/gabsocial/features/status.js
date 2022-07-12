import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import {
  fetchStatus,
  fetchComments,
  fetchContext,
} from '../actions/statuses'
import StatusContainer from '../containers/status_container'
import ColumnIndicator from '../components/column_indicator'

const mapStateToProps = (state, props) => {
  const statusId = props.id || props.params.statusId

  return {
    status: state.getIn(['statuses', statusId]),
  }
}

const mapDispatchToProps = (dispatch) => ({
  onFetchStatus: (id) => dispatch(fetchStatus(id)),
  onFetchContext: (id) => dispatch(fetchContext(id)),
  onFetchComments: (id) => dispatch(fetchComments(id)),
})

export default
@connect(mapStateToProps, mapDispatchToProps)
class Status extends ImmutablePureComponent {

  static propTypes = {
    onFetchContext: PropTypes.func.isRequired,
    onFetchStatus: PropTypes.func.isRequired,
    onFetchComments: PropTypes.func.isRequired,
    params: PropTypes.object,
    status: ImmutablePropTypes.map,
  }

  updateOnProps = [
    'params',
    'status',
  ]

  componentDidMount() {
    const statusId = this.props.id || this.props.params.statusId
    this.props.onFetchStatus(statusId)

    if (!!this.props.status) {
      this.shouldFetchStatusParts(this.props.status)
    }
  }

  componentDidUpdate(prevProps) {
    const { status } = this.props

    if (prevProps.status !== status && !!status) {
      this.shouldFetchStatusParts(status)
    }
  }

  shouldFetchStatusParts = (status) => {
    if (!status) return

    const isComment = !!status.get('in_reply_to_account_id')
    const hasComments = status.get('replies_count') > 0 

    if (isComment) {
      this.props.onFetchContext(status.get('id'))
    } else if (!isComment && hasComments) {
      this.props.onFetchComments(status.get('id'))
    }
  }

  render() {
    const { status } = this.props
  
    if (!status) {
      return <ColumnIndicator type='loading' />
    }

    return (
      <StatusContainer {...this.props} contextType='feature' />
    )
  }

}
