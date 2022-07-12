import { injectIntl, defineMessages } from 'react-intl'
import ComposeExtraButton from './compose_extra_button'
import { openModal } from '../../../actions/modal'

const messages = defineMessages({
  marked: { id: 'compose_form.spoiler.marked', defaultMessage: 'Text is hidden behind warning' },
  unmarked: { id: 'compose_form.spoiler.unmarked', defaultMessage: 'Text is not hidden' },
  title: { id: 'compose_form.gif.title', defaultMessage: 'Insert gif' },
})

const mapStateToProps = (state) => ({
  active: !!state.getIn(['compose', 'gif']) || state.getIn(['modal', 'modalType']) === 'GIF_PICKER',
})

const mapDispatchToProps = (dispatch) => ({

  onClick() {
    dispatch(openModal('GIF_PICKER'))
  },

})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class GifSelectorButton extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    active: PropTypes.bool,
    small: PropTypes.bool,
  }

  handleClick = (e) => {
    e.preventDefault()
    this.props.onClick(this.button)
  }

  setButton = (n) => {
    this.button = n
  }

  render() {
    const { active, small, intl } = this.props

    return (
      <ComposeExtraButton
        title={intl.formatMessage(messages.title)}
        onClick={this.handleClick}
        icon='gif'
        small={small}
        active={active}
        buttonRef={this.setButton}
      />
    )
  }

}
