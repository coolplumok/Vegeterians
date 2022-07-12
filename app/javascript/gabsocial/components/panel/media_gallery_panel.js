import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { expandAccountMediaTimeline } from '../../actions/timelines'
import { getAccountGallery } from '../../selectors'
import PanelLayout from './panel_layout'
import MediaItem from '../media_item'

const messages = defineMessages({
  title: { id: 'media_gallery_panel.title', defaultMessage: 'Media' },
  show_all: { id: 'media_gallery_panel.all', defaultMessage: 'Show all' },
})

const mapStateToProps = (state, { account }) => {
  const accountId = !!account ? account.get('id') : -1

  return {
    accountId,
    attachments: getAccountGallery(state, accountId),
  }
}

export default
@connect(mapStateToProps)
@injectIntl
class MediaGalleryPanel extends ImmutablePureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    accountId: PropTypes.string,
    account: ImmutablePropTypes.map,
    attachments: ImmutablePropTypes.list.isRequired,
    intl: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { accountId } = this.props

    if (accountId && accountId !== -1) {
      this.props.dispatch(expandAccountMediaTimeline(accountId, { limit: 8 }))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountId && nextProps.accountId !== this.props.accountId) {
      this.props.dispatch(expandAccountMediaTimeline(nextProps.accountId, { limit: 8 }))
    }
  }

  render() {
    const {
      intl,
      account,
      attachments
    } = this.props

    if (!account || !attachments) return null

    return (
      <PanelLayout
        noPadding
        title={intl.formatMessage(messages.title)}
        headerButtonTitle={intl.formatMessage(messages.show_all)}
        headerButtonTo={`/${account.get('acct')}/media`}
      > 
        {
          attachments.size > 0 &&
          <div className={[_s.default, _s.flexRow, _s.flexWrap, _s.px10, _s.py10].join(' ')}>
            {
              attachments.slice(0, 16).map((attachment, i) => (
                <MediaItem
                  isSmall
                  key={attachment.get('id')}
                  attachment={attachment}
                  account={account}
                />
              ))
            }
          </div>
        }
      </PanelLayout>
    )
  }
}
