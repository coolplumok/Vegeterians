import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import { getOrderedLists } from '../selectors'
import { fetchLists } from '../actions/lists'
import ColumnIndicator from '../components/column_indicator'
import List from '../components/list'

const messages = defineMessages({
  add: { id: 'lists.new.create', defaultMessage: 'Add List' },
  empty: { id: 'empty_column.lists', defaultMessage: 'You don\'t have any lists yet. When you create one, it will show up here.' },
})

const mapStateToProps = (state) => ({
  lists: getOrderedLists(state),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchLists: () => dispatch(fetchLists()),
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class ListsDirectory extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    lists: ImmutablePropTypes.list,
    onFetchLists: PropTypes.func.isRequired,
  }

  state = {
    fetched: false,
  }

  updateOnProps = [
    'lists',
  ]

  componentDidMount() {
    this.props.onFetchLists()
      .then(() => this.setState({ fetched: true }))
      .catch(() => this.setState({ fetched: true }))
  }

  render() {
    const { intl, lists } = this.props
    const { fetched } = this.state

    if (lists.size === 0 && !fetched) {
      return <ColumnIndicator type='loading' />
    }

    const emptyMessage = intl.formatMessage(messages.empty)

    const listItems = lists.map(list => ({
      to: `/lists/${list.get('id')}`,
      title: list.get('title'),
    }))

    return (
      <List
        scrollKey='lists'
        emptyMessage={emptyMessage}
        items={listItems}
      />
    )
  }

}