import { Fragment } from 'react'
import classNames from 'classnames/bind'
import Button from './button'
import Icon from './icon'
import Image from './image'
import Text from './text'

const cx = classNames.bind(_s)

export default class ListItem extends PureComponent {

  static propTypes = {
    icon: PropTypes.string,
    image: PropTypes.string,
    isLast: PropTypes.bool,
    isHidden: PropTypes.bool,
    to: PropTypes.string,
    href: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    isActive: PropTypes.bool,
    actionIcon: PropTypes.bool,
    onClick: PropTypes.func,
    size: PropTypes.oneOf([
      'small',
      'large',
    ]),
    hideArrow: PropTypes.bool,
  }

  render() {
    const {
      title,
      isLast,
      to,
      href,
      onClick,
      actionIcon,
      size,
      icon,
      image,
      hideArrow,
      isHidden,
      subtitle,
      isActive,
    } = this.props

    if (!title) {
      return (
        <div className={[_s.default, _s.bgSecondary, _s.width100PC, _s.height4PX].join(' ')} />
      )
    }

    if (isHidden) {
      return (
        <Fragment>
          {title}
        </Fragment>
      )
    }

    const small = size === 'small'
    const large = size === 'large'

    const textSize = small ? 'normal' : large ? 'large' : 'normal'
    const iconSize = large ? '14px' : '10px'
    const imageSize = large ? '22px' : '18px'
    const showActive = isActive !== undefined

    const containerClasses = cx({
      default: 1,
      cursorPointer: 1,
      noUnderline: 1,
      px15: !small,
      py15: !small,
      px10: small,
      py10: small,
      flexRow: 1,
      alignItemsCenter: 1,
      width100PC: 1,
      outlineNone: 1,
      bgTransparent: 1,
      bgSubtle_onHover: 1,
      borderColorSecondary: !isLast,
      borderBottom1PX: !isLast,
    })

    const iconClasses = cx({
      mr10: !large,
      mr15: large,
      fillPrimary: !!icon,
      circle: !icon && !!image,
    })

    const textContainerClasses = cx({
      default: 1,
      pr5: 1,
      maxWidth100PC42PX: !hideArrow || showActive,
    })

    return (
      <Button
        to={to}
        href={href}
        onClick={onClick}
        className={containerClasses}
        noClasses
      >

        {
          !!image &&
          <Image
            src={image}
            height={imageSize}
            width={imageSize}
            className={iconClasses}
          />
        }

        {
          !!icon &&
          <Icon
            id={icon}
            size={iconSize}
            className={iconClasses}
          />
        }
        
        <div className={textContainerClasses}>
          <Text color='primary' weight={!!subtitle ? 'bold' : 'normal'} size={textSize} className={[_s.overflowHidden, _s.flexNormal, _s.textOverflowEllipsis].join(' ')}>
            {title}
          </Text>

          {
            !!subtitle &&
            <Text color='primary' size='small' className={[_s.overflowHidden, _s.flexNormal, _s.mt5].join(' ')}>
              {subtitle}
            </Text>
          }
        </div>

        {
          !hideArrow &&
          <Icon
            id={!!actionIcon ? actionIcon : 'angle-right'}
            size='10px'
            className={[_s.mlAuto, _s.fillSecondary, _s.flexShrink1].join(' ')}
          />
        }

        {
          !!showActive &&
          <input
            type='radio'
            checked={isActive}
            className={[_s.mlAuto, _s.flexShrink1].join(' ')}
          />
        }
      </Button>
    )
  }

}