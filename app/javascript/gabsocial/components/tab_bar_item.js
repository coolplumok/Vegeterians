import { withRouter } from 'react-router-dom'
import { CX } from '../constants'
import Button from './button'
import Text from './text'

/**
 * Renders a tab bar item component
 * @param {bool} [props.isLarge] - to style the tab bar larger
 * @param {bool} [props.isActive] - if item is active
 * @param {func} [props.onClick] - function to call on click
 * @param {string} [props.title] - title to use
 * @param {string} [props.to] - location to direct to on click
 */
export default
@withRouter
class TabBarItem extends PureComponent {

  static propTypes = {
    isLarge: PropTypes.bool,
    isActive: PropTypes.bool,
    onClick: PropTypes.func,
    title: PropTypes.string,
    to: PropTypes.string,
  }

  state = {
    isCurrent: false,
  }

  componentDidMount() {
    this.checkIfCurrent()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location !== this.props.location) {
      this.checkIfCurrent()
    }
  }

  checkIfCurrent() {
    // If user navigates to different page, ensure tab bar item
    // with this.props.to that is on location is set to active.
    const isCurrent = this.props.to === this.props.location.pathname && !this.props.location.search

    if (this.state.isCurrent !== isCurrent) {
      this.setState({ isCurrent })
    }
  }

  render() {
    const {
      title,
      to,
      onClick,
      location,
      isLarge,
      isActive,
    } = this.props
    const { isCurrent } = this.state

    // Combine state, props, location to make absolutely
    // sure of active status.
    const active = isActive || (to === location.pathname && !location.search) || isCurrent

    const containerClasses = CX({
      default: 1,
      height100PC: 1,
      noUnderline: 1,
      text: 1,
      displayFlex: 1,
      alignItemsCenter: 1,
      justifyContentCenter: 1,
      borderBottom2PX: 1,
      py5: 1,
      outlineNone: 1,
      cursorPointer: 1,
      bgTransparent: 1,
      borderColorTransparent: !active,
      borderColorBrand: active,
      mr5: isLarge,
      mr2: !isLarge,
    })

    const textParentClasses = CX({
      default: 1,
      height100PC: 1,
      alignItemsCenter: 1,
      justifyContentCenter: 1,
      radiusSmall: 1,
      px10: !isLarge,
      px15: isLarge,
      bgSecondaryDark_onHover: !active,
    })

    const textOptions = {
      size: !!isLarge ? 'normal' : 'small',
      color: active ? 'brand' : isLarge ? 'secondary' : 'primary',
      weight: active ? 'bold' : isLarge ? 'medium' : 'normal',
    }

    return (
      <Button
        onClick={onClick}
        className={containerClasses}
        to={to || undefined}
        noClasses
      >
        <span className={textParentClasses}>
          <Text {...textOptions}>
            {title}
          </Text>
        </span>
      </Button>
    )
  }

}