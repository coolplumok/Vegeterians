import { defineMessages, injectIntl } from 'react-intl'
import ModalLayout from './modal_layout'
import GroupPendingApplications from '../../features/group_pending_applications'

const messages = defineMessages({
  title: { id: 'pending_applications', defaultMessage: 'Pending Applications' },
})

export default
@injectIntl
class GroupPendingApplicationsModal extends PureComponent {

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
        <GroupPendingApplications groupId={groupId} />
      </ModalLayout>
    )
  }
}
