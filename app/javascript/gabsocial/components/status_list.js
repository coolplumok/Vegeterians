import { Fragment } from 'react'
import { Map as ImmutableMap, List as ImmutableList } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { createSelector } from 'reselect'
import debounce from 'lodash.debounce'
import { me, promotions } from '../initial_state'
import { dequeueTimeline } from '../actions/timelines'
import { scrollTopTimeline } from '../actions/timelines'
import { fetchStatus, fetchContext } from '../actions/statuses'
import StatusContainer from '../containers/status_container'
import ScrollableList from './scrollable_list'
import TimelineQueueButtonHeader from './timeline_queue_button_header'
import ColumnIndicator from './column_indicator'

const makeGetStatusIds = () => createSelector([
  (state, { type, id }) => state.getIn(['settings', type], ImmutableMap()),
  (state, { type, id }) => state.getIn(['timelines', id, 'items'], ImmutableList()),
  (state) => state.get('statuses'),
], (columnSettings, statusIds, statuses) => {
  return statusIds.filter(id => {
    if (id === null) return true

    const statusForId = statuses.get(id)
    let showStatus = true

    if (columnSettings.getIn(['shows', 'reblog']) === false) {
      showStatus = showStatus && statusForId.get('reblog') === null
    }

    if (columnSettings.getIn(['shows', 'reply']) === false) {
      showStatus = showStatus && (statusForId.get('in_reply_to_id') === null || statusForId.get('in_reply_to_account_id') === me)
    }

    return showStatus
  })
})

