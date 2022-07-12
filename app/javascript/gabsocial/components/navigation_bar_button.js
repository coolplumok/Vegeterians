import { CX } from '../constants'
import Button from './button'
import Icon from './icon'
import Text from './text'

export default class NavigationBarButton extends PureComponent {

  static propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    to: PropTypes.string,
    href: PropTypes.string,
    attrTitle: PropTypes.string,
  }

  render() {
    const {
      title,
      icon,
      to,
      href,
      attrTitle,
    } = this.props

    const active = false

    const classes = CX({
      default: 1,
      height53PX: 1,
      flexRow: 1,
      alignItemsCenter: 1,
      justifyContentCenter: 1,
      outlineNone: 1,
      cursorPointer: 1,
      bgTransparent: 1,
      noUnderline: 1,
      colorNavigation: 1,
      px10: !!title,
      px5: !title,
      colorWhite: !!title,
      fs13PX: !!title,
      fontWeightNormal: !!title,
    })

    const iconClasses = CX({
      fillNavigation: !!title || active,
      fillNavigationBlend: !title,
      mr10: !!title,
    })

    const iconSize = !!title ? '16px' : '18px'

    return (
      <Button
        to={to}
        href={href}
        title={attrTitle}
        className={classes}
        noClasses
      >
        <Icon className={iconClasses} id={icon} size={iconSize} />
        {
          !!title &&
          <Text color='white'>
            {title}
          </Text>
        }
      </Button>
    )
  }

}