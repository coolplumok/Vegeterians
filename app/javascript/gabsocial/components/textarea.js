import classNames from 'classnames/bind'
import Text from './text'

const cx = classNames.bind(_s)

export default class Textarea extends PureComponent {
  static propTypes = {
    placeholder: PropTypes.string,
    prependIcon: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onKeyUp: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    title: PropTypes.string,
    required: PropTypes.bool,
  }

  handleOnChange = (e) => {
    this.props.onChange(e.target.value)
  }

  render() {
    const {
      placeholder,
      prependIcon,
      value,
      onKeyUp,
      onFocus,
      onBlur,
      title,
      required,
    } = this.props

    const inputClasses = cx({
      default: 1,
      text: 1,
      outlineNone: 1,
      lineHeight125: 1,
      displayBlock: 1,
      py10: 1,
      bgTransparent: 1,
      fs15PX: 1,
      flexGrow1: 1,
      heightMax100VH: 1,
      resizeVertical: 1,
      colorPrimary: 1,
      px5: !!prependIcon,
      pl15: !prependIcon,
    })

    return (
      <div>
        {
          !!title &&
          <div className={[_s.default, _s.mb10, _s.pl15].join(' ')}>
            <Text size='small' weight='medium' color='secondary'>
              {title}
              {
                !!required &&
                <span className={[_s.colorBrand, _s.pl5].join(' ')}>*</span>
              }
            </Text>
          </div>
        }
        <div className={[_s.default, _s.bgPrimary, _s.border1PX, _s.borderColorSecondary, _s.flexRow, _s.radiusSmall, _s.alignItemsCenter].join(' ')}>
          <textarea
            className={inputClasses}
            type='text'
            placeholder={placeholder}
            value={value}
            onChange={this.handleOnChange}
            onKeyUp={onKeyUp}
            onFocus={onFocus}
            onBlur={onBlur}
          />

        </div>
      </div>
    )
  }
}