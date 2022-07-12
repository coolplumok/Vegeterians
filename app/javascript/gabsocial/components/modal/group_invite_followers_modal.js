import { defineMessages, injectIntl } from 'react-intl'
import ModalLayout from './modal_layout'
import GroupInviteFollowers from '../../features/group_invite_followers'

const messages = defineMessages({
  title: { id: 'invite_to_group', defaultMessage: 'Invite to group' },
})

export default
@injectIntl
class GroupInviteFollowersModal extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    groupId: PropTypes.string,
  }

  render() {
    const { intl, onClose, groupId } = this.props

    const title = intl.formatMessage(messages.title)

    return (
      <ModalLayout
        title={title}
        width={440}
        onClose={onClose}
        noPadding
      >
        <GroupInviteFollowers groupId={groupId} />
      </ModalLayout>
    )
  }
}
