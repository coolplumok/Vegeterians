import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { openModal } from '../../actions/modal'
import ModalLayout from './modal_layout'
import Text from '../text'

export default
@injectIntl
class UpgradeFlashMessage extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  render() {
    const { intl, onClose } = this.props
    const success = window.location.href.indexOf('success')
    const error = window.location.href.indexOf('error')

    return (
      <ModalLayout
        width={320}
        title= 'Notify'
        onClose={onClose}
        className={"flash_modal"}
      >
        <div style={{overflow:"initial"}}>
          <Text color='inherit' align='center'>
            {success != -1 ? "Your plan successfully upgraded" : error != -1 ? "Something went wrong" : "Successfully updated your plan"}
          </Text>
        </div>
      </ModalLayout>
    )
  }
}
