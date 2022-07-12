import { Fragment } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { HotKeys } from 'react-hotkeys'
import {
  CX,
  COMMENT_SORTING_TYPE_NEWEST,
  COMMENT_SORTING_TYPE_TOP,
} from '../constants'
import { me, displayMedia } from '../initial_state'
import scheduleIdleTask from '../utils/schedule_idle_task'
import ComposeFormContainer from '../features/compose/containers/compose_form_container'
import ResponsiveClassesComponent from '../features/ui/util/responsive_classes_component'
import StatusContent from './status_content'
import StatusPrepend from './status_prepend'
import StatusActionBar from './status_action_bar'
import StatusMedia from './status_media'
import StatusHeader from './status_header'
import CommentList from './comment_list'
import Button from './button'
import Text from './text'
import ColumnIndicator from './column_indicator'

// We use the component (and not the container) since we do not want
// to use the progress bar to show download progress
import Bundle from '../features/ui/util/bundle'
import axios from 'axios';

const messages = defineMessages({
  sortBy: { id: 'comment_sort.title', defaultMessage: 'Sort by' },
  oldest: { id: 'comment_sort.oldest', defaultMessage: 'Oldest' },
  newest: { id: 'comment_sort.newest', defaultMessage: 'Recent' },
  top: { id: 'comment_sort.top', defaultMessage: 'Most Liked' },
})

export const textForScreenReader = (intl, status, rebloggedByText = false) => {
  if (!intl || !status) return ''

  const displayName = status.getIn(['account', 'display_name'])

  // : todo :
  const values = [
    // displayName.length === 0 ? status.getIn(['account', 'acct']).split('@')[0] : displayName,
    // status.get('spoiler_text') && status.get('hidden')
    //   ? status.get('spoiler_text')
    //   : status.get('search_index').slice(status.get('spoiler_text').length),
    // intl.formatDate(status.get('created_at'), { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
    // `@${status.getIn(['account', 'acct'])}`,
  ]

  if (rebloggedByText) {
    values.push(rebloggedByText)
  }

  return values.join(', ')
}

export const defaultMediaVisibility = (status) => {
  if (!status) return undefined

  if (status.get('reblog', null) !== null && typeof status.get('reblog') === 'object') {
    status = status.get('reblog')
  }

  return (displayMedia !== 'hide_all' && !status.get('sensitive')) || displayMedia === 'show_all'
}

