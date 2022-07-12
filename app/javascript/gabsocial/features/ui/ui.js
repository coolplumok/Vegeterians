'use strict'

import { HotKeys } from 'react-hotkeys'
import { defineMessages, injectIntl } from 'react-intl'
import { Switch, Redirect, withRouter } from 'react-router-dom'
import debounce from 'lodash.debounce'
import queryString from 'query-string'
import moment from 'moment-mini'
import { uploadCompose, resetCompose } from '../../actions/compose'
import { expandHomeTimeline } from '../../actions/timelines'
import { fetchGroups } from '../../actions/groups'
import {
  initializeNotifications,
  expandNotifications,
  setFilter,
} from '../../actions/notifications'
import LoadingBar from '../../components/loading_bar'
import { fetchFilters } from '../../actions/filters'
import { clearHeight } from '../../actions/height_cache'
import { openModal } from '../../actions/modal'
import WrappedRoute from './util/wrapped_route'
import ModalRoot from '../../components/modal/modal_root'
import PopoverRoot from '../../components/popover/popover_root'
import UploadArea from '../../components/upload_area'
import ProfilePage from '../../pages/profile_page'
import CommunityPage from '../../pages/community_page'
import HashtagPage from '../../pages/hashtag_page'
import ShortcutsPage from '../../pages/shortcuts_page'
import GroupPage from '../../pages/group_page'
import GroupsPage from '../../pages/groups_page'
import SearchPage from '../../pages/search_page'
import ErrorPage from '../../pages/error_page'
import HomePage from '../../pages/home_page'
import NotificationsPage from '../../pages/notifications_page'
import ListPage from '../../pages/list_page'
import ListsPage from '../../pages/lists_page'
import PostsPage from '../../pages/posts_page'
import BasicPage from '../../pages/basic_page'
import ModalPage from '../../pages/modal_page'
import SettingsPage from '../../pages/settings_page'
import ProPage from '../../pages/pro_page'
import ExpertPage from '../../pages/expert_page'
import ExplorePage from '../../pages/explore_page'
import AboutPage from '../../pages/about_page'
import TrendsPage from '../../pages/trends_page'
// import AuthPage from '../../pages/auth_page'
import SuggestionPage from '../../pages/suggestion_page'
import AmbassadorsPage from '../../pages/ambassadors_page'

import {
  About,
  AccountGallery,
  AccountTimeline,
  BlockedAccounts,
  BlockedDomains,
  BookmarkedStatuses,
  CommunityTimeline,
  Compose,
  DMCA,
  Explore,
  // Filters,
  Followers,
  Following,
  FollowRequests,
  GenericNotFound,
  GroupsCollection,
  GroupCreate,
  GroupMembers,
  GroupRemovedAccounts,
  GroupTimeline,
  HashtagTimeline,
  HomeTimeline,
  LikedStatuses,
  ListCreate,
  ListsDirectory,
  ListEdit,
  ListTimeline,
  Mutes,
  Notifications,
  PrivacyPolicy,
  ProTimeline,
  PostsDirectory,
  ExpertTimeline,
  Search,
  Shortcuts,
  StatusFeature,
  StatusLikes,
  StatusReposts,
  TermsOfSale,
  TermsOfService,
  TrendsTimeline,
  Suggestion,
  Ambassadors,
} from './util/async_components'
import { me, meUsername } from '../../initial_state'

// Dummy import, to make sure that <Status /> ends up in the application bundle.
// Without this it ends up in ~8 very commonly used bundles.
import '../../components/status'

const messages = defineMessages({
  beforeUnload: { id: 'ui.beforeunload', defaultMessage: 'Your draft will be lost if you leave Vegeterians.live.' },
  publish: { id: 'compose_form.publish', defaultMessage: 'Post' },
})

const mapStateToProps = (state) => ({
  isComposing: state.getIn(['compose', 'is_composing']),
  hasComposingText: state.getIn(['compose', 'text']).trim().length !== 0,
  hasMediaAttachments: state.getIn(['compose', 'media_attachments']).size > 0,
})

const keyMap = {
  help: '?',
  new: 'n',
  search: 's',
  forceNew: 'option+n',
  reply: 'r',
  Favorite: 'f',
  boost: 'b',
  mention: 'm',
  open: ['enter', 'o'],
  openProfile: 'p',
  moveDown: ['down', 'j'],
  moveUp: ['up', 'k'],
  back: 'backspace',
  goToHome: 'g h',
  goToNotifications: 'g n',
  goToStart: 'g s',
  goToFavorites: 'g f',
  goToProfile: 'g u',
  goToBlocked: 'g b',
  goToMuted: 'g m',
  goToRequests: 'g r',
}

