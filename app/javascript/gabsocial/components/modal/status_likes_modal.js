import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import StatusLikes from '../../features/status_likes'
import ModalLayout from './modal_layout'

const messages = defineMessages({
  title: { id: 'likes', defaultMessage: 'Likes' },
})

export default
@injectIntl
class StatusLikesModal extends ImmutablePureComponent {

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
        <StatusLikes params={params} />
      </ModalLayout>
    )
  }

}
