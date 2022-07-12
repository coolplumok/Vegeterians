import PageTitle from '../features/ui/util/page_title'
import DefaultLayout from '../layouts/default_layout'
import LinkFooter from '../components/link_footer'
import TrendsPanel from '../components/panel/trends_panel'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'

export default class BasicPage extends PureComponent {

  static propTypes = {
    children: PropTypes.node.isRequired,
    page: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }

  render() {
    const {
      children,
      page,
      title,
    } = this.props

    return (
      <DefaultLayout
        noComposeButton
        showBackBtn
        title={title}
        page={page}
        layout={[
          <TrendsPanel key='basic-page-trends-panel' />,
          <WhoToFollowPanel key='basic-page-wtf-panel' />,
          <LinkFooter key='basic-page-link-footer' />,
        ]}
      >
        <PageTitle path={title} />
        {children}
      </DefaultLayout>
    )
  }

}