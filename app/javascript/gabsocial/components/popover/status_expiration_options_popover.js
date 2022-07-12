import { defineMessages, injectIntl } from 'react-intl'
import { closePopover } from '../../actions/popover'
import { changeExpiresAt } from '../../actions/compose'
import {
  STATUS_EXPIRATION_OPTION_5_MINUTES,
  STATUS_EXPIRATION_OPTION_60_MINUTES,
  STATUS_EXPIRATION_OPTION_6_HOURS,
  STATUS_EXPIRATION_OPTION_24_HOURS,
  STATUS_EXPIRATION_OPTION_3_DAYS,
  STATUS_EXPIRATION_OPTION_7_DAYS,
} from '../../constants'
import PopoverLayout from './popover_layout'
import List from '../list'

const messages = defineMessages({
  minutes: { id: 'intervals.full.minutes', defaultMessage: '{number, plural, one {# minute} other {# minutes}}' },
  hours: { id: 'intervals.full.hours', defaultMessage: '{number, plural, one {# hour} other {# hours}}' },
  days: { id: 'intervals.full.days', defaultMessage: '{number, plural, one {# day} other {# days}}' },
})

const mapStateToProps = (state) => ({
  expiresAtValue: state.getIn(['compose', 'expires_at']),
})

const mapDispatchToProps = (dispatch) => ({
  onChangeExpiresAt(expiresAt)  {
    dispatch(changeExpiresAt(expiresAt))
  },
  onClosePopover() {
    dispatch(closePopover())
  },
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class StatusExpirationOptionsPopover extends PureComponent {

  static defaultProps = {
    expiresAtValue: PropTypes.string.isRequired,
    intl: PropTypes.object.isRequired,
    isXS: PropTypes.bool,
    onChangeExpiresAt: PropTypes.func.isRequired,
  }

  handleOnSetStatusExpiration = (expiresAt) => {
    this.props.onChangeExpiresAt(expiresAt)
    this.handleOnClosePopover()
  }

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  render() {
    const {
      expiresAtValue,
      intl,
      isXS,
    } = this.props

    const listItems = [
      {
        hideArrow: true,
        title: intl.formatMessage(messages.minutes, { number: 5 }),
        onClick: () => this.handleOnSetStatusExpiration(STATUS_EXPIRATION_OPTION_5_MINUTES),
        isActive: expiresAtValue === STATUS_EXPIRATION_OPTION_5_MINUTES,
      },
      {
        hideArrow: true,
        title: intl.formatMessage(messages.minutes, { number: 60 }),
        onClick: () => this.handleOnSetStatusExpiration(STATUS_EXPIRATION_OPTION_60_MINUTES),
        isActive: expiresAtValue === STATUS_EXPIRATION_OPTION_60_MINUTES,
      },
      {
        hideArrow: true,
        title: '6 hours',
        title: intl.formatMessage(messages.hours, { number: 6 }),
        onClick: () => this.handleOnSetStatusExpiration(STATUS_EXPIRATION_OPTION_6_HOURS),
        isActive: expiresAtValue === STATUS_EXPIRATION_OPTION_6_HOURS,
      },
      {
        hideArrow: true,
        title: intl.formatMessage(messages.hours, { number: 24 }),
        onClick: () => this.handleOnSetStatusExpiration(STATUS_EXPIRATION_OPTION_24_HOURS),
        isActive: expiresAtValue === STATUS_EXPIRATION_OPTION_24_HOURS,
      },
      {
        hideArrow: true,
        title: '3 days',
        title: intl.formatMessage(messages.days, { number: 3 }),
        onClick: () => this.handleOnSetStatusExpiration(STATUS_EXPIRATION_OPTION_3_DAYS),
        isActive: expiresAtValue === STATUS_EXPIRATION_OPTION_3_DAYS,
      },
      {
        hideArrow: true,
        title: intl.formatMessage(messages.days, { number: 7 }),
        onClick: () => this.handleOnSetStatusExpiration(STATUS_EXPIRATION_OPTION_7_DAYS),
        isActive: expiresAtValue === STATUS_EXPIRATION_OPTION_7_DAYS,
      },
    ]

    if (expiresAtValue) {
      listItems.unshift({
        hideArrow: true,
        title: 'Remove expiration',
        onClick: () => this.handleOnSetStatusExpiration(null),
      },)
    }

    return (
      <PopoverLayout
        width={210}
        isXS={isXS}
        onClose={this.handleOnClosePopover}
      >
        <List
          scrollKey='group_list_sort_options'
          items={listItems}
          size={isXS ? 'large' : 'small'}
        />
      </PopoverLayout>
    )
  }

}