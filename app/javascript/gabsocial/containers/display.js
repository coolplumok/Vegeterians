import {
  FONT_SIZES,
  THEMES,
  DEFAULT_THEME,
  DEFAULT_FONT_SIZE,
} from '../constants'

const mapStateToProps = (state) => ({
  fontSize: state.getIn(['settings', 'displayOptions', 'fontSize']),
  radiusSmallDisabled: state.getIn(['settings', 'displayOptions', 'radiusSmallDisabled']),
  radiusCircleDisabled: state.getIn(['settings', 'displayOptions', 'radiusCircleDisabled']),
  theme: state.getIn(['settings', 'displayOptions', 'theme']),
})

export default
@connect(mapStateToProps)
class Display extends PureComponent {

  static propTypes = {
    fontSize: PropTypes.string.isRequired,
    radiusSmallDisabled: PropTypes.bool.isRequired,
    radiusCircleDisabled: PropTypes.bool.isRequired,
    theme: PropTypes.string.isRequired,
  }

  state = {
    theme: this.props.theme,
    radiusSmallDisabled: this.props.radiusSmallDisabled,
    radiusCircleDisabled: this.props.radiusCircleDisabled,
    fontSize: this.props.fontSize,
  }

  static defaultProps = {
    theme: 'light',
    radiusSmallDisabled: true,
    radiusCircleDisabled: true,
    fontSize: 'normal',
  }

  componentDidMount() {
    this.updateTheme(this.state.theme)
    this.updateRadiusSmallDisabled(this.state.radiusSmallDisabled)
    this.updateRadiusCircleDisabled(this.state.radiusCircleDisabled)
    this.updateFontSizes(this.state.fontSize)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.theme !== prevState.theme ||
      nextProps.radiusSmallDisabled !== prevState.radiusSmallDisabled ||
      nextProps.radiusCircleDisabled !== prevState.radiusCircleDisabled ||
      nextProps.fontSize !== prevState.fontSize) {
      return {
        theme: nextProps.theme,
        radiusSmallDisabled: nextProps.radiusSmallDisabled,
        radiusCircleDisabled: nextProps.radiusCircleDisabled,
        fontSize: nextProps.fontSize,
      }
    }

    return null
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.theme !== this.state.theme) {
      this.updateTheme(this.state.theme)
    }

    if (prevState.radiusSmallDisabled !== this.state.radiusSmallDisabled) {
      this.updateRadiusSmallDisabled(this.state.radiusSmallDisabled)
    }

    if (prevState.radiusCircleDisabled !== this.state.radiusCircleDisabled) {
      this.updateRadiusCircleDisabled(this.state.radiusCircleDisabled)
    }
    
    if (prevState.fontSize !== this.state.fontSize) {
      this.updateFontSizes(this.state.fontSize)
    }
  }

  updateRadiusSmallDisabled(disabled) {
    if (disabled) {
      document.documentElement.setAttribute('no-radius', '');
    } else {
      document.documentElement.removeAttribute('no-radius')
    }
  }

  updateRadiusCircleDisabled(disabled) {
    if (disabled) {
      document.documentElement.setAttribute('no-circle', '');
    } else {
      document.documentElement.removeAttribute('no-circle')
    }
  }

  updateFontSizes(fontSize) {
    let correctedFontSize = fontSize.toLowerCase()
    if (!FONT_SIZES.hasOwnProperty(correctedFontSize)) {
      correctedFontSize = DEFAULT_FONT_SIZE
    }

    document.documentElement.style.setProperty('font-size', FONT_SIZES[correctedFontSize]);
  }

  updateTheme(theme) {
    let correctedTheme = theme.toLowerCase()
    if (THEMES.indexOf(correctedTheme) < 0) {
      correctedTheme = DEFAULT_THEME
    }

    document.documentElement.setAttribute('theme', correctedTheme);
  }

  render() {
    return this.props.children
  }

}