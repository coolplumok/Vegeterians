import { defineMessages, injectIntl } from 'react-intl'
import { openPopover } from '../../../actions/popover'
import ComposeExtraButton from './compose_extra_button'

const messages = defineMessages({
  emoji: { id: 'emoji_button.label', defaultMessage: 'Insert emoji' },
})

const mapStateToProps = (state) => ({
  active: state.getIn(['popover', 'popoverType']) === 'EMOJI_PICKER',
})

const mapDispatchToProps = (dispatch) => ({

  onClick(targetRef) {
    dispatch(openPopover('EMOJI_PICKER', {
      targetRef,
    }))
  },

})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class EmojiPickerButton extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    active: PropTypes.bool,
    small: PropTypes.bool,
    isMatch: PropTypes.bool,
  }

  handleClick = (e) => {
    e.preventDefault()
    this.props.onClick(this.button)
  }

  setButton = (n) => {
    this.button = n
  }

  render() {
    const {
      active,
      intl,
      isMatch,
      small,
    } = this.props

    return (
      <ComposeExtraButton
        title={intl.formatMessage(messages.emoji)}
        onClick={this.handleClick}
        icon='happy'
        small={small}
        active={active && isMatch}
        buttonRef={this.setButton}
      />
    )
  }

}
