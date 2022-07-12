import { defineMessages, injectIntl } from 'react-intl'
import {  MODAL_DISPLAY_OPTIONS } from '../../constants'
import { openModal } from '../../actions/modal'
import { closePopover } from '../../actions/popover'
import PopoverLayout from './popover_layout'
import List from '../list'

const messages = defineMessages({
  display: { id: 'display_options', defaultMessage: 'Display Options' },
  help: { id: 'getting_started.help', defaultMessage: 'Help' },
  settings: { id: 'settings', defaultMessage: 'Settings' },
  logout: { 'id': 'confirmations.logout.confirm', 'defaultMessage': 'Log out' },
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
  boosted: { id: 'navigation_bar.boosted', defaultMessage: 'Boosted Posts' },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Muted users' },
})

const mapDispatchToProps = (dispatch) => ({
  onOpenDisplayModal: () => {
    dispatch(closePopover())
    dispatch(openModal(MODAL_DISPLAY_OPTIONS))
  },
})

export default
@injectIntl
@connect(null, mapDispatchToProps)
class SidebarMorePopover extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onOpenDisplayModal: PropTypes.func.isRequired,
    isXS: PropTypes.bool,
  }

  handleOnOpenDisplayModal = () => {
    this.props.onOpenDisplayModal()
  }

  render() {
    const { intl, isXS } = this.props

    if (isXS) return null

    return (
      <PopoverLayout width={240}>
        <List
          size='small'
          scrollKey='profile_options'
          items={[
            {
              title: intl.formatMessage(messages.help),
              href: 'https://Vegeterians.network/help',
            },
            {
              title: intl.formatMessage(messages.display),
              onClick: this.handleOnOpenDisplayModal,
            },
            {
              title: intl.formatMessage(messages.blocks),
              to: '/settings/blocks',
            },
            {
              title: intl.formatMessage(messages.boosted),
              to: '/boosted/posts',
            },
            {
              title: intl.formatMessage(messages.mutes),
              to: '/settings/mutes',
            },
            {
              title: intl.formatMessage(messages.settings),
              href: '/settings/preferences',
            },
            {
              title: intl.formatMessage(messages.logout),
              href: '/auth/sign_out',
            },
          ]}
        />
      </PopoverLayout>
    )
  }
}
