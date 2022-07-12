import { defineMessages, injectIntl } from 'react-intl'
import ModalLayout from './modal_layout'
import GroupRemovedAccounts from '../../features/group_removed_accounts'

const messages = defineMessages({
  title: { id: 'group_removed', defaultMessage: 'Removed accounts' },
})

export default
@injectIntl
class GroupRemovedAccountsModal extends PureComponent {

  static propTypes = {
    groupId: PropTypes.string.isRequired,
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  render() {
    const {
      intl,
      onClose,
      groupId,
    } = this.props

    return (
      <ModalLayout
        title={intl.formatMessage(messages.title)}
        width={440}
        onClose={onClose}
        noPadding
      >
        <GroupRemovedAccounts groupId={groupId} onCloseModal={onClose} />
      </ModalLayout>
    )
  }
}
