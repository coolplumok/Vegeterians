import PageTitle from '../features/ui/util/page_title'
import AboutLayout from '../layouts/about_layout'

export default class AboutPage extends PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {
    const { children, title } = this.props

    return (
      <AboutLayout
        noComposeButton
        showBackBtn
        title={title}
        page='about'
      >
        <PageTitle path={title} />
        {children}
      </AboutLayout>
    )
  }

}