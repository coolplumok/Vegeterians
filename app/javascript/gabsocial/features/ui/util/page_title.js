import isEqual from 'lodash.isequal'

export default class PageTitle extends PureComponent {
  static propTypes = {
    badge: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    path: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
  }

  componentDidMount() {
    this.updatePageTitle(this.props)
  }

  componentDidUpdate(prevProps) {
    if (this.props.badge !== prevProps.badge || !isEqual(this.props.path, prevProps.path)) {
      this.updatePageTitle(this.props)
    }
  }

  updatePageTitle = ({ badge, path}) => {
    const site = 'Vegeterians.live'

    let realPath = Array.isArray(path) ? path.join(' / ') : path
    realPath = realPath.trim()

    const realBadge = !!badge ? `(${badge})` : ''

    const title = `${realBadge} ${realPath} / ${site}`.trim()

    document.title = title
  }

  render() {
    return null
  }
}
