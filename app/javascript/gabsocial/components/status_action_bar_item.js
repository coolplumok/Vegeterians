import {
  CX,
  BREAKPOINT_EXTRA_SMALL,
} from '../constants'
import Responsive from '../features/ui/util/responsive_component'
import Button from './button'
import Text from './text'

export default class StatusActionBarItem extends PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    altTitle: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    buttonRef: PropTypes.oneOf([
      PropTypes.func,
      PropTypes.node,
    ]),
  }

  render() {
    const {
      title,
      onClick,
      icon,
      active,
      disabled,
      buttonRef,
      altTitle
    } = this.props

    const btnClasses = CX({
      justifyContentCenter: 1,
      alignItemsCenter: 1,
      px10: 1,
      bgSubtle_onHover: !disabled,
    })

    const iconClasses = CX({
      default: 1,
      inheritFill: 1,
      mr10: !!title,
    })

    const color = active ? 'brand' : 'secondary'
    const weight = active ? 'bold' : 'medium'

    return (
      <div className={[_s.default, _s.px5, _s.flexNormal].join(' ')}>
        <Button
          isBlock
          radiusSmall
          backgroundColor='none'
          title={altTitle}
          color={color}
          buttonRef={buttonRef}
          className={btnClasses}
          onClick={onClick}
          isDisabled={disabled}
          icon={icon}
          iconSize='16px'
          iconClassName={iconClasses}
        > 
          {
            !!title &&
            <Responsive min={BREAKPOINT_EXTRA_SMALL}>
              <Text color='inherit' size='small' weight={weight}>
                {title}
              </Text>
            </Responsive>
          }
        </Button>
      </div>
    )
  }

}