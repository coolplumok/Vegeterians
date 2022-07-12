import { getWindowDimension } from '../../../utils/is_mobile'

const initialState = getWindowDimension()

export default class Responsive extends PureComponent {

  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
  }

  static defaultProps = {
    min: 0,
    max: Infinity,
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

  shouldRender = (min, max, width) => {
    return width > min && width < max
  }

  render() {
    const { children, min, max } = this.props
    const { width } = this.state

    const shouldRender = this.shouldRender(min, max, width)

    return shouldRender ? children : null
  }

}