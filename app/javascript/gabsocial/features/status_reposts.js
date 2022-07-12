import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { FormattedMessage } from 'react-intl'
import { fetchReposts } from '../actions/interactions'
import { fetchStatus } from '../actions/statuses'
import { makeGetStatus } from '../selectors'
import Account from '../components/account'
import ColumnIndicator from '../components/column_indicator'
import ScrollableList from '../components/scrollable_list'

const mapStateToProps = (state, props) => {
  const getStatus = makeGetStatus()
  const status = getStatus(state, {
    id: props.params.statusId,
    username: props.params.username,
  })

  return {
    status,
    accountIds: state.getIn(['user_lists', 'reblogged_by', props.params.statusId]),
  }
}

export default
@connect(mapStateToProps)
class StatusReposts extends ImmutablePureComponent {

  static propTypes = {
    params: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    accountIds: ImmutablePropTypes.list,
    status: ImmutablePropTypes.map,
  }

  componentWillMount () {
    this.props.dispatch(fetchReposts(this.props.params.statusId))
    this.props.dispatch(fetchStatus(this.props.params.statusId))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.statusId !== this.props.params.statusId && nextProps.params.statusId) {
      this.props.dispatch(fetchReposts(nextProps.params.statusId))
      this.props.dispatch(fetchStatus(nextProps.params.statusId))
    }
  }

  render () {
    const { accountIds, status } = this.props

    if (!accountIds) {
      return <ColumnIndicator type='loading' />
    } else if (!status) {
      return <ColumnIndicator type='missing' />
    }

    return (
      <ScrollableList
        scrollKey='reposts'
        emptyMessage={<FormattedMessage id='status.reposts.empty' defaultMessage='No one has reposted this yet. When someone does, they will show up here.' />}
      >
        {
          accountIds.map(id =>
            <Account key={id} id={id} />
          )
        }
      </ScrollableList>
    )
  }

}
