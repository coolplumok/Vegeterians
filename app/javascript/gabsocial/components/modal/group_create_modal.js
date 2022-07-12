import { defineMessages, injectIntl } from 'react-intl'
import ModalLayout from './modal_layout'
import GroupCreate from '../../features/group_create'

const messages = defineMessages({
  title: { id: 'create_group', defaultMessage: 'Create group' },
  update: { id: 'groups.form.update', defaultMessage: 'Update group' },
})

export default
@injectIntl
class GroupCreateModal extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    groupId: PropTypes.string,
  }

  render() {
    const { intl, onClose, groupId } = this.props

    const title = intl.formatMessage(groupId ? messages.update : messages.title)

    return (
      <ModalLayout
        title={title}
        width={440}
        onClose={onClose}
      >
        <GroupCreate onCloseModal={onClose} params={{ id: groupId }} />
      </ModalLayout>
    )
  }
}
