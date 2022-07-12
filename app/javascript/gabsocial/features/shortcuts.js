import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fetchShortcuts } from '../actions/shortcuts'
import ColumnIndicator from '../components/column_indicator'
import List from '../components/list'

const mapStateToProps = (state) => ({
  isError: state.getIn(['shortcuts', 'isError']),
  isLoading: state.getIn(['shortcuts', 'isLoading']),
  shortcuts: state.getIn(['shortcuts', 'items']),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchShortcuts() {
    dispatch(fetchShortcuts())
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
class Shortcuts extends ImmutablePureComponent {

  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
    onFetchShortcuts: PropTypes.func.isRequired,
    shortcuts: ImmutablePropTypes.list,
  }

  componentDidMount() {
    this.props.onFetchShortcuts()
  }

  render() {
    const {
      isLoading,
      isError,
      shortcuts,
    } = this.props

    if (isLoading) {
      return <ColumnIndicator type='loading' />
    } else if (isError) {
      return <ColumnIndicator type='error' message='Error fetching shortcuts' />
    }

    const listItems = shortcuts.map((s) => ({
      to: s.get('to'),
      title: s.get('title'),
      image: s.get('image'),
    }))

    return (
      <List
        scrollKey='shortcuts'
        emptyMessage='You have no shortcuts'
        items={listItems}
      />
    )
  }

}