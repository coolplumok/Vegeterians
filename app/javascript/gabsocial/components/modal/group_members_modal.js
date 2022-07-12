import { defineMessages, injectIntl } from 'react-intl'
import ModalLayout from './modal_layout'
import GroupMembers from '../../features/group_members'

const messages = defineMessages({
  title: { id: 'group_members', defaultMessage: 'Group members' },
})

export default
@injectIntl
class GroupMembersModal extends PureComponent {

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
        <GroupMembers groupId={groupId} onCloseModal={onClose} />
      </ModalLayout>
    )
  }
}
