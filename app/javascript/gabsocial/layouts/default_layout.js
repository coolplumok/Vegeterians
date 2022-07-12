import Layout from './layout'

export default class DefaultLayout extends PureComponent {

  static propTypes = {
    actions: PropTypes.array,
    children: PropTypes.node.isRequired,
    layout: PropTypes.object,
    noComposeButton: PropTypes.bool,
    noRightSidebar: PropTypes.bool,
    page: PropTypes.string,
    showBackBtn: PropTypes.bool,
    tabs: PropTypes.array,
    title: PropTypes.string.isRequired,
  }

  render() {
    const {
      actions,
      children,
      layout,
      noComposeButton,
      noRightSidebar,
      page,
      showBackBtn,
      tabs,
      title,
    } = this.props

    return (
      <Layout
        actions={actions}
        layout={layout}
        noComposeButton={noComposeButton}
        noRightSidebar={noRightSidebar}
        page={page}
        showBackBtn={showBackBtn}
        tabs={tabs}
        title={title}
      >
        {children}
      </Layout>
    )
  }

}
