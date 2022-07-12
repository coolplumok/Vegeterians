import { injectIntl, defineMessages } from 'react-intl'
import Button from './button'
import Text from './text'

const messages = defineMessages({
  load_more: { id: 'status.load_more', defaultMessage: 'Load more' },
})

export default
@injectIntl
class LoadMore extends PureComponent {

  static propTypes = {
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    visible: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    loadmoreMessage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
  }

  static defaultProps = {
    visible: true,
  }

  handleClick = (e) => {
    this.props.onClick(e)
  }

  render() {
    const {
      disabled,
      visible,
      intl,
      loadmoreMessage,
    } = this.props

    if (!visible || disabled) return null

    const message = !loadmoreMessage ? intl.formatMessage(messages['load_more']) : loadmoreMessage

    return (
      <div className={[_s.default, _s.py15, _s.px10, _s.width100PC].join(' ')}>
        <Button
          isBlock
          radiusSmall
          backgroundColor='tertiary'
          color='primary'
          disabled={disabled || !visible}
          style={{
            visibility: visible ? 'visible' : 'hidden',
          }}
          onClick={this.handleClick}
          aria-label={message}
        >
          <Text color='inherit' align='center'>
            {message}
          </Text>
        </Button>
      </div>
    )
  }

}