import { CX } from '../constants'
import Button from './button'
import Text from './text'

export default class ProgressBar extends PureComponent {

  static propTypes = {
    progress: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    small: PropTypes.bool,
    title: PropTypes.string,
    href: PropTypes.string,
  }

  render() {
    const {
      progress,
      small,
      title,
      href,
    } = this.props

    const completed = Math.min(parseFloat(progress), 100)
    const style = {
      width: `${completed}%`,
    }

    const containerClassName = CX({
      default: 1,
      bgLoading: !small,
      bgSecondary: small,
      noUnderline: 1,
      circle: 1,
      overflowHidden: 1,
      cursorPointer: 1,
      height22PX: !small,
      height4PX: small,
    })

    return (
      <Button 
        href={href}
        noClasses
        className={containerClassName}
      >
        <div className={[_s.default, _s.bgBrand, _s.circle, _s.height100PC, _s.backgroundCandy].join(' ')} style={style} />
        <div className={[_s.default, _s.posAbs,  _s.width100PC, _s.height100PC, _s.alignItemsCenter, _s.justifyContentCenter].join(' ')}>
          {
            !!title &&
            <Text size='small' weight='bold' color='white' className={_s.textShadow}>
              {title}
            </Text>
          }
        </div>
      </Button>
    )
  }
}