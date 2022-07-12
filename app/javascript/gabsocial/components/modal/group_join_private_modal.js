import { defineMessages, injectIntl } from 'react-intl'
import ModalLayout from './modal_layout'
import GroupJoinPrivate from '../../features/group_join_private'

const messages = defineMessages({
  title: { id: 'create_group', defaultMessage: 'Private Group' },
  update: { id: 'groups.form.update', defaultMessage: 'Update group' },
})

export default
@injectIntl
class GroupJoinPrivateModal extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    groupId: PropTypes.string,
  }

  render() {
    const { intl, onClose, groupId } = this.props

    if (!groupId) return

    return (
      <ModalLayout
        title={intl.formatMessage(messages.title)}
        width={440}
        onClose={onClose}
      >
        <GroupJoinPrivate onCloseModal={onClose} params={{ id: groupId }} />
      </ModalLayout>
    )
  }
}