const mapStateToProps = (state, { timelineId }) => {
  if (!timelineId) return {}

  const getStatusIds = makeGetStatusIds()

  const statusIds = getStatusIds(state, {
    type: timelineId.substring(0, 5) === 'group' ? 'group' : timelineId,
    id: timelineId
  })

  const promotedStatuses = Array.isArray(promotions) ?
    promotions.map((block) => {
      const s = {}
      s[block.status_id] = state.getIn(['statuses', block.status_id])
      return s
    }) : []

  return {
    statusIds,
    promotedStatuses,
    isLoading: state.getIn(['timelines', timelineId, 'isLoading'], true),
    isPartial: state.getIn(['timelines', timelineId, 'isPartial'], false),
    hasMore: state.getIn(['timelines', timelineId, 'hasMore']),
    totalQueuedItemsCount: state.getIn(['timelines', timelineId, 'totalQueuedItemsCount']),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDequeueTimeline(timelineId) {
    dispatch(dequeueTimeline(timelineId, ownProps.onLoadMore))
  },
  onScrollToTop: debounce(() => {
    dispatch(scrollTopTimeline(ownProps.timelineId, true))
  }, 100),
  onScroll: debounce(() => {
    dispatch(scrollTopTimeline(ownProps.timelineId, false))
  }, 100),
  onFetchContext(statusId) {
    dispatch(fetchContext(statusId, true))
  },
  onFetchStatus(statusId) {
    dispatch(fetchStatus(statusId))
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
class StatusList extends ImmutablePureComponent {

  static propTypes = {
    scrollKey: PropTypes.string.isRequired,
    statusIds: ImmutablePropTypes.list.isRequired,
    featuredStatusIds: ImmutablePropTypes.list,
    onLoadMore: PropTypes.func,
    isLoading: PropTypes.bool,
    isPartial: PropTypes.bool,
    hasMore: PropTypes.bool,
    emptyMessage: PropTypes.string,
    timelineId: PropTypes.string,
    queuedItemSize: PropTypes.number,
    group: ImmutablePropTypes.map,
    onDequeueTimeline: PropTypes.func.isRequired,
    onScrollToTop: PropTypes.func.isRequired,
    onScroll: PropTypes.func.isRequired,
    onFetchContext: PropTypes.func.isRequired,
    onFetchStatus: PropTypes.func.isRequired,
    promotedStatuses: PropTypes.object,
  }

  state = {
    refreshing: false,
    fetchedContext: false,
  }

  componentDidMount() {
    this.handleDequeueTimeline()
    this.fetchPromotedStatus()
  }

  fetchPromotedStatus() {
    const {
      onFetchStatus,
      promotedStatuses,
      timelineId,
      statusIds,
    } = this.props

    if (Array.isArray(promotions)) {
      promotions.forEach((promotionBlock) => {

        if (promotionBlock.timeline_id === timelineId &&
            statusIds.count() >= promotionBlock.position &&
            !promotedStatuses[promotionBlock.status_id]) {
          onFetchStatus(promotionBlock.status_id)
        }

      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.refreshing) {
      this.setState({ refreshing: false })
    }

    if (prevProps.statusIds.count() < this.props.statusIds.count()) {
      this.fetchPromotedStatus()
    }
  }

  fetchContextsForInitialStatuses = (statusIds) => {
    for (let i = 0; i < statusIds.length; i++) {
      const statusId = statusIds[i]
      this.props.onFetchContext(statusId)
    }
    this.setState({ fetchedContext: true })
  }

  getFeaturedStatusCount = () => {
    return this.props.featuredStatusIds ? this.props.featuredStatusIds.size : 0
  }

  getCurrentStatusIndex = (id, featured) => {
    if (featured) {
      return this.props.featuredStatusIds.indexOf(id)
    }

    return this.props.statusIds.indexOf(id) + this.getFeaturedStatusCount()
  }

  handleMoveUp = (id, featured) => {
    const elementIndex = this.getCurrentStatusIndex(id, featured) - 1
    this._selectChild(elementIndex, true)
  }

  handleMoveDown = (id, featured) => {
    const elementIndex = this.getCurrentStatusIndex(id, featured) + 1
    this._selectChild(elementIndex, false)
  }

  handleLoadOlder = debounce(() => {
    this.props.onLoadMore(this.props.statusIds.size > 0 ? this.props.statusIds.last() : undefined)
  }, 300, { leading: true })

  handleOnReload = debounce(() => {
    // Only pull to refresh on home timeline for now
    if (this.props.scrollKey === 'home_timeline' && !this.state.refreshing) {
      this.props.onLoadMore()
      this.setState({ refreshing: true })
    }
  }, 300, { trailing: true })

  _selectChild(index, align_top) {
    const container = this.node.node
    const element = container.querySelector(`article:nth-of-type(${index + 1}) .focusable`)

    if (element) {
      if (align_top && container.scrollTop > element.offsetTop) {
        element.scrollIntoView(true)
      } else if (!align_top && container.scrollTop + container.clientHeight < element.offsetTop + element.offsetHeight) {
        element.scrollIntoView(false)
      }
      element.focus()
    }
  }

  handleDequeueTimeline = () => {
    const { onDequeueTimeline, timelineId } = this.props
    if (!onDequeueTimeline || !timelineId) return

    onDequeueTimeline(timelineId)
  }

  setRef = c => {
    this.node = c
  }

  render() {
    const {
      statusIds,
      featuredStatusIds,
      onLoadMore,
      timelineId,
      totalQueuedItemsCount,
      isLoading,
      isPartial,
      group,
      promotedStatuses,
      ...other
    } = this.props
    const { fetchedContext, refreshing } = this.state

    if (isPartial) {
      return <ColumnIndicator type='loading' />
    }

    // : hack :
    // if index is 0 or 1 and is comment, preload context
    if (statusIds && !fetchedContext) {
      const firstStatusId = statusIds.get(0)
      const secondStatusId = statusIds.get(1)
      let arr = []

      if (!!firstStatusId) arr.push(firstStatusId)
      if (!!secondStatusId) arr.push(secondStatusId)
      if (arr.length > 0) this.fetchContextsForInitialStatuses(arr)
    }

    let scrollableContent = []

    if (isLoading || statusIds.size > 0) {
      for (let i = 0; i < statusIds.count(); i++) {
        const statusId = statusIds.get(i)
        if (!statusId) {
          scrollableContent.push(
            <div
              key={'gap:' + statusIds.get(i + 1)}
              disabled={isLoading}
              maxId={i > 0 ? statusIds.get(i - 1) : null}
              onClick={onLoadMore}
            />
          )
        } else {
          if (Array.isArray(promotions)) {
            const promotionBlock = promotions.find(p => (p.position === i && p.timeline_id === timelineId))
            if (promotionBlock) {
              scrollableContent.push(
                <StatusContainer
                  key={`promotion-${i}-${promotionBlock.status_id}`}
                  id={promotionBlock.status_id}
                  onMoveUp={this.handleMoveUp}
                  onMoveDown={this.handleMoveDown}
                  contextType={timelineId}
                  commentsLimited
                  isPromoted
                />
              )
            }
          }
          scrollableContent.push(
            <StatusContainer
              key={`${statusId}-${i}`}
              id={statusId}
              onMoveUp={this.handleMoveUp}
              onMoveDown={this.handleMoveDown}
              contextType={timelineId}
              commentsLimited
            />
          )
        }

      }
    }

    if (scrollableContent && featuredStatusIds) {
      scrollableContent = featuredStatusIds.map((statusId) => (
        <StatusContainer
          key={`f-${statusId}`}
          id={statusId}
          isFeatured
          onMoveUp={this.handleMoveUp}
          onMoveDown={this.handleMoveDown}
          contextType={timelineId}
          commentsLimited
        />
      )).concat(scrollableContent)
    }

    return (
      <Fragment>
        <TimelineQueueButtonHeader
          onClick={this.handleDequeueTimeline}
          count={totalQueuedItemsCount}
          itemType='post'
        />
        <ScrollableList
          ref={this.setRef}
          isLoading={isLoading}
          showLoading={(isLoading && statusIds.size === 0) || refreshing}
          onLoadMore={onLoadMore && this.handleLoadOlder}
          onReload={this.handleOnReload}
          {...other}
        >
          {scrollableContent}
        </ScrollableList>
      </Fragment>
    )
  }

}
