import { CX } from '../constants'
import Text from './text'

export default class Switch extends PureComponent {

  static propTypes = {
    id: PropTypes.string.isRequired,
    description: PropTypes.string,
    label: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    disabled: PropTypes.bool,
    labelProps: PropTypes.object,
  }

  render() {
    const {
      id,
      description,
      label,
      checked,
      onChange,
      onKeyDown,
      disabled,
      labelProps
    } = this.props

    const checkboxContainerClasses = CX({
      cursorPointer: 1,
      default: 1,
      height24PX: 1,
      width50PX: 1,
      circle: 1,
      border1PX: 1,
      mlAuto: 1,
      bgPrimary: 1,
      borderColorSecondary: 1,
      bgBrand: checked,
    })

    const checkboxLabelClasses = CX({
      default: 1,
      m1PX: 1,
      height20PX: 1,
      width20PX: 1,
      circle: 1,
      posAbs: 1,
      bgSecondary: !checked,
      bgPrimary: checked,
      left0: !checked,
      right0: checked,
    })

    return (
      <div className={[_s.default, _s.flexRow, _s.py5, _s.alignItemsCenter].join(' ')}>
        <Text {...labelProps} className={_s.mr10}>
          {label}
        </Text>

        <label className={checkboxContainerClasses} htmlFor={id}>
          <span className={checkboxLabelClasses} />
          <input type='checkbox' id={id} onChange={onChange} disabled={disabled} className={[_s.visibilityHidden].join(' ')} />
        </label>
      </div>
    )
  }

}