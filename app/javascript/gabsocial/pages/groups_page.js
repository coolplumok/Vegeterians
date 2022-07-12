import { me } from '../initial_state'
import { defineMessages, injectIntl } from 'react-intl'
import { openModal } from '../actions/modal'
import {
  MODAL_GROUP_CREATE,
  MODAL_PRO_UPGRADE,
} from '../constants'
import PageTitle from '../features/ui/util/page_title'
import LinkFooter from '../components/link_footer'
import GroupsPanel from '../components/panel/groups_panel'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import VerifiedAccountsPanel from '../components/panel/verified_accounts_panel'
import DefaultLayout from '../layouts/default_layout'

const messages = defineMessages({
  groups: { id: 'groups', defaultMessage: 'Groups' },
	all: { id: 'all', defaultMessage: 'All' },
  featured: { id: 'featured', defaultMessage: 'Featured' },
  privated: { id: 'privated', defaultMessage: 'Private' },
  new: { id: 'new', defaultMessage: 'Just Added' },
  myGroups: { id: 'my_groups', defaultMessage: 'My Groups' },
  admin: { id: 'admin', defaultMessage: 'Admin' },
})

const mapStateToProps = (state) => ({
  isPro: state.getIn(['accounts', me, 'is_pro']),
  isProPlus: state.getIn(['accounts', me, 'is_proplus']),
})

const mapDispatchToProps = (dispatch) => ({
  onOpenGroupCreateModal(isPro, isProPlus) {
    if (isPro || isProPlus) {
      dispatch(openModal(MODAL_GROUP_CREATE))
    } else {
      dispatch(openModal(MODAL_PRO_UPGRADE))
    }
  },
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class GroupsPage extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    isPro: PropTypes.bool,
    onOpenGroupCreateModal: PropTypes.func.isRequired,
  }

  handleOnOpenGroupCreateModal = () => {
    this.props.onOpenGroupCreateModal(this.props.isPro, this.props.isProPlus)
  }

  render() {
    const {
      intl,
      children,
      isPro,
      onOpenGroupCreateModal,
    } = this.props

    const actions = [
      {
        icon: 'add',
        onClick: this.handleOnOpenGroupCreateModal,
      },
    ]
    const tabs = !!me ? [
      {
        title: intl.formatMessage(messages.all),
        to: '/groups',
      },
      {
        title: intl.formatMessage(messages.featured),
        to: '/groups/featured',
      },
      {
        title: intl.formatMessage(messages.privated),
        to: '/groups/privated',
      },
      {
        title: intl.formatMessage(messages.new),
        to: '/groups/new',
      },
      {
        title: intl.formatMessage(messages.myGroups),
        to: '/groups/browse/member',
      },
    ] : []

    if (isPro) {
      tabs.push({
        title: intl.formatMessage(messages.admin),
        to: '/groups/browse/admin',
      })
    }

    const title = intl.formatMessage(messages.groups)

    return (
      <DefaultLayout
        title={title}
        actions={actions}
        tabs={tabs}
        page='groups'
        layout={[
          <WhoToFollowPanel key='groups-page-wtf-panel' />,
          <GroupsPanel slim key='groups-page-groups-panel' />,
          <VerifiedAccountsPanel key='pro-page-verified-panel' />,
          <LinkFooter key='groups-page-link-footer' />,
        ]}
      >
        <PageTitle path={title} />
        { children }
      </DefaultLayout>
    )
  }

}