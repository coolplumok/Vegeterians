import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import { me } from '../initial_state'
import { CX } from '../constants'
import {
  changeSearch,
  clearSearch,
  submitSearch,
  showSearch,
} from '../actions/search'
import Button from './button'

const mapStateToProps = (state) => ({
  value: state.getIn(['search', 'value']),
  submitted: state.getIn(['search', 'submitted']),
  theme: state.getIn(['settings', 'displayOptions', 'theme']),
})

const mapDispatchToProps = (dispatch) => ({
  onChange: (value) => dispatch(changeSearch(value)),
  onClear: () => dispatch(clearSearch()),
  onSubmit: () => dispatch(submitSearch()),
  onShow: () => dispatch(showSearch()),
})

export default
@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class Search extends PureComponent {

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static propTypes = {
    value: PropTypes.string.isRequired,
    submitted: PropTypes.bool,
    onShow: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    withOverlay: PropTypes.bool,
    onClear: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isInNav: PropTypes.bool.isRequired,
    theme: PropTypes.string,
  }

  state = {
    focused: false,
  }

  textbox = React.createRef()

  componentDidUpdate(prevProps) {
    // If user navigates to different page, ensure tab bar item
    // with this.props.to that is on location is set to active.
    if (this.props.location !== prevProps.location) {
      const isCurrent = this.props.to === this.props.location.pathname

      if (this.state.isCurrent !== isCurrent) {
        this.setState({ isCurrent })
      }
    }
  }

  handleOnChange = (e) => {
    this.props.onChange(e.target.value)
  }

  handleOnFocus = () => {
    this.setState({ focused: true })
    this.props.onShow()
  }

  handleOnBlur = () => {
    this.setState({ focused: false })
  }

  handleKeyUp = (e) => {
    const { value } = this.props

    if (e.key === 'Enter') {
      e.preventDefault()

      this.props.onSubmit()
      this.context.router.history.push(`/search?q=${value}`)

    } else if (e.key === 'Escape') {
      this.textbox.blur()
    }
  }

  setTextbox = n => {
    this.textbox = n
  }

  handleSubmit = () => {
    this.props.onSubmit()
  }

  render() {
    const {
      value,
      submitted,
      onClear,
      isInNav,
      theme,
    } = this.props
    const { focused } = this.state
    const highlighted = focused || `${value}`.length > 0

    const inputClasses = CX({
      default: 1,
      text: 1,
      outlineNone: 1,
      lineHeight125: 1,
      displayBlock: 1,
      py7: 1,
      bgTransparent: 1,
      colorPrimary: 1,
      fs14PX: 1,
      flexGrow1: 1,
      radiusSmall: 1,
      pl15: 1,
      searchInput: 1,
    })

    const containerClasses = CX({
      default: 1,
      searchNavigation: (!highlighted && isInNav && theme === 'light') || (isInNav && theme !== 'light'),
      bgWhite: (highlighted && isInNav && theme === 'light'),
      bgPrimary: !isInNav,
      flexRow: 1,
      radiusSmall: 1,
      alignItemsCenter: 1,
    })

    const prependIconColor = (highlighted || !isInNav) ? 'brand' : 'white'
    const placeholder = !me ? 'Search Vegeterians.live' : 'Search for people, groups or news'
    const id = 'nav-search'

    return (
      <div className={[_s.default, _s.justifyContentCenter, _s.height53PX].join(' ')}>
        <div className={containerClasses}>
          <label className={_s.visiblyHidden} htmlFor={id}>Search</label>

          <input
            id={id}
            className={inputClasses}
            type='text'
            placeholder={placeholder}
            ref={this.setTextbox}
            value={value}
            onKeyUp={this.handleKeyUp}
            onChange={this.handleOnChange}
            onFocus={this.handleOnFocus}
            onBlur={this.handleOnBlur}
            autoComplete='off'
          />

          <Button
            className={[_s.px10, _s.mr5].join(' ')}
            tabIndex='0'
            title='...'
            backgroundColor='none'
            color={prependIconColor}
            onClick={this.handleSubmit}
            icon='search'
            iconClassName={_s.fillInherit}
            iconSize='16px'
          />
        </div>
      </div>
    )
  }

}
