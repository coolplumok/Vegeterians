import { injectIntl, defineMessages } from 'react-intl'
import classNames from 'classnames/bind'
import { changeComposeVisibility } from '../../actions/compose'
import { closePopover } from '../../actions/popover'
import PopoverLayout from './popover_layout'
import Icon from '../icon'
import Text from '../text'

const cx = classNames.bind(_s)

const messages = defineMessages({
  public_short: { id: 'privacy.public.short', defaultMessage: 'Public' },
  public_long: { id: 'privacy.public.long', defaultMessage: 'Visible for anyone on or off Vegeterians.live' },
  unlisted_short: { id: 'privacy.unlisted.short', defaultMessage: 'Unlisted' },
  unlisted_long: { id: 'privacy.unlisted.long', defaultMessage: 'Do not show in public timelines' },
  private_short: { id: 'privacy.private.short', defaultMessage: 'Followers-only' },
  private_long: { id: 'privacy.private.long', defaultMessage: 'Visible for your followers only' },
  change_privacy: { id: 'privacy.change', defaultMessage: 'Adjust status privacy' },
  visibility: { id: 'privacy.visibility', defaultMessage: 'Visibility' },
})

const mapStateToProps = (state) => ({
  value: state.getIn(['compose', 'privacy']),
})

const mapDispatchToProps = (dispatch) => ({
  onChange (value) {
    dispatch(changeComposeVisibility(value))
    dispatch(closePopover())
  },
  onClosePopover: () => dispatch(closePopover()),
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class StatusVisibilityDropdown extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    isXS: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    onClosePopover: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }

  handleChange = (value) => {
    this.props.onChange(value)
  }

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  render () {
    const { intl, value, isXS } = this.props

    const options = [
      {
        icon: 'globe',
        value: 'public',
        title: intl.formatMessage(messages.public_short),
        subtitle: intl.formatMessage(messages.public_long)
      },
      {
        icon: 'unlock-filled',
        value: 'unlisted',
        title: intl.formatMessage(messages.unlisted_short),
        subtitle: intl.formatMessage(messages.unlisted_long)
      },
      {
        icon: 'lock-filled',
        value: 'private',
        title: intl.formatMessage(messages.private_short),
        subtitle: intl.formatMessage(messages.private_long)
      },
    ]

    return (
      <PopoverLayout
        width={300}
        isXS={isXS}
        onClose={this.handleOnClosePopover}
      >
        <div className={[_s.default].join(' ')}>
          {
            options.map((option, i) => {
              const isActive = option.value === value
              const isLast = i === options.length - 1

              const containerClasses = cx({
                default: 1,
                flexRow: 1,
                py10: 1,
                cursorPointer: 1,
                borderBottom1PX: !isLast,
                borderColorSecondary: !isLast,
                bgSubtle_onHover: !isActive,
                bgBrand: isActive,
              })

              const iconClasses = cx({
                ml10: 1,
                mt2: 1,
                fillPrimary: !isActive,
                fillWhite: isActive,
              })

              return (
                <div
                  role='button'
                  onClick={() => this.handleChange(option.value)}
                  className={containerClasses}
                >
                  <Icon id={option.icon} size='16px' className={iconClasses} />
                  <div className={[_s.default, _s.px10, _s.pt2].join(' ')}>
                    <Text size='medium' color={isActive ? 'white' : 'primary'}>
                      {option.title}
                    </Text>
                    <Text size='small' weight='medium' color={isActive ? 'white' : 'secondary'}>
                      {option.subtitle}
                    </Text>
                  </div>
                </div>
              )
            })
          }
        </div>
      </PopoverLayout>
    )
  }

}


