import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import {
  fetchStatus,
  fetchComments,
  fetchContext,
} from '../actions/statuses'
import StatusContainer from '../containers/status_container'
import ColumnIndicator from '../components/column_indicator'
import axios from 'axios';

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
class PostItem extends ImmutablePureComponent {

  constructor() {
    super();
    this.state = {
    };
  }

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
    axios.get('/api/v1/total_post')
    .then(response => {
      this.setState({ total_post_current_month: response.data});
    });

    axios.get('/api/v1/check_user_pro_plus')
    .then(response => {
      this.setState({ free_boosted_post: response.data.free_boosted_post });
    });
    
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

  boostPost = (id) => {
    axios.get(`/api/v1/boost_again/${id}`)
    .then(response => {
      if (response.data.message.length != 0) {
        alert(response.data.message);
      }
      window.location = `/boosted/posts`
    })
  }

  render() {
    const { status } = this.props
    let total_attempt_post = []
    if (this.state.total_post_current_month) {
      total_attempt_post.push(this.state.total_post_current_month)
    }
    else {
      total_attempt_post.push(this.state.total_post_current_month)
    }
    
    if (!status) {
      return <ColumnIndicator type='loading' />
    }

    return (
      <div>
        {this.state.free_boosted_post == "true" ? [
          <div>
            { total_attempt_post == "0" ? [
              <div>
                <button style={{height: 20,backgroundColor: "#e92626", color: "white", border: "#e92626", borderRadius: 10, right: 84, position: 'absolute', zIndex: 9999}} className="btn btn-danger">Buy Boost</button>
              </div>
              ] : [
              <div>  
                <button style={{height: 20,backgroundColor: "#e92626", color: "white", border: "#e92626", borderRadius: 10, right: 84, position: 'absolute', zIndex: 9999}} className="btn btn-danger" onClick={() => {if(window.confirm('Boost again?')){this.boostPost(this.props.id)};}}>REBOOST</button>
              </div>
              ]
            }
          </div> ] : [
            <div>
              <div>
                <button style={{height: 20,backgroundColor: "#e92626", color: "white", border: "#e92626", borderRadius: 10, right: 84, position: 'absolute', zIndex: 9999}} className="btn btn-danger">Buy Boost</button>
              </div>
            </div>
          ]
        }     
        <StatusContainer {...this.props} contextType='feature' />    
      </div>      
    )
  }

}
