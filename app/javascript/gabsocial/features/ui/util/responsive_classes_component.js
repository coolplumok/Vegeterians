import {
  BREAKPOINT_EXTRA_LARGE,
  BREAKPOINT_LARGE,
  BREAKPOINT_MEDIUM,
  BREAKPOINT_SMALL,
  BREAKPOINT_EXTRA_SMALL,
} from '../../../constants'
import { getWindowDimension } from '../../../utils/is_mobile'

const initialState = getWindowDimension()

export default class ResponsiveClassesComponent extends PureComponent {

  static propTypes = {
    classNames: PropTypes.string,
    classNamesXL: PropTypes.string,
    classNamesLarge: PropTypes.string,
    classNamesMedium: PropTypes.string,
    classNamesSmall: PropTypes.string,
    classNamesXS: PropTypes.string,
  }

  state = {
    width: initialState.width,
  }

  componentDidMount() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize, false)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false)
  }

  handleResize = () => {
    const { width } = getWindowDimension()

    this.setState({ width })
  }

  render() {
    const {
      children,
      classNames,
      classNamesXL,
      classNamesLarge,
      classNamesMedium,
      classNamesSmall,
      classNamesXS,
    } = this.props
    const { width } = this.state

    let classes;
    if (width >= BREAKPOINT_EXTRA_LARGE) {
      classes = classNamesXL || classNames
    } else if (width < BREAKPOINT_EXTRA_LARGE && width >= BREAKPOINT_LARGE) {
      classes = classNames //default
    } else if (width < BREAKPOINT_LARGE && width >= BREAKPOINT_MEDIUM) {
      classes = classNamesLarge || classNames
    } else if (width < BREAKPOINT_MEDIUM && width >= BREAKPOINT_SMALL) {
      classes = classNamesMedium || classNamesLarge || classNames
    } else if (width < BREAKPOINT_SMALL && width >= BREAKPOINT_EXTRA_SMALL) {
      classes = classNamesSmall || classNamesMedium || classNamesLarge || classNames
    } else {
      classes = classNamesXS || classNamesSmall || classNamesMedium || classNamesLarge || classNames
    }

    return (
      <div className={classes}>
        {children}
      </div>
    )
  }

}