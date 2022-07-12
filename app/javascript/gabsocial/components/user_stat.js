import { NavLink } from 'react-router-dom'
import { CX } from '../constants'
import Text from './text'

/**
 * Renders a user stat component
 * @param {string} props.title - bottom title
 * @param {string} props.to - location to go to on click
 * @param {string} props.value - top value
 */
export default class UserStat extends PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object,
    ]).isRequired,
    isCentered: PropTypes.bool.isRequired,
  }

  state = {
    hovering: false,
  }

  handleOnMouseEnter = () => {
    this.setState({ hovering: true })
  }

  handleOnMouseLeave = () => {
    this.setState({ hovering: false })
  }

  render() {
    const {
      to,
      title,
      value,
      isCentered,
    } = this.props
    const { hovering } = this.state

    const align = isCentered ? 'center' : 'left'
    const containerClasses = CX({
      default: 1,
      cursorPointer: 1,
      noUnderline: 1,
      flexNormal: isCentered,
      flexGrow1: !isCentered,
      pr15: !isCentered,
    })

    return (
      <NavLink
        to={to}
        title={`${value} ${title}`}
        className={containerClasses}
        onMouseEnter={this.handleOnMouseEnter}
        onMouseLeave={this.handleOnMouseLeave}
      >
        <Text size='extraLarge' weight='bold' color='brand' align={align}>
          {value}
        </Text>
        <Text size='small' weight='medium' color='secondary' hasUnderline={hovering} align={align}>
          {title}
        </Text>
      </NavLink>
    )
  }

}