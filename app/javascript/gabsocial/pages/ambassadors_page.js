import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import VerifiedAccountsPanel from '../components/panel/verified_accounts_panel'
import LinkFooter from '../components/link_footer'

export default class AmbassadorsPage extends PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {
    const { children, title } = this.props

    return (
      <DefaultLayout
        layout={[
          <WhoToFollowPanel key='ambassadors-page-wtf-panel' />,
          <VerifiedAccountsPanel key='ambassadors-page-verified-panel' />,
          <LinkFooter key='ambassadors-page-link-footer' />,
        ]}
      >
        <PageTitle path={title} />
        {children}
      </DefaultLayout>
    )
  }

}
