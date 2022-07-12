import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'
import ProgressPanel from '../components/panel/progress_panel'
import VerifiedAccountsPanel from '../components/panel/verified_accounts_panel'
import ShopPanel from '../components/panel/shop_panel'
import SignupPanel from '../components/panel/sign_up_panel'
import LinkFooter from '../components/link_footer'

export default class ExplorePage extends PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {
    const { children, title } = this.props

    return (
      <DefaultLayout
        page='explore'
        title={title}
        noComposeButton
        showBackBtn
        layout={[
          <SignupPanel key='explore-page-signup-panel' />,
          <ProgressPanel key='explore-page-progress-panel' />,
          <VerifiedAccountsPanel key='explore-page-verified-panel' />,
          <ShopPanel key='explore-page-shop-panel' />,
          <LinkFooter key='explore-page-link-footer' />,
        ]}
      >
        <PageTitle path={title} />
        {children}
      </DefaultLayout>
    )
  }

}