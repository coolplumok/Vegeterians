import { openModal } from '../actions/modal'
import { defineMessages, injectIntl } from 'react-intl'
import isObject from 'lodash.isobject'
import PageTitle from '../features/ui/util/page_title'
import LinkFooter from '../components/link_footer'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import ProgressPanel from '../components/panel/progress_panel'
import TrendsPanel from '../components/panel/trends_panel'
import DefaultLayout from '../layouts/default_layout'

const messages = defineMessages({
  hashtag: { id: 'hashtag', defaultMessage: 'Hashtag' },
  hashtagTimeline: { id: 'hashtag_timeline', defaultMessage: 'Hashtag timeline' },
})

const mapDispatchToProps = (dispatch) => ({
  onOpenHashtagPageSettingsModal(hashtag) {
    dispatch(openModal('HASHTAG_TIMELINE_SETTINGS', {
      hashtag,
    }))
  },
})

export default
@injectIntl
@connect(null, mapDispatchToProps)
class HashtagPage extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    onOpenHashtagPageSettingsModal: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
  }

  render() {
    const {
      intl,
      children,
      onOpenHashtagPageSettingsModal,
      params,
    } = this.props

    const hashtag = isObject(params) ? params.id : ''

    return (
      <DefaultLayout
        title={intl.formatMessage(messages.hashtagTimeline)}
        page={`hashtag.${hashtag}`}
        actions={[
          {
            icon: 'ellipsis',
            onClick: onOpenHashtagPageSettingsModal,
          },
        ]}
        layout={[
          <ProgressPanel key='hashtag-page-progress-panel' />,
          <TrendsPanel key='hashtag-page-trends-panel' />,
          <WhoToFollowPanel key='hashtag-page-wtf-panel' />,
          <LinkFooter key='hashtag-page-link-footer' />,
        ]}
      >
        <PageTitle path={intl.formatMessage(messages.hashtag)} />
        {children}
      </DefaultLayout>
    )
  }
}