export default
@injectIntl
class Status extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    intl: PropTypes.object.isRequired,
    status: ImmutablePropTypes.map,
    descendantsIds: ImmutablePropTypes.list,
    ancestorStatus: ImmutablePropTypes.map,
    isNotification: PropTypes.bool,
    isChild: PropTypes.bool,
    isPromoted: PropTypes.bool,
    isFeatured: PropTypes.bool,
    isMuted: PropTypes.bool,
    isHidden: PropTypes.bool,
    isIntersecting: PropTypes.bool,
    isComment: PropTypes.bool,
    onClick: PropTypes.func,
    onReply: PropTypes.func,
    onRepost: PropTypes.func,
    onQuote: PropTypes.func,
    onFavorite: PropTypes.func,
    onMention: PropTypes.func,
    onOpenMedia: PropTypes.func,
    onOpenVideo: PropTypes.func,
    onHeightChange: PropTypes.func,
    onToggleHidden: PropTypes.func,
    onShare: PropTypes.func,
    onMoveUp: PropTypes.func,
    onMoveDown: PropTypes.func,
    onFetchComments: PropTypes.func,
    onFetchContext: PropTypes.func,
    getScrollPosition: PropTypes.func,
    updateScrollBottom: PropTypes.func,
    cacheMediaWidth: PropTypes.func,
    cachedMediaWidth: PropTypes.number,
    contextType: PropTypes.string,
    commentsLimited: PropTypes.bool,
    onOpenLikes: PropTypes.func.isRequired,
    onOpenReposts: PropTypes.func.isRequired,
    onCommentSortOpen: PropTypes.func.isRequired,
    isComposeModalOpen: PropTypes.bool,
    commentSortingType: PropTypes.string,
    inReplyToStatus: ImmutablePropTypes.map,
  }

  // Avoid checking props that are functions (and whose equality will always
  // evaluate to false. See react-immutable-pure-component for usage.
  updateOnProps = [
    'status',
    'descendantsIds',
    'isChild',
    'isPromoted',
    'isFeatured',
    'isMuted',
    'isHidden',
    'isIntersecting',
    'isComment',
    'commentSortingType',
    'inReplyToStatus',
  ]

  state = {
    loadedComments: false,
    showMedia: this.props.inReplyToStatus ? defaultMediaVisibility(this.props.inReplyToStatus) : defaultMediaVisibility(this.props.status),
    statusId: undefined,
    height: undefined,
  }

  // Track height changes we know about to compensate scrolling
  componentDidMount() {
    const { isMuted, isHidden, status } = this.props
    this.didShowCard = !isMuted && !isHidden && status && status.get('card')
  }

  getSnapshotBeforeUpdate() {
    if (this.props.getScrollPosition) {
      return this.props.getScrollPosition()
    }

    return null
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.isChild) return null
    
    if (!nextProps.isHidden && (nextProps.isIntersecting || !nextProps.commentsLimited) && !prevState.loadedComments) {
      return {
        loadedComments: true
      }
    }

    if (nextProps.status && nextProps.status.get('id') !== prevState.statusId) {
      return {
        loadedComments: false, //reset
        showMedia: defaultMediaVisibility(nextProps.status),
        statusId: nextProps.status.get('id'),
      }
    }

    return null
  }

  // Compensate height changes
  componentDidUpdate(prevProps, prevState, snapshot) {
    // timeline lazy loading comments
    if (!prevState.loadedComments && this.state.loadedComments && this.props.status && !this.props.isChild && this.props.contextType !== 'feature') {
      const commentCount = this.props.status.get('replies_count')
      if (this.props.isComment && !this.props.ancestorStatus) {
        this.props.onFetchContext(this.props.status.get('id'))
        this._measureHeight(prevState.height !== this.state.height)
      } else {
        if (commentCount > 0 && !this.props.commentsLimited) {
          this._measureHeight(prevState.height !== this.state.height)
          this.props.onFetchComments(this.props.status.get('id'))
        }
      }
    }

    const doShowCard = !this.props.isMuted && !this.props.isHidden && this.props.status && this.props.status.get('card')

    if (doShowCard && !this.didShowCard) {
      this.didShowCard = true

      if (snapshot !== null && this.props.updateScrollBottom) {
        if (this.node && this.node.offsetTop < snapshot.top) {
          // console.log("updateScrollBottom")
          this.props.updateScrollBottom(snapshot.height - snapshot.top)
        }
      }
    }
  }

  handleMoveUp = (id) => {
    const { status, ancestorsIds, descendantsIds } = this.props

    if (id === status.get('id')) {
      this._selectChild(ancestorsIds.size - 1, true)
    } else {
      let index = ancestorsIds.indexOf(id)

      if (index === -1) {
        index = descendantsIds.indexOf(id)
        this._selectChild(ancestorsIds.size + index, true)
      } else {
        this._selectChild(index - 1, true)
      }
    }
  }

  handleMoveDown = id => {
    const { status, ancestorsIds, descendantsIds } = this.props

    if (id === status.get('id')) {
      this._selectChild(ancestorsIds.size + 1, false)
    } else {
      let index = ancestorsIds.indexOf(id)

      if (index === -1) {
        index = descendantsIds.indexOf(id)
        this._selectChild(ancestorsIds.size + index + 2, false)
      } else {
        this._selectChild(index + 1, false)
      }
    }
  }

  _selectChild(index, align_top) {
    const container = this.node
    const element = container.querySelectorAll('.focusable')[index]

    if (element) {
      if (align_top && container.scrollTop > element.offsetTop) {
        element.scrollIntoView(true)
      } else if (!align_top && container.scrollTop + container.clientHeight < element.offsetTop + element.offsetHeight) {
        element.scrollIntoView(false)
      }
      element.focus()
    }
  }

  componentWillUnmount() {
    if (this.node && this.props.getScrollPosition) {
      const position = this.props.getScrollPosition()
      if (position !== null && this.node.offsetTop < position.top) {
        requestAnimationFrame(() => {
          this.props.updateScrollBottom(position.height - position.top)
        })
      }
    }
  }

  handleToggleMediaVisibility = () => {
    this.setState({ showMedia: !this.state.showMedia })
  }

  handleClick = () => {
    if (this.props.onClick) {
      this.props.onClick()
      return
    }

    if (!this.context.router) return

    this.context.router.history.push(
      `/${this._properStatus().getIn(['account', 'acct'])}/posts/${this._properStatus().get('id')}`
    )
  }

  handleExpandClick = e => {
    if (e.button === 0) {
      if (!this.context.router) return

      this.context.router.history.push(
        `/${this._properStatus().getIn(['account', 'acct'])}/posts/${this._properStatus().get('id')}`
      )
    }
  }

  handleExpandedToggle = () => {
    this.props.onToggleHidden(this._properStatus())
  }

  renderLoadingMedia() {
    return <div className={_s.backgroundColorPanel} style={{ height: '110px' }} />
  }

  handleOpenVideo = (media, startTime) => {
    this.props.onOpenVideo(media, startTime)
  }

  handleHotkeyReply = (e) => {
    e.preventDefault()
    this.props.onReply(this._properStatus(), this.context.router)
  }

  handleOnReply = (status) => {
    this.props.onReply(status || this._properStatus(), this.context.router, true)
  }

  handleOnQuote = (status) => {
    this.props.onQuote(status || this._properStatus(), this.context.router)
  }

  handleHotkeyFavorite = () => {
    this.props.onFavorite(this._properStatus())
  }

  handleHotkeyRepost = e => {
    this.props.onQuote(this._properStatus(), e)
  }

  handleHotkeyMention = e => {
    e.preventDefault()
    this.props.onMention(this._properStatus().get('account'), this.context.router)
  }

  handleHotkeyOpen = () => {
    this.context.router.history.push(
      `/${this._properStatus().getIn(['account', 'acct'])}/posts/${this._properStatus().get('id')}`
    )
  }

  handleHotkeyOpenProfile = () => {
    this.context.router.history.push(`/${this._properStatus().getIn(['account', 'acct'])}`)
  }

  handleHotkeyMoveUp = e => {
    this.props.onMoveUp(this.props.status.get('id'), e.target.getAttribute('data-featured'))
  }

  handleHotkeyMoveDown = e => {
    this.props.onMoveDown(this.props.status.get('id'), e.target.getAttribute('data-featured'))
  }

  handleHotkeyToggleHidden = () => {
    this.props.onToggleHidden(this._properStatus())
  }

  handleHotkeyToggleSensitive = () => {
    this.handleToggleMediaVisibility()
  }

  _properStatus() {
    const { status, ancestorStatus } = this.props

    if (ancestorStatus) {
      return ancestorStatus
    }

    if (status.get('reblog', null) !== null && typeof status.get('reblog') === 'object') {
      return status.get('reblog')
    }

    return status
  }

  _measureHeight(heightJustChanged) {
    try {
      scheduleIdleTask(() => this.node && this.setState({ height: Math.ceil(this.node.scrollHeight) + 1 }))

      if (heightJustChanged) {
        this.props.onHeightChange()
      }
    } catch (error) {
      //
    }
  }

  handleOnCommentSortOpen = () => {
    this.props.onCommentSortOpen(this.commentSortButtonRef)
  }

  handleRef = c => {
    this.node = c
    this._measureHeight()
  }

  setCommentSortButtonRef = (c) => {
    this.commentSortButtonRef = c
  }

  componentDidMount() {
    if (this.props.inReplyToStatus) {
      axios.get(`/api/v1/check_boosted_post/${this.props.inReplyToStatus.get('id')}`)
      .then(response => {
        this.setState({ boosted_post_status: response.data.boosted_post_message});
      })
    } else {
      axios.get(`/api/v1/check_boosted_post/${this.props.id}`)
      .then(response => {
        this.setState({ boosted_post_status: response.data.boosted_post_message});
      })
    }
  }

  render() {
    const {
      intl,
      isFeatured,
      isPromoted,
      isChild,
      isHidden,
      isNotification,
      descendantsIds,
      commentsLimited,
      ancestorStatus,
      isComment,
      contextType,
      isComposeModalOpen,
      commentSortingType,
      inReplyToStatus,
    } = this.props
    // const { height } = this.state

    let { status } = this.props

    if (!status) return null

    if (isComment && !ancestorStatus && !isChild) {
      // Wait to load...
      if (contextType === 'feature') {
        return <ColumnIndicator type='loading' />
      }
      return null
    }

    let reblogContent, rebloggedByText = null

    if (ancestorStatus) {
      status = ancestorStatus
    } else {
      if (status.get('reblog', null) !== null && typeof status.get('reblog') === 'object') {
        rebloggedByText = intl.formatMessage(
          { id: 'status.reposted_by', defaultMessage: '{name} reposted' },
          { name: status.getIn(['account', 'acct']) }
        )
        reblogContent = status.get('contentHtml')
        status = status.get('reblog')
      }
    }

    let sortByTitle = intl.formatMessage(messages.oldest)
    if (commentSortingType === COMMENT_SORTING_TYPE_NEWEST) {
      sortByTitle = intl.formatMessage(messages.newest)
    } else if (commentSortingType === COMMENT_SORTING_TYPE_TOP) {
      sortByTitle = intl.formatMessage(messages.top)
    }

    const handlers = (this.props.isMuted || isChild) ? {} : {
      reply: this.handleHotkeyReply,
      favorite: this.handleHotkeyFavorite,
      repost: this.handleHotkeyRepost,
      mention: this.handleHotkeyMention,
      open: this.handleHotkeyOpen,
      openProfile: this.handleHotkeyOpenProfile,
      moveUp: this.handleHotkeyMoveUp,
      moveDown: this.handleHotkeyMoveDown,
      toggleHidden: this.handleHotkeyToggleHidden,
      toggleSensitive: this.handleHotkeyToggleSensitive,
    }

    const parentClasses = CX({
      pb15: !isChild,
    })

    const containerClasses = CX({
      default: 1,
      radiusSmall: !isChild,
      bgPrimary: !isChild,
      boxShadowBlock: !isChild,
    })

    const containerClassesXS = CX({
      default: 1,
      bgPrimary: !isChild,
      boxShadowBlock: !isChild,
      borderTop1PX: !isChild,
      borderColorSecondary: !isChild,
    })

    const innerContainerClasses = CX({
      default: 1,
      overflowHidden: 1,
      radiusSmall: isChild,
      borderColorSecondary: isChild,
      border1PX: isChild,
      pb10: isChild && status.get('media_attachments').size === 0 && !isNotification,
      pb5: isChild && status.get('media_attachments').size > 1 && !isNotification,
      cursorPointer: isChild,
      bgSubtle_onHover: isChild,
    })

    if (status.get('filtered') || status.getIn(['reblog', 'filtered'])) {
      return null
    }

    if (isHidden) {
      return (
        <HotKeys handlers={handlers}>
          <div ref={this.handleRef} className={parentClasses} tabIndex='0'>
            {inReplyToStatus ? (inReplyToStatus.getIn(['account', 'display_name']) || inReplyToStatus.getIn(['account', 'username'])) : (status.getIn(['account', 'display_name']) || status.getIn(['account', 'username']))}
            {inReplyToStatus ? inReplyToStatus.get('content') : status.get('content')}
          </div>
        </HotKeys>
      )
    }

    return (
      <HotKeys handlers={handlers} className={_s.outlineNone}>
        
        <div className={parentClasses}>
          <ResponsiveClassesComponent
            classNames={containerClasses}
            classNamesXS={containerClassesXS}
          >
            {
              !inReplyToStatus &&
              <div
                className={[_s.default, _s.outlineNone].join(' ')}
                tabIndex={this.props.isMuted ? null : 0}
                data-featured={isFeatured ? 'true' : null}
                aria-label={textForScreenReader(intl, status, rebloggedByText)}
                ref={this.handleRef}
                onClick={isChild && !isNotification ? this.handleClick : undefined}
              >
                {
                  this.state.boosted_post_status == "true" &&
                  <div>
                    <button style={{height: 20,backgroundColor: "#75B000", color: "white", border: "#75B000", borderRadius: 10, position: 'absolute', right: 0, top: 0}} className="btn btn-danger">BOOSTED</button>
                  </div>
                }

                <div className={innerContainerClasses}>

                  <div data-id={status.get('id')}>

                    <StatusPrepend
                      status={status}
                      isPromoted={isPromoted}
                      isFeatured={isFeatured}
                      isComment={isComment && !isChild}
                    />

                    <StatusHeader
                      status={status}
                      reduced={isChild}
                    />

                    <div className={_s.default}>
                      <StatusContent
                        status={status}
                        reblogContent={reblogContent}
                        onClick={this.handleClick}
                        expanded={!status.get('hidden')}
                        onExpandedToggle={this.handleExpandedToggle}
                        collapsable={contextType !== 'feature'}
                      />
                    </div>

                    <StatusMedia
                      isChild={isChild}
                      isComposeModalOpen={isComposeModalOpen}
                      status={status}
                      onOpenMedia={this.props.onOpenMedia}
                      cacheWidth={this.props.cacheMediaWidth}
                      defaultWidth={this.props.cachedMediaWidth}
                      visible={this.state.showMedia}
                      onToggleVisibility={this.handleToggleMediaVisibility}
                      width={this.props.cachedMediaWidth}
                      onOpenVideo={this.handleOpenVideo}
                    />

                    {
                      !!status.get('quote') && !isChild &&
                      <div className={[_s.default, _s.mt10, _s.px10].join(' ')}>
                        <Status status={status.get('quoted_status')} isChild intl={intl} />
                      </div>
                    }

                    {
                      (!isChild || isNotification) &&
                      <StatusActionBar
                        status={status}
                        onFavorite={this.props.onFavorite}
                        onReply={this.handleOnReply}
                        onRepost={this.props.onRepost}
                        onShare={this.props.onShare}
                        onOpenLikes={this.props.onOpenLikes}
                        onOpenReposts={this.props.onOpenReposts}
                        onQuote={this.handleOnQuote}
                      />
                    }

                    {
                      !isChild && !!me &&
                      <ResponsiveClassesComponent
                        classNames={[_s.default, _s.borderTop1PX, _s.borderColorSecondary, _s.pt10, _s.px15, _s.mb10].join(' ')}
                        classNamesXS={[_s.default, _s.borderTop1PX, _s.borderColorSecondary, _s.pt10, _s.px10, _s.mb10].join(' ')}
                      >
                        <ComposeFormContainer replyToId={status.get('id')} shouldCondense />
                      </ResponsiveClassesComponent>
                    }

                    {
                      status.get('replies_count') > 0 && !commentsLimited && !isNotification && descendantsIds && descendantsIds.size === 0 &&
                      <Fragment>
                        <div className={[_s.default, _s.mr10, _s.ml10, _s.mb10, _s.borderColorSecondary, _s.borderBottom1PX].join(' ')} />
                        <ColumnIndicator type='loading' />
                      </Fragment>
                    }

                    {
                      descendantsIds && !isChild && !isNotification && descendantsIds.size > 0 && !commentsLimited &&
                      <Fragment>
                        <div className={[_s.default, _s.mr10, _s.ml10, _s.mb10, _s.borderColorSecondary, _s.borderBottom1PX].join(' ')} />

                        {
                          !commentsLimited && descendantsIds.size > 1 &&
                          <div className={[_s.default, _s.px15, _s.py5, _s.mb5, _s.flexRow].join(' ')}>
                            <Text color='secondary' size='small'>
                              {intl.formatMessage(messages.sortBy)}
                            </Text>
                            <Button
                              isText
                              backgroundColor='none'
                              color='secondary'
                              className={_s.ml5}
                              buttonRef={this.setCommentSortButtonRef}
                              onClick={this.handleOnCommentSortOpen}
                            >
                              <Text color='inherit' weight='medium' size='small'>
                                {sortByTitle}
                              </Text>
                            </Button>
                          </div>
                        }
                        <CommentList
                          ancestorAccountId={status.getIn(['account', 'id'])}
                          commentsLimited={commentsLimited}
                          descendants={descendantsIds}
                          onViewComments={this.handleClick}
                        />
                      </Fragment>
                    }
                  </div>
                </div>
              </div>
            }

            {
              !!inReplyToStatus &&
              <div
                className={[_s.default, _s.outlineNone].join(' ')}
                tabIndex={this.props.isMuted ? null : 0}
                data-featured={isFeatured ? 'true' : null}
                aria-label={textForScreenReader(intl, inReplyToStatus, rebloggedByText)}
                ref={this.handleRef}
                onClick={isChild && !isNotification ? this.handleClick : undefined}
              >
                {
                  this.state.boosted_post_status == "true" &&
                  <div>
                    <button style={{height: 20,backgroundColor: "#75B000", color: "white", border: "#75B000", borderRadius: 10, position: 'absolute', right: 0, top: 0}} className="btn btn-danger">BOOSTED</button>
                  </div>
                }

                <div className={innerContainerClasses}>

                  <div data-id={inReplyToStatus.get('id')}>

                    <StatusPrepend
                      status={inReplyToStatus}
                      isPromoted={isPromoted}
                      isFeatured={isFeatured}
                      isComment={isComment && !isChild}
                    />

                    <StatusHeader
                      status={inReplyToStatus}
                      reduced={isChild}
                    />

                    <div className={_s.default}>
                      <StatusContent
                        status={inReplyToStatus}
                        reblogContent={reblogContent}
                        onClick={this.handleClick}
                        expanded={!inReplyToStatus.get('hidden')}
                        onExpandedToggle={this.handleExpandedToggle}
                        collapsable={contextType !== 'feature'}
                      />
                    </div>

                    <div className={[_s.default, _s.py10].join(' ')}>
                      <StatusContent
                        status={status}
                        reblogContent={reblogContent}
                        onClick={this.handleClick}
                        expanded={!status.get('hidden')}
                        onExpandedToggle={this.handleExpandedToggle}
                        collapsable={contextType !== 'feature'}
                      />
                    </div>

                    <StatusMedia
                      isChild={isChild}
                      isComposeModalOpen={isComposeModalOpen}
                      status={inReplyToStatus}
                      onOpenMedia={this.props.onOpenMedia}
                      cacheWidth={this.props.cacheMediaWidth}
                      defaultWidth={this.props.cachedMediaWidth}
                      visible={this.state.showMedia}
                      onToggleVisibility={this.handleToggleMediaVisibility}
                      width={this.props.cachedMediaWidth}
                      onOpenVideo={this.handleOpenVideo}
                    />

                    {
                      !!inReplyToStatus.get('quote') && !isChild &&
                      <div className={[_s.default, _s.mt10, _s.px10].join(' ')}>
                        <Status status={inReplyToStatus.get('quoted_status')} isChild intl={intl} />
                      </div>
                    }

                    {
                      (!isChild || isNotification) &&
                      <StatusActionBar
                        status={inReplyToStatus}
                        onFavorite={this.props.onFavorite}
                        onReply={this.handleOnReply}
                        onRepost={this.props.onRepost}
                        onShare={this.props.onShare}
                        onOpenLikes={this.props.onOpenLikes}
                        onOpenReposts={this.props.onOpenReposts}
                        onQuote={this.handleOnQuote}
                      />
                    }

                    {
                      !isChild && !!me &&
                      <ResponsiveClassesComponent
                        classNames={[_s.default, _s.borderTop1PX, _s.borderColorSecondary, _s.pt10, _s.px15, _s.mb10].join(' ')}
                        classNamesXS={[_s.default, _s.borderTop1PX, _s.borderColorSecondary, _s.pt10, _s.px10, _s.mb10].join(' ')}
                      >
                        <ComposeFormContainer replyToId={inReplyToStatus.get('id')} shouldCondense />
                      </ResponsiveClassesComponent>
                    }

                    {
                      !!inReplyToStatus && inReplyToStatus.get('replies_count') > 0 && !commentsLimited && !isNotification && descendantsIds && descendantsIds.size === 0 &&
                      <Fragment>
                        <div className={[_s.default, _s.mr10, _s.ml10, _s.mb10, _s.borderColorSecondary, _s.borderBottom1PX].join(' ')} />
                        <ColumnIndicator type='loading' />
                      </Fragment>
                    }

                    {
                      descendantsIds && !isChild && !isNotification && descendantsIds.size > 0 && !commentsLimited &&
                      <Fragment>
                        <div className={[_s.default, _s.mr10, _s.ml10, _s.mb10, _s.borderColorSecondary, _s.borderBottom1PX].join(' ')} />

                        {
                          !commentsLimited && descendantsIds.size > 1 &&
                          <div className={[_s.default, _s.px15, _s.py5, _s.mb5, _s.flexRow].join(' ')}>
                            <Text color='secondary' size='small'>
                              {intl.formatMessage(messages.sortBy)}
                            </Text>
                            <Button
                              isText
                              backgroundColor='none'
                              color='secondary'
                              className={_s.ml5}
                              buttonRef={this.setCommentSortButtonRef}
                              onClick={this.handleOnCommentSortOpen}
                            >
                              <Text color='inherit' weight='medium' size='small'>
                                {sortByTitle}
                              </Text>
                            </Button>
                          </div>
                        }
                        <CommentList
                          ancestorAccountId={inReplyToStatus.getIn(['account', 'id'])}
                          commentsLimited={commentsLimited}
                          descendants={descendantsIds}
                          onViewComments={this.handleClick}
                        />
                      </Fragment>
                    }
                  </div>
                </div>
              </div>            
            }
          </ResponsiveClassesComponent>
        </div>
      </HotKeys>
    )
  }

}
