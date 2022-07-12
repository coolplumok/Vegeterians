import { injectIntl, defineMessages } from 'react-intl'
import { changeComposeSensitivity } from '../../../actions/compose'
import Switch from '../../../components/switch'

const messages = defineMessages({
  markAsSensitive: { id: 'compose_form.sensitive.hide', defaultMessage: 'Mark media as sensitive' },
})

const mapStateToProps = (state) => ({
  active: state.getIn(['compose', 'sensitive']),
  disabled: state.getIn(['compose', 'spoiler']),
})

const mapDispatchToProps = (dispatch) => ({

  onClick () {
    dispatch(changeComposeSensitivity())
  },

})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class SensitiveMediaButton extends PureComponent {

  static propTypes = {
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  }

  render () {
    const { active, disabled, onClick, intl } = this.props

    return (
      <div className={[_s.default, _s.alignItemsStart, _s.px5].join(' ')}>
        <Switch
          id='mark-sensitive'
          type='checkbox'
          checked={active}
          onChange={onClick}
          disabled={disabled}
          label={intl.formatMessage(messages.markAsSensitive)}
        />
      </div>
    )
  }

}