class SwitchingArea extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
    onLayoutChange: PropTypes.func.isRequired,
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize, {
      passive: true
    })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = debounce(() => {
    // The cached heights are no longer accurate, invalidate
    this.props.onLayoutChange()
  }, 500, {
    trailing: true,
  })

  setRef = c => {
    this.node = c.getWrappedInstance()
  }

  render() {
    const { children } = this.props

    return (
      <Switch>
        <Redirect from='/' to='/home' exact />
        <WrappedRoute path='/home' exact page={HomePage} component={HomeTimeline} content={children} />

        <WrappedRoute path='/about' publicRoute exact page={AboutPage} component={About} content={children} componentParams={{ title: 'About' }} />
        <WrappedRoute path='/about/copyright' publicRoute exact page={AboutPage} component={DMCA} content={children} componentParams={{ title: 'Copyright' }} />
        <WrappedRoute path='/about/privacy' publicRoute exact page={AboutPage} component={PrivacyPolicy} content={children} componentParams={{ title: 'Privacy Policy' }} />
        <WrappedRoute path='/about/sales' publicRoute exact page={AboutPage} component={TermsOfSale} content={children} componentParams={{ title: 'Terms of Sale' }} />
        <WrappedRoute path='/about/tos' publicRoute exact page={AboutPage} component={TermsOfService} content={children} componentParams={{ title: 'Terms of Service' }} />

        <WrappedRoute path='/compose' exact page={BasicPage} component={Compose} content={children} componentParams={{ title: 'Compose', page: 'compose' }} />

        <WrappedRoute path='/timeline/all' exact page={CommunityPage} component={CommunityTimeline} content={children} componentParams={{ title: 'Community Feed' }} />
        <WrappedRoute path='/timeline/expert' exact page={ExpertPage} component={ExpertTimeline} content={children} componentParams={{ title: 'Expert Feed' }} />
        <WrappedRoute path='/timeline/pro' exact page={ProPage} component={ProTimeline} content={children} componentParams={{ title: 'Pro Feed' }} />
        
        <WrappedRoute path='/timeline/trends' exact page={TrendsPage} component={TrendsTimeline} content={children} componentParams={{ title: 'Vegeterians News' }} />
        
        <WrappedRoute path='/suggestion' publicRoute exact page={SuggestionPage} component={Suggestion} content={children} />

        <WrappedRoute path='/groups' publicRoute exact page={GroupsPage} component={GroupsCollection} content={children} componentParams={{ activeTab: 'all' }} />
        <WrappedRoute path='/groups/featured' publicRoute exact page={GroupsPage} component={GroupsCollection} content={children} componentParams={{ activeTab: 'featured' }} />
        <WrappedRoute path='/groups/privated' publicRoute exact page={GroupsPage} component={GroupsCollection} content={children} componentParams={{ activeTab: 'privated' }} />
        <WrappedRoute path='/groups/new' exact page={GroupsPage} component={GroupsCollection} content={children} componentParams={{ activeTab: 'new' }} />
        <WrappedRoute path='/groups/browse/member' exact page={GroupsPage} component={GroupsCollection} content={children} componentParams={{ activeTab: 'member' }} />
        <WrappedRoute path='/groups/browse/admin' exact page={GroupsPage} component={GroupsCollection} content={children} componentParams={{ activeTab: 'admin' }} />

        <WrappedRoute path='/groups/create' page={ModalPage} component={GroupCreate} content={children} componentParams={{ title: 'Create Group', page: 'create-group' }} />
        { /* <WrappedRoute path='/groups/:id/members' page={GroupPage} component={GroupMembers} content={children} />
        <WrappedRoute path='/groups/:id/removed-accounts' page={GroupPage} component={GroupRemovedAccounts} content={children} />  */}
        <WrappedRoute path='/groups/:id/edit' page={ModalPage} component={GroupCreate} content={children} componentParams={{ title: 'Edit Group', page: 'edit-group' }} />
        
        <WrappedRoute path='/groups/:id/:slug' publicRoute page={GroupPage} component={GroupTimeline} content={children} />

        <WrappedRoute path='/tags/:id' publicRoute page={HashtagPage} component={HashtagTimeline} content={children} componentParams={{ title: 'Hashtag' }} />

        <WrappedRoute path='/shortcuts' page={ShortcutsPage} component={Shortcuts} content={children} />

        <WrappedRoute path='/lists' exact page={ListsPage} component={ListsDirectory} content={children} />
        <WrappedRoute path='/boosted/posts' exact page={PostsPage} component={PostsDirectory} content={children} />
        <WrappedRoute path='/lists/create' exact page={ModalPage} component={ListCreate} content={children} componentParams={{ title: 'Create List', page: 'create-list' }} />
        <WrappedRoute path='/lists/:id/edit' exact page={ModalPage} component={ListEdit} content={children} componentParams={{ title: 'Edit List', page: 'edit-list' }} />
        <WrappedRoute path='/lists/:id' page={ListPage} component={ListTimeline} content={children} />

        <WrappedRoute path='/notifications' exact page={NotificationsPage} component={Notifications} content={children} />
        <Redirect from='/follow_requests' to='/notifications/follow_requests' exact />
        <WrappedRoute path='/notifications/follow_requests' exact page={NotificationsPage} component={FollowRequests} content={children} />

        <WrappedRoute path='/search' exact publicRoute page={SearchPage} component={Search} content={children} />
        <WrappedRoute path='/search/people' exact publicRoute page={SearchPage} component={Search} content={children} />
        <WrappedRoute path='/search/hashtags' exact page={SearchPage} component={Search} content={children} />
        <WrappedRoute path='/search/groups' exact publicRoute page={SearchPage} component={Search} content={children} />

        <WrappedRoute path='/settings/blocks' exact page={SettingsPage} component={BlockedAccounts} content={children} componentParams={{ title: 'Blocked Users' }} />
        <WrappedRoute path='/settings/mutes' exact page={SettingsPage} component={Mutes} content={children} componentParams={{ title: 'Muted Users' }} />

        <WrappedRoute path='/ambassadors' exact page={AmbassadorsPage} component={Ambassadors} content={children} componentParams={{ title: 'Ambassadors' }} />
        <Redirect from='/@:username' to='/:username' exact />
        <WrappedRoute path='/:username' publicRoute exact page={ProfilePage} component={AccountTimeline} content={children} />

        <Redirect from='/@:username/comments' to='/:username/comments' />
        <WrappedRoute path='/:username/comments' page={ProfilePage} component={AccountTimeline} content={children} componentParams={{ commentsOnly: true }} />

        <Redirect from='/@:username/followers' to='/:username/followers' />
        <WrappedRoute path='/:username/followers' page={ProfilePage} component={Followers} content={children} />

        <Redirect from='/@:username/following' to='/:username/following' />
        <WrappedRoute path='/:username/following' page={ProfilePage} component={Following} content={children} />

        <Redirect from='/@:username/media' to='/:username/photos' />
        <Redirect from='/@:username/photos' to='/:username/photos' />
        <Redirect from='/:username/media' to='/:username/photos' />
        <WrappedRoute path='/:username/photos' page={ProfilePage} component={AccountGallery} content={children} componentParams={{ noSidebar: true, mediaType: 'photo' }} />
        <WrappedRoute path='/:username/videos' page={ProfilePage} component={AccountGallery} content={children} componentParams={{ noSidebar: true, mediaType: 'video' }} />

        <Redirect from='/@:username/likes' to='/:username/likes' />
        <WrappedRoute path='/:username/likes' page={ProfilePage} component={LikedStatuses} content={children} />

        <Redirect from='/@:username/bookmarks' to='/:username/bookmarks' />
        <WrappedRoute path='/:username/bookmarks' page={ProfilePage} component={BookmarkedStatuses} content={children} />

        <Redirect from='/@:username/posts/:statusId' to='/:username/posts/:statusId' exact />
        <WrappedRoute path='/:username/posts/:statusId' publicRoute exact page={BasicPage} component={StatusFeature} content={children} componentParams={{ title: 'Status', page: 'status' }} />

        { /*
        <Redirect from='/@:username/posts/:statusId/reposts' to='/:username/posts/:statusId/reposts' />
        <WrappedRoute path='/:username/posts/:statusId/reposts' page={BasicPage} component={StatusReposts} content={children} componentParams={{ title: 'Reposts' }} />

        <Redirect from='/@:username/posts/:statusId/likes' to='/:username/posts/:statusId/likes' />
        <WrappedRoute path='/:username/posts/:statusId/likes' page={BasicPage} component={StatusLikes} content={children} componentParams={{ title: 'Likes' }} /> */ }

        <WrappedRoute page={ErrorPage} component={GenericNotFound} content={children} />
      </Switch>
    )
  }
}

