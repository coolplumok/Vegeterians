import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import StatusReposts from '../../features/status_reposts'
import ModalLayout from './modal_layout'

const messages = defineMessages({
  title: { id: 'reposts', defaultMessage: 'Reposts' },
})

export default
@injectIntl
class StatusRepostsModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    status: ImmutablePropTypes.map.isRequired,
  }

  render() {
    const {
      intl,
      onClose,
      status,
    } = this.props

    const params = {
      statusId: status.get('id'),
    }

    return (
      <ModalLayout
        title={intl.formatMessage(messages.title)}
        width={460}
        onClose={onClose}
        noPadding
      >
        <StatusReposts params={params} />
      </ModalLayout>
    )
  }

}
