import { FormattedMessage } from 'react-intl'
import throttle from 'lodash.throttle'
import classNames from 'classnames/bind'
import { shortNumberFormat } from '../utils/numbers'
import { scrollTo } from '../utils/scroll_to'
import Button from './button'
import Text from './text'

const cx = classNames.bind(_s)

export default class TimelineQueueButtonHeader extends PureComponent {

  static propTypes = {
    onClick: PropTypes.func.isRequired,
    count: PropTypes.number,
    itemType: PropTypes.string,
    floating: PropTypes.bool,
  }

  static defaultProps = {
    count: 0,
    itemType: 'item',
  }

  state = {
    onVisibleOffset: 0,
    hidden: false,
  }

  componentDidMount() {
    this.window = window
    this.documentElement = document.scrollingElement || document.documentElement
  }

  componentWillUnmount() {
    this.detachScrollListener()
  }

  componentDidUpdate (prevProps) {
    if (this.props.count > 0 && prevProps.count === 0) {
      // Init
      this.window.addEventListener('scroll', this.handleScroll)
      this.setState({ onVisibleOffset: this.documentElement.scrollTop })
    } else if (prevProps.count > 0 && this.props.count === 0) {
      // Deinit
      this.detachScrollListener()
      this.setState({
        hidden: false,
        onVisibleOffset: 0,
      })
    }
  }

  detachScrollListener = () => {
    this.window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = throttle(() => {
    if (this.window) {
      const { scrollTop } = this.documentElement
      const { hidden, onVisibleOffset } = this.state
      const { count } = this.props

      const min = Math.min(onVisibleOffset, scrollTop)
      const max = Math.max(onVisibleOffset, scrollTop)
      const delta = max - min
      const trigger = 50
      
      // If visible and scrolled a bit, hide it
      if (delta > trigger && count > 0 && !hidden) {
        this.setState({ hidden: true })
        this.detachScrollListener()
      }
    }
  }, 150, {
    trailing: true,
  })

  handleOnClick = () => {
    scrollTo(document.documentElement, 0, 500)

    this.props.onClick()
  }

  render() {
    const { count, itemType } = this.props
    const { hidden } = this.state

    const hasItems = count > 0

    const containerClasses = cx({
      default: 1,
      pb5: 1,
      posSticky: !hidden,
      top120PX: !hidden,
      alignItemsCenter: 1,
      z3: 1,
    })

    const innerContainerClasses = cx({
      default: 1,
      displayNone: !hasItems,
      mtNeg26PX: 1,
    })

    return (
      <div className={containerClasses}>
        <div className={innerContainerClasses}>
          <Button
            isNarrow
            color='white'
            backgroundColor='brand'
            onClick={this.handleOnClick}
          >
            {
              hasItems && 
              <Text color='inherit' size='small'>
                <FormattedMessage
                  id='timeline_queue.label'
                  defaultMessage='{count} new {type}'
                  values={{
                    count: shortNumberFormat(count),
                    type: count === 1 ? itemType : `${itemType}s`,
                  }}
                />
              </Text>
            }
          </Button>
        </div>
      </div>
    )
  }

}