export default
@connect(mapStateToProps)
@injectIntl
@withRouter
class UI extends PureComponent {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.node,
    isComposing: PropTypes.bool,
    hasComposingText: PropTypes.bool,
    hasMediaAttachments: PropTypes.bool,
    location: PropTypes.object,
    intl: PropTypes.object.isRequired,
  }

  state = {
    fetchedHome: false,
    fetchedNotifications: false,
    draggingOver: false,
  }

  handleBeforeUnload = (e) => {
    const {
      intl,
      isComposing,
      hasComposingText,
      hasMediaAttachments
    } = this.props

    if (isComposing && (hasComposingText || hasMediaAttachments)) {
      // Setting returnValue to any string causes confirmation dialog.
      // Many browsers no longer display this text to users,
      // but we set user-friendly message for other browsers, e.g. Edge.
      e.returnValue = intl.formatMessage(messages.beforeUnload)
    }
  }

  handleLayoutChange = () => {
    // The cached heights are no longer accurate, invalidate
    this.props.dispatch(clearHeight())
  }

  handleDragEnter = (e) => {
    e.preventDefault()

    if (!this.dragTargets) {
      this.dragTargets = []
    }

    if (this.dragTargets.indexOf(e.target) === -1) {
      this.dragTargets.push(e.target)
    }

    if (e.dataTransfer && Array.from(e.dataTransfer.types).includes('Files')) {
      this.setState({
        draggingOver: true,
      })
    }
  }

  handleDragOver = (e) => {
    if (this.dataTransferIsText(e.dataTransfer)) return false

    e.preventDefault()
    e.stopPropagation()

    try {
      e.dataTransfer.dropEffect = 'copy'
    } catch (err) {
      //
    }

    return false
  }

  handleDrop = (e) => {
    if (!me) return

    if (this.dataTransferIsText(e.dataTransfer)) return
    e.preventDefault()

    this.setState({
      draggingOver: false
    })
    this.dragTargets = []

    if (e.dataTransfer && e.dataTransfer.files.length >= 1) {
      this.props.dispatch(uploadCompose(e.dataTransfer.files))
    }
  }

  handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()

    this.dragTargets = this.dragTargets.filter(el => el !== e.target && this.node.contains(el))

    if (this.dragTargets.length > 0) return

    this.setState({
      draggingOver: false
    })
  }

  dataTransferIsText = (dataTransfer) => {
    return (
      dataTransfer
      && Array.from(dataTransfer.types).includes('text/plain')
      && dataTransfer.items.length === 1
    )
  }

  closeUploadModal = () => {
    this.setState({
      draggingOver: false
    })
  }

  handleServiceWorkerPostMessage = ({ data }) => {
    if (data.type === 'navigate') {
      this.context.router.history.push(data.path)
    } else {
      console.warn('Unknown message type:', data.type)
    }
  }

  componentWillMount() {
    if (!me) return

    window.addEventListener('beforeunload', this.handleBeforeUnload, false)

    document.addEventListener('dragenter', this.handleDragEnter, false)
    document.addEventListener('dragover', this.handleDragOver, false)
    document.addEventListener('drop', this.handleDrop, false)
    document.addEventListener('dragleave', this.handleDragLeave, false)
    document.addEventListener('dragend', this.handleDragEnd, false)

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerPostMessage)
    }

    if (typeof window.Notification !== 'undefined' && Notification.permission === 'default') {
      window.setTimeout(() => Notification.requestPermission(), 120 * 1000)
    }

    const pathname = this.context.router.route.location.pathname

    if (pathname === '/home') {
      this.setState({ fetchedHome: true })
      this.props.dispatch(expandHomeTimeline())
    } else if (pathname.startsWith('/notifications')) {
      try {
        const search = this.context.router.route.location.search
        const qp = queryString.parse(search)
        let view = `${qp.view}`.toLowerCase()

        if (pathname.startsWith('/notifications/follow_requests')) {
          view = 'follow_requests'
        }

        this.props.dispatch(setFilter('active', view))
      } catch (error) {
        //
      }

      this.setState({ fetchedNotifications: true })
      this.props.dispatch(expandNotifications())
    }

    this.props.dispatch(initializeNotifications())
  }

  componentDidMount() {
    // this.hotkeys.__mousetrap__.stopCallback = (e, element) => {
    //   return ['TEXTAREA', 'SELECT', 'INPUT'].includes(element.tagName)
    // }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
    document.removeEventListener('dragenter', this.handleDragEnter)
    document.removeEventListener('dragover', this.handleDragOver)
    document.removeEventListener('drop', this.handleDrop)
    document.removeEventListener('dragleave', this.handleDragLeave)
    document.removeEventListener('dragend', this.handleDragEnd)
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      const pathname = this.props.location.pathname

      if (pathname === '/home' && !this.state.fetchedHome) {
        this.setState({ fetchedHome: true })
        this.props.dispatch(expandHomeTimeline())
      } else if (pathname.startsWith('/notifications') && !this.state.fetchedNotifications) {
        this.setState({ fetchedNotifications: true })
        this.props.dispatch(expandNotifications())
      }
    }
  }

  setRef = (c) => {
    this.node = c
  }

  handleHotkeyNew = (e) => {
    e.preventDefault()

    const element = this.node.querySelector('.compose-form__autosuggest-wrapper textarea')

    if (element) {
      element.focus()
    }
  }

  handleHotkeySearch = (e) => {
    e.preventDefault()

    const element = this.node.querySelector('.search__input')

    if (element) {
      element.focus()
    }
  }

  handleHotkeyForceNew = (e) => {
    this.handleHotkeyNew(e)
    this.props.dispatch(resetCompose())
  }

  handleHotkeyBack = () => {
    if (window.history && window.history.length === 1) {
      this.context.router.history.push('/home') // homehack
    } else {
      this.context.router.history.goBack()
    }
  }

  setHotkeysRef = (c) => {
    this.hotkeys = c
  }

  handleHotkeyToggleHelp = () => {
    this.props.dispatch(openModal('HOTKEYS'))
  }

  handleHotkeyGoToHome = () => {
    this.context.router.history.push('/home')
  }

  handleHotkeyGoToNotifications = () => {
    this.context.router.history.push('/notifications')
  }

  handleHotkeyGoToStart = () => {
    this.context.router.history.push('/getting-started')
  }

  handleHotkeyGoToFavorites = () => {
    this.context.router.history.push(`/${meUsername}/favorites`)
  }

  handleHotkeyGoToProfile = () => {
    this.context.router.history.push(`/${meUsername}`)
  }

  handleHotkeyGoToBlocked = () => {
    this.context.router.history.push('/blocks')
  }

  handleHotkeyGoToMuted = () => {
    this.context.router.history.push('/mutes')
  }

  handleHotkeyGoToRequests = () => {
    this.context.router.history.push('/follow_requests')
  }

  handleOpenComposeModal = () => {
    this.props.dispatch(openModal('COMPOSE'))
  }

  render() {
    const { children, location } = this.props
    const { draggingOver } = this.state

    // : todo :
    // const handlers = me ? {
    //   help: this.handleHotkeyToggleHelp,
    //   new: this.handleHotkeyNew,
    //   search: this.handleHotkeySearch,
    //   forceNew: this.handleHotkeyForceNew,
    //   back: this.handleHotkeyBack,
    //   goToHome: this.handleHotkeyGoToHome,
    //   goToNotifications: this.handleHotkeyGoToNotifications,
    //   goToStart: this.handleHotkeyGoToStart,
    //   goToFavorites: this.handleHotkeyGoToFavorites,
    //   goToProfile: this.handleHotkeyGoToProfile,
    //   goToBlocked: this.handleHotkeyGoToBlocked,
    //   goToMuted: this.handleHotkeyGoToMuted,
    //   goToRequests: this.handleHotkeyGoToRequests,
    // } : {}

    return (
      <div ref={this.setRef} className={_s.gabsocial}>
        <LoadingBar className={[_s.height1PX, _s.z3, _s.bgBrandLight].join(' ')} />

        <SwitchingArea location={location} onLayoutChange={this.handleLayoutChange}>
          {children}
        </SwitchingArea>

        <ModalRoot />
        <PopoverRoot />

        <UploadArea active={draggingOver} onClose={this.closeUploadModal} />
      </div>
    )
  }

}
