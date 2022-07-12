import throttle from 'lodash.throttle'
import { openModal } from '../actions/modal'
import { defineMessages, injectIntl } from 'react-intl'
import { MODAL_HOME_TIMELINE_SETTINGS, MODAL_UPGRADE_FLASH_MESSAGE } from '../constants'
import PageTitle from '../features/ui/util/page_title'
import GroupsPanel from '../components/panel/groups_panel'
import ListsPanel from '../components/panel/lists_panel'
import LinkFooter from '../components/link_footer'
import UserPanel from '../components/panel/user_panel'
import AboutMePanel from '../components/panel/about_me_panel'
import HealthExpertsPanel from '../components/panel/health_experts_panel'
import ShopPanel from '../components/panel/shop_panel'
import ProgressPanel from '../components/panel/progress_panel'
import TrendsPanel from '../components/panel/trends_panel'
import VerifiedAccountsPanel from '../components/panel/verified_accounts_panel'
import DefaultLayout from '../layouts/default_layout'
import TimelineComposeBlock from '../components/timeline_compose_block'
import Divider from '../components/divider'
import PullToRefresher from '../components/pull_to_refresher'

const messages = defineMessages({
  home: { id: 'home', defaultMessage: 'Home' },
})

const mapStateToProps = (state) => {
  return {
    totalQueuedItemsCount: state.getIn(['timelines', 'home', 'totalQueuedItemsCount']),
  }
}

const mapDispatchToProps = (dispatch) => ({
  onOpenHomePageSettingsModal() {
    dispatch(openModal(MODAL_HOME_TIMELINE_SETTINGS))
  },
  onOpenNotify() {
    dispatch(openModal(MODAL_UPGRADE_FLASH_MESSAGE))
  },
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class HomePage extends PureComponent {

  static propTypes = {
    children: PropTypes.node.isRequired,
    intl: PropTypes.object.isRequired,
    onOpenHomePageSettingsModal: PropTypes.func.isRequired,
    totalQueuedItemsCount: PropTypes.number.isRequired,
  }

  state = {
    lazyLoaded: false,
  }

  componentDidMount() {
    this.window = window
    this.documentElement = document.scrollingElement || document.documentElement

    this.window.addEventListener('scroll', this.handleScroll)

    if(window.location.href.indexOf('success') != -1 || window.location.href.indexOf('error') != -1){
      this.props.onOpenNotify()
    }
  }

  componentWillUnmount() {
    this.detachScrollListener()
  }

  detachScrollListener = () => {
    this.window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = throttle(() => {
    if (this.window) {
      const { scrollTop } = this.documentElement
      
      if (scrollTop > 25 && !this.state.lazyLoaded) {
        this.setState({ lazyLoaded: true })
        this.detachScrollListener()
      }
    }
  }, 150, {
    trailing: true,
  })

  render() {
    const {
      intl,
      children,
      totalQueuedItemsCount,
      onOpenHomePageSettingsModal,
    } = this.props
    const { lazyLoaded } = this.state

    return (
      <DefaultLayout
        page='home'
        title={intl.formatMessage(messages.home)}
        actions={[
          {
            icon: 'ellipsis',
            onClick: onOpenHomePageSettingsModal,
          },
        ]}
        layout={[
          <UserPanel key='home-page-user-panel' />,
          <AboutMePanel key='home-page-about-me-panel' />,
          <HealthExpertsPanel key='home-page-health-experts-panel' />,  
          <ProgressPanel key='home-page-progress-panel' />,
          <TrendsPanel key='home-page-trends-panel' />,
          <ShopPanel isLazy shouldLoad={lazyLoaded} key='home-page-shop-panel' />,
          <ListsPanel isLazy shouldLoad={lazyLoaded} key='home-page-lists-panel' />,
          <GroupsPanel isLazy shouldLoad={lazyLoaded} key='home-page-groups-panel' />,
          <VerifiedAccountsPanel key='pro-page-verified-panel' />,
          <LinkFooter key='home-page-link-footer' />,
        ]}
      >

        <PageTitle
          path={intl.formatMessage(messages.home)}
          badge={totalQueuedItemsCount}
        />
        
        <PullToRefresher />

        <TimelineComposeBlock autoFocus={false} />
        
        <Divider />

        {children}

      </DefaultLayout>
    )
  }
}