import { injectIntl, defineMessages } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { fetchGabTrends } from '../../actions/gab_trends'
import PanelLayout from './panel_layout'
import ScrollableList from '../scrollable_list'
import TrendsItem from '../trends_item'

const messages = defineMessages({
  title: { id: 'trends.title', defaultMessage: 'Trending right now' },
})

const mapStateToProps = (state) => ({
  isError: state.getIn(['gab_trends', 'feed', 'isError']),
  isLoading: state.getIn(['gab_trends', 'feed', 'isLoading']),
  items: state.getIn(['gab_trends', 'feed', 'items']),
})

const mapDispatchToProps = (dispatch) => ({
  onfetchGabTrends: () => dispatch(fetchGabTrends('feed')),
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class TrendsPanel extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    isError: PropTypes.bool,
    isLoading: PropTypes.bool,
    items: ImmutablePropTypes.list.isRequired,
    onfetchGabTrends: PropTypes.func.isRequired,
  }

  updateOnProps = [
    'items',
    'isLoading',
    'isError',
  ]

  componentDidMount() {
    this.props.onfetchGabTrends()
  }

  render() {
    const {
      intl,
      isError,
      isLoading,
      items,
    } = this.props

    if (isError) return null

    if (1) return null

    return (
      <PanelLayout
        noPadding
        title={intl.formatMessage(messages.title)}
      >
        <ScrollableList
          isLoading={isLoading}
          scrollKey='trending-items'
        >
          {
            items.slice(0, 8).map((trend, i) => (
              <TrendsItem
                key={`post-trend-${i}`}
                index={i + 1}
                isLast={i === 7}
                title={trend.get('title')}
                description={trend.get('description')}
                url={trend.get('url')}
                author={trend.getIn(['author', 'name'], '')}
                date={trend.get('date_published')}
              />
            ))
          }
        </ScrollableList>
      </PanelLayout>
    )
  }
}
