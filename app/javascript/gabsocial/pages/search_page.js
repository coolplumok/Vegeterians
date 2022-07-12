import { defineMessages, injectIntl } from 'react-intl'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import Responsive from '../features/ui/util/responsive_component'
import PageTitle from '../features/ui/util/page_title'
import LinkFooter from '../components/link_footer'
import SearchFilterPanel from '../components/panel/search_filter_panel'
import TrendsPanel from '../components/panel/trends_panel'
import SignupPanel from '../components/panel/sign_up_panel'
import Search from '../components/search'
import Layout from '../layouts/layout'

const messages = defineMessages({
  search: { id: 'search', defaultMessage: 'Search' },
  top: { id: 'top', defaultMessage: 'Top' },
  people: { id: 'people', defaultMessage: 'People' },
  groups: { id: 'groups', defaultMessage: 'Groups' },
  hashtags: { id: 'hashtags', defaultMessage: 'Hashtags' },
})

const mapStateToProps = (state) => ({
  value: state.getIn(['search', 'value']),
})

export default
@injectIntl
@connect(mapStateToProps)
class SearchPage extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    value: PropTypes.string,
  }

  render() {
    const { intl, children, value } = this.props

    const title = intl.formatMessage(messages.search)
    const tabs = [
      {
        title: intl.formatMessage(messages.top),
        to: '/search'
      },
      {
        title: intl.formatMessage(messages.people),
        to: '/search/people'
      },
      {
        title: intl.formatMessage(messages.groups),
        to: '/search/groups'
      },
      {
        title: intl.formatMessage(messages.hashtags),
        to: '/search/hashtags'
      },
    ]

    const qos = !!value ? value : ''

    return (
      <Layout
        noComposeButton
        title={title}
        showBackBtn
        tabs={tabs}
        page={`search.${qos}`}
        layout={[
          <SignupPanel key='search-page-signup-panel' />,
          <SearchFilterPanel key='search-page-search-panel' />,
          <TrendsPanel key='search-page-trends-panel' />,
          <LinkFooter key='search-page-link-footer' />,
        ]}
      >
        <PageTitle path={title} />
        
        <Responsive max={BREAKPOINT_EXTRA_SMALL}>
          <div className={[_s.default, _s.px10].join(' ')}>
            <Search />
          </div>
        </Responsive>

        {children}
      </Layout>
    )
  }

}