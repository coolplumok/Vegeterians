import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import Button from '../button'
import StatusContainer from '../../containers/status_container'
import Text from '../text'
import ModalLayout from './modal_layout'

const messages = defineMessages({
  removeRepost: { id: 'status.cancel_repost_private', defaultMessage: 'Remove Repost' },
  repost: { id: 'status.repost', defaultMessage: 'Repost' },
  combo: { id: 'boost_modal.combo', defaultMessage: 'You can press Shift + Repost to skip this next time' },
})

export default
@injectIntl
class BoostModal extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    onRepost: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.button.focus()
  }

  handleRepost = () => {
    this.props.onRepost(this.props.status)
    this.props.onClose()
  }

  setRef = (c) => {
    this.button = c
  }

  render () {
    const { status, onClose, intl } = this.props
    
    const buttonText = status.get('reblogged') ? messages.removeRepost : messages.repost

    return (
      <ModalLayout
        title={intl.formatMessage(messages.repost)}
        noPadding
        width={480}
        onClose={onClose}
      >
      
      <div className={[_s.default, _s.px15, _s.py10, _s.mt5].join(' ')}>
        <StatusContainer
          contextType='boost-modal'
          id={status.get('id')}
          isChild
        />
      </div>

        <div className={[_s.default, _s.justifyContentCenter, _s.px15, _s.mt5, _s.mb15].join(' ')}>
          <Text align='center'>
            {intl.formatMessage(messages.combo)}
          </Text>
          <div className={[_s.default, _s.flexRow, _s.justifyContentCenter, _s.my10, _s.pt15, _s.pb5].join(' ')}>
            <Button onClick={this.handleRepost} buttonRef={this.setRef}>
              <Text color='inherit' className={_s.px15}>
                {intl.formatMessage(buttonText)}
              </Text>
            </Button>
          </div>
        </div>
      </ModalLayout>
    )
  }

}
