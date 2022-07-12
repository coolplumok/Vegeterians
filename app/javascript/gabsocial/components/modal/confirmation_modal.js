import { injectIntl, FormattedMessage } from 'react-intl'
import Block from '../block'
import Button from '../button'
import Heading from '../heading'
import Text from '../text'

export default
@injectIntl
class ConfirmationModal extends PureComponent {

  static propTypes = {
    title: PropTypes.any.isRequired,
    message: PropTypes.any.isRequired,
    confirm: PropTypes.any.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    onCancel: PropTypes.func,
  }

  componentDidMount() {
    this.button.focus()
  }

  handleClick = () => {
    this.props.onClose()
    this.props.onConfirm()
  }

  handleCancel = () => {
    const { onClose, onCancel } = this.props
    onClose()
    if (onCancel) onCancel()
  }

  setRef = (c) => {
    this.button = c
  }

  render() {
    const {
      title,
      message,
      confirm,
    } = this.props

    return (
      <div className={_s.width330PX}>
        <Block>
          <div className={[_s.default, _s.px15, _s.py15].join(' ')}>
            <div className={[_s.default, _s.px15, _s.py15].join(' ')}>

              <Heading size='h1' isCentered>
                {title}
              </Heading>

              <div className={[_s.default, _s.mt10].join(' ')}>
                <Text align='center' color='secondary'>
                  {message}
                </Text>

                <div className={[_s.default, _s.flexRow, _s.mt10, _s.pt10].join(' ')}>
                  <Button
                    backgroundColor='tertiary'
                    color='primary'
                    onClick={this.handleCancel}
                    className={[_s.mr10, _s.flexGrow1].join(' ')}
                  >
                    <Text size='medium' weight='bold' align='center' color='inherit'>
                      <FormattedMessage id='confirmation_modal.cancel' defaultMessage='Cancel' />
                    </Text>
                  </Button>
                
                  <Button 
                    backgroundColor='brand'
                    color='white'
                    onClick={this.handleClick}
                    ref={this.setRef}
                    className={_s.flexGrow1}
                  >
                    <Text size='medium' weight='bold' align='center' color='inherit'>
                      {confirm}
                    </Text>
                  </Button>
                </div>

              </div>

            </div>
          </div>
        </Block>
      </div>
    )
  }

}
