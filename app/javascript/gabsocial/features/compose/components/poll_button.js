import { defineMessages, injectIntl } from 'react-intl'
import { addPoll, removePoll } from '../../../actions/compose'
import ComposeExtraButton from './compose_extra_button'

const messages = defineMessages({
  add_poll: { id: 'poll_button.add_poll', defaultMessage: 'Add poll' },
  title: { id: 'poll_button.title', defaultMessage: 'Poll' },
  remove_poll: { id: 'poll_button.remove_poll', defaultMessage: 'Remove poll' },
})

const mapStateToProps = (state) => ({
  unavailable: state.getIn(['compose', 'is_uploading']) || (state.getIn(['compose', 'media_attachments']).size > 0),
  active: state.getIn(['compose', 'poll']) !== null,
})

const mapDispatchToProps = (dispatch) => ({

  onClick() {
    dispatch((_, getState) => {
      if (getState().getIn(['compose', 'poll'])) {
        dispatch(removePoll())
      } else {
        dispatch(addPoll())
      }
    })
  },

})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class PollButton extends PureComponent {

  static propTypes = {
    disabled: PropTypes.bool,
    unavailable: PropTypes.bool,
    active: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    small: PropTypes.bool,
  }

  handleClick = () => {
    this.props.onClick()
  }

  render() {
    const { intl, active, unavailable, disabled, small } = this.props

    if (unavailable) return null

    return (
      <ComposeExtraButton
        title={intl.formatMessage(active ? messages.remove_poll : messages.title)}
        disabled={disabled}
        onClick={this.handleClick}
        icon='poll'
        small={small}
        active={active}
      />
    )
  }

}
