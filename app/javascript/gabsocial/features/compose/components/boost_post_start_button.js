import { injectIntl, defineMessages } from 'react-intl'
import { changeRichTextEditorControlsVisibility } from '../../../actions/compose'
import { openModal } from '../../../actions/modal'
import { me } from '../../../initial_state'
import ComposeExtraButton from './compose_extra_button'

const messages = defineMessages({
  marked: { id: 'compose_form.spoiler.marked', defaultMessage: 'Text is hidden behind warning' },
  unmarked: { id: 'compose_form.spoiler.unmarked', defaultMessage: 'Text is not hidden' },
  title: { id: 'compose_form.rte.title', defaultMessage: 'Boost your Post to show on free users Home feed' },
})

const mapStateToProps = (state) => ({
  active: state.getIn(['compose', 'rte_controls_visible']),
  isPro: state.getIn(['accounts', me, 'is_pro']),
  isProPlus: state.getIn(['accounts', me, 'is_proplus']),
})

const mapDispatchToProps = (dispatch) => ({

  onChangeRichTextEditorControlsVisibility() {
    dispatch(changeRichTextEditorControlsVisibility())
  },

  onOpenProUpgradeModal() {
    dispatch(openModal('PRO_UPGRADE'))
  },
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class BoostPostStartButton extends PureComponent {

  static propTypes = {
    active: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    small: PropTypes.bool,
    isPro: PropTypes.bool,
    isProPlus: PropTypes.bool,
    onOpenProUpgradeModal: PropTypes.func.isRequired,
    onChangeRichTextEditorControlsVisibility: PropTypes.func.isRequired,
  }

  render() {
    const { active, intl, small } = this.props

    return (
      <div>
        <img src="/image.png" title={intl.formatMessage(messages.title)} style={{width: 25,height: 25, marginTop: 7, paddingLeft: 10, marginRight: 14}} />
      </div>
    )
  }

}
