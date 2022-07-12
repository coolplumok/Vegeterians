import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import { getOrderedLists } from '../selectors'
import ColumnIndicator from '../components/column_indicator'
import Post from '../components/post'
import axios from 'axios';

export default
@injectIntl
class PostsDirectory extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    lists: ImmutablePropTypes.list,
  }

  state = {
    fetched: false,
  }

  componentDidMount() {
    axios.get('/api/v1/boosted_post')
    .then(response => {
      this.setState({ allposts: response.data });
      if (response.data.message == "false") {
        alert("You Have Not any Boosted Post")
      }
    })
    axios.get('/api/v1/check_user_pro_plus')
    .then(response => {
      this.setState({ free_boosted_post: response.data.free_boosted_post });
    })
    axios.get('/api/v1/total_post')
    .then(response => {
      this.setState({ total_post_current_month: response.data});
    })
  }

  render() {
    const { intl, lists } = this.props
    const { fetched, allposts } = this.state
    if (allposts && allposts.length > 0) {
      const postItems = allposts.map(list => ({
      }))
    }
    let total_attempt_post = []
    if (this.state.total_post_current_month) {
      total_attempt_post.push(this.state.total_post_current_month)
    }
    else {
      total_attempt_post.push(this.state.total_post_current_month)
    }

    let total_boost_post = []
    if (allposts && allposts.length > 0) {
      total_boost_post.push(allposts[0].total_boost_posts)
    } 
    return (

      <div className="form-group">
        {allposts && (allposts.length > 0) &&
          <div>
            <span><img src="https://pluspng.com/img-png/png-energy-electric-electricity-energy-lightning-power-icon-512.png" style={{width: 50,height: 50}} />
              <span style={{position: 'absolute',top: 19}}>
                {this.state.free_boosted_post == "true" ? [
                  <div>
                    {total_attempt_post}
                  </div>
                  ] : [
                    <div>
                      0
                    </div>
                  ]
                }    
              </span>
            </span>
          </div>
        }  
        {allposts && allposts.length && 
          <Post
          scrollKey='lists'
          items={allposts}
          total_attempt_post={total_attempt_post}

          />
        }
      </div>
    )
  }

}