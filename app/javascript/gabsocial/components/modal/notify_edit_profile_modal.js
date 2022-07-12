import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { openModal } from '../../actions/modal'
import { MODAL_EDIT_PROFILE } from '../../constants'
import ModalLayout from './modal_layout'
import Button from '../button'
import Text from '../text'

const messages = defineMessages({
  title: { id: 'notify_edit_profile_title', defaultMessage: 'Notify' },
  content: { id: 'notify_edit_profile_content', defaultMessage: 'You have not yet uploaded an avatar, background image or bio. Please set these now before you continue, so that the community can know a little more about you.' },
  editProfile: { id: 'edit_profile', defaultMessage: 'Edit Profile' },
})

const mapStateToProps = (state) => ({
  settings: state.getIn(['settings', 'home']),
})

const mapDispatchToProps = (dispatch, {onClose}) => {
  return {
    onEditProfile() {
      onClose()
      dispatch(openModal(MODAL_EDIT_PROFILE))
    },
  }
}

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class HomeTimelineSettingsModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onEditProfile: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  handleEditProfile = () => {
    this.props.onEditProfile()
  }

  render() {
    const { intl, onClose } = this.props

    return (
      <ModalLayout
        width={320}
        title={intl.formatMessage(messages.title)}
        onClose={onClose}
      >
        <div className={[_s.default, _s.pb10].join(' ')}>
          <Text color='inherit' align='center'>
            {intl.formatMessage(messages.content)}
          </Text>
        </div>
        <Button
          backgroundColor='brand'
          color='white'
          className={_s.justifyContentCenter}
          onClick={this.handleEditProfile}
        >
          <Text color='inherit' weight='bold' align='center'>
            {intl.formatMessage(messages.editProfile)}
          </Text>
        </Button>
      </ModalLayout>
    )
  }
}
