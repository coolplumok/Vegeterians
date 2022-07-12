import { defineMessages, injectIntl } from 'react-intl'
import { openModal } from '../actions/modal'
import PageTitle from '../features/ui/util/page_title'
import GroupSidebarPanel from '../components/panel/groups_panel'
import LinkFooter from '../components/link_footer'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import ProgressPanel from '../components/panel/progress_panel'
import TrendsPanel from '../components/panel/trends_panel'
import DefaultLayout from '../layouts/default_layout'

const messages = defineMessages({
  community: { 'id': 'column.community', 'defaultMessage': 'Community feed' },
})

const mapDispatchToProps = (dispatch) => ({
  onOpenCommunityPageSettingsModal() {
    dispatch(openModal('COMMUNITY_TIMELINE_SETTINGS'))
  },
})

export default
@injectIntl
@connect(null, mapDispatchToProps)
class CommunityPage extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    onOpenCommunityPageSettingsModal: PropTypes.func.isRequired,
  }

  render() {
    const { intl, children, onOpenCommunityPageSettingsModal } = this.props

    const title = intl.formatMessage(messages.community)

    return (
      <DefaultLayout
        title={title}
        page='community'
        actions={[
          {
            icon: 'ellipsis',
            onClick: onOpenCommunityPageSettingsModal,
          },
        ]}
        layout={[
          <ProgressPanel key='community-page-progress-panel' />,
          <TrendsPanel key='community-page-progress-panel' />,
          <WhoToFollowPanel key='community-page-wtf-panel' />,
          <GroupSidebarPanel key='community-page-groups-panel' />,
          <LinkFooter key='community-page-link-footer' />,
        ]}
      >
        <PageTitle path={title} />
        {children}
      </DefaultLayout>
    )
  }
}