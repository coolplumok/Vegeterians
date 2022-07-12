import DatePicker from 'react-datepicker'
import { FormattedMessage } from 'react-intl'
import moment from 'moment-mini'
import { changeScheduledAt } from '../../actions/compose'
import { openModal } from '../../actions/modal'
import { closePopover } from '../../actions/popover'
import { me } from '../../initial_state'
import { MODAL_PRO_UPGRADE } from '../../constants'
import PopoverLayout from './popover_layout'
import Button from '../button'
import Text from '../text'

import '!style-loader!css-loader!react-datepicker/dist/react-datepicker.css'

const mapStateToProps = (state) => ({
  date: state.getIn(['compose', 'scheduled_at']),
  isPro: state.getIn(['accounts', me, 'is_pro']),
  isProPlus: state.getIn(['accounts', me, 'is_proplus']),
})

const mapDispatchToProps = (dispatch) => ({
  setScheduledAt (date, isPro ,isProPlus) {
    if (isPro || isProPlus) {
      dispatch(changeScheduledAt(date))
      if (!date) {
        dispatch(closePopover())
      }
    } else {
      dispatch(closePopover())
      return dispatch(openModal(MODAL_PRO_UPGRADE))
    }
  },

  onClosePopover: () => dispatch(closePopover())
})

export default
@connect(mapStateToProps, mapDispatchToProps)
class DatePickerPopover extends PureComponent {

  static propTypes = {
    date: PropTypes.instanceOf(Date),
    setScheduledAt: PropTypes.func.isRequired,
    isPro: PropTypes.bool,
    position: PropTypes.string,
    small: PropTypes.bool,
    isXS: PropTypes.bool,
    onClosePopover: PropTypes.func.isRequired,
  }

  handleSetDate = (date) => {
    this.props.setScheduledAt(date, this.props.isPro, this.props.isProPlus)
  }
  
  handleRemoveDate = () => {
    this.props.setScheduledAt(null, this.props.isPro, this.props.isProPlus)
  }

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  render() {
    const { date, isPro, isProPlus, isXS } = this.props
    const datePickerDisabled = (isPro || isProPlus) ? false : true

    return (
      <PopoverLayout
        width={360}
        isXS={isXS}
        onClose={this.handleOnClosePopover}
      >
        <div className={[_s.default, _s.bgSubtle].join(' ')}>
          <DatePicker
            inline
            target={this}
            className='schedule-post-dropdown__datepicker'
            minDate={new Date()}
            selected={date}
            onChange={date => this.handleSetDate(date)}
            timeFormat='p'
            timeIntervals={15}
            timeCaption='Time'
            dateFormat='MMM d, yyyy h:mm aa'
            disabled={datePickerDisabled}
            showTimeSelect
            popperModifiers={{
              offset: {
                enabled: true,
                offset: '0px, 5px'
              },
              preventOverflow: {
                enabled: true,
                escapeWithReference: false,
                boundariesElement: 'viewport'
              }
            }}
          />
        </div>
        {
          date &&
          <div className={[_s.default, _s.alignItemsCenter, _s.flexRow, _s.px10, _s.py10, _s.borderTop1PX, _s.borderColorSecondary].join(' ')}>
            <Text size='extraSmall' color='secondary'>
              <FormattedMessage id='scheduled_for_datetime' defaultMessage='Scheduled for {datetime}' values={{
                datetime: moment.utc(date).format('lll'),
              }}/>
            </Text>
            <div className={_s.mlAuto}>
              <Button
                isNarrow
                radiusSmall
                color='primary'
                backgroundColor='tertiary'
                onClick={this.handleRemoveDate}
              >
                <Text color='inherit' size='small'>
                  <FormattedMessage id='remove' defaultMessage='Remove' />
                </Text>
              </Button>
            </div>
          </div>
        }
      </PopoverLayout>
    )
  }
  
}