import { defineMessages, injectIntl } from 'react-intl'
import PageTitle from '../features/ui/util/page_title'
import LinkFooter from '../components/link_footer'
import VerifiedAccountsPanel from '../components/panel/verified_accounts_panel'
import ProgressPanel from '../components/panel/progress_panel'
import DefaultLayout from '../layouts/default_layout'

const messages = defineMessages({
  title: { 'id': 'column.trends', 'defaultMessage': 'Vegeterians News' },
})

export default
@injectIntl
class TrendsPage extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {
    const { intl, children } = this.props

    const title = intl.formatMessage(messages.title)

    return (
      <DefaultLayout
        title={title}
        page='trends'
        layout={[
          <ProgressPanel key='trends-page-progress-panel' />,
          <VerifiedAccountsPanel key='trends-page-verified-panel' />,
          <LinkFooter key='trends-page-link-footer' />,
        ]}
      >
        <PageTitle path={title} />
        {children}
      </DefaultLayout>
    )
  }
}