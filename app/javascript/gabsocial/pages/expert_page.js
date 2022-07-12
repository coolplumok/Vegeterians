import { defineMessages, injectIntl } from 'react-intl'
import PageTitle from '../features/ui/util/page_title'
import LinkFooter from '../components/link_footer'
import VerifiedAccountsPanel from '../components/panel/verified_accounts_panel'
import ProgressPanel from '../components/panel/progress_panel'
import DefaultLayout from '../layouts/default_layout'

const messages = defineMessages({
  title: { 'id': 'column.expert', 'defaultMessage': 'Expert feed' },
})

export default
@injectIntl
class ExpertPage extends PureComponent {

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
        page='expert'
        layout={[
          <ProgressPanel key='expert-page-progress-panel' />,
          <VerifiedAccountsPanel key='expert-page-verified-panel' />,
          <LinkFooter key='expert-page-link-footer' />,
        ]}
      >
        <PageTitle path={title} />
        {children}
      </DefaultLayout>
    )
  }
}