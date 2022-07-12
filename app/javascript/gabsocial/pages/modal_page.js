import PageTitle from '../features/ui/util/page_title'
import LinkFooter from '../components/link_footer'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import DefaultLayout from '../layouts/default_layout'

export default class ModalPage extends PureComponent {

  static propTypes = {
    title: PropTypes.string,
    page: PropTypes.string,
    children: PropTypes.node,
  }

  render() {
    const {
      children,
      title,
      page,
    } = this.props

    return (
      <DefaultLayout
        title={title}
        page={page}
        layout={[
          <WhoToFollowPanel key='modal-page-wtf-panel' />,
          <LinkFooter key='search-page-link-footer' />,
        ]}
        showBackBtn
      >
        <PageTitle path={title} />
        {children}
      </DefaultLayout>
    )
  }

}