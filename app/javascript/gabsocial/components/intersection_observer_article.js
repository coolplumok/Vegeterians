import { is } from 'immutable'
import { setHeight } from '../actions/height_cache'
import scheduleIdleTask from '../utils/schedule_idle_task'
import getRectFromEntry from '../utils/get_rect_from_entry'

// Diff these props in the "rendered" state
const updateOnPropsForRendered = ['id', 'index', 'listLength']
// Diff these props in the "unrendered" state
const updateOnPropsForUnrendered = ['id', 'index', 'listLength', 'cachedHeight']

const makeMapStateToProps = (state, props) => ({
  cachedHeight: state.getIn(['height_cache', props.saveHeightKey, props.id]),
})

const mapDispatchToProps = (dispatch) => ({

  onHeightChange(key, id, height) {
    dispatch(setHeight(key, id, height))
  },

})

export default
@connect(makeMapStateToProps, mapDispatchToProps)
class IntersectionObserverArticle extends React.Component {

  static propTypes = {
    intersectionObserverWrapper: PropTypes.object.isRequired,
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    index: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    listLength: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    saveHeightKey: PropTypes.string,
    cachedHeight: PropTypes.number,
    onHeightChange: PropTypes.func,
    children: PropTypes.node,
    twoColumns: PropTypes.bool,
  }

  state = {
    isIntersecting: false,
    isHidden: false,
  }

  componentDidMount() {
    const { intersectionObserverWrapper, id } = this.props;

    intersectionObserverWrapper.observe(
      id,
      this.node,
      this.handleIntersection
    );

    this.componentMounted = true;
  }

  componentWillUnmount() {
    const { intersectionObserverWrapper, id } = this.props;
    intersectionObserverWrapper.unobserve(id, this.node);

    this.componentMounted = false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const isUnrendered = !this.state.isIntersecting && (this.state.isHidden || this.props.cachedHeight);
    const willBeUnrendered = !nextState.isIntersecting && (nextState.isHidden || nextProps.cachedHeight);

    // If we're going from rendered to unrendered (or vice versa) then update
    if (!!isUnrendered !== !!willBeUnrendered) {
      return true;
    }

    // Otherwise, diff based on props
    const propsToDiff = isUnrendered ? updateOnPropsForUnrendered : updateOnPropsForRendered;
    return !propsToDiff.every(prop => is(nextProps[prop], this.props[prop]));
  }
  
  handleIntersection = (entry) => {
    this.entry = entry;

    scheduleIdleTask(this.calculateHeight);
    this.setState(this.updateStateAfterIntersection);
  }

  updateStateAfterIntersection = (prevState) => {
    if (prevState.isIntersecting !== false && !this.entry.isIntersecting) {
      scheduleIdleTask(this.hideIfNotIntersecting);
    }

    return {
      isIntersecting: this.entry.isIntersecting,
      isHidden: false,
    };
  }

  calculateHeight = () => {
    const { onHeightChange, saveHeightKey, id } = this.props
    // Save the height of the fully-rendered element (this is expensive
    // on Chrome, where we need to fall back to getBoundingClientRect)
    this.height = getRectFromEntry(this.entry).height

    if (onHeightChange && saveHeightKey) {
      onHeightChange(saveHeightKey, id, this.height)
    }
  }

  hideIfNotIntersecting = () => {
    if (!this.componentMounted) return

    this.setState((prevState) => ({ isHidden: !prevState.isIntersecting }))
  }

  handleRef = (node) => {
    this.node = node
  }

  render() {
    const {
      children,
      id,
      index,
      listLength,
      cachedHeight,
      twoColumns,
    } = this.props
    const { isIntersecting, isHidden } = this.state

    if (!isIntersecting && (isHidden || cachedHeight)) {
      return (
        <article
          className={[_s.outlineNone, `${twoColumns ? _s.width50PCMD : ''}`].join(' ')}
          ref={this.handleRef}
          aria-posinset={index + 1}
          aria-setsize={listLength}
          style={{ height: `${this.height || cachedHeight}px`, opacity: 0, overflow: 'hidden' }}
          data-id={id}
          tabIndex='0'
        >
          {React.cloneElement(children, { isHidden: true, cachedHeight })}
        </article>
      )
    }

    return (
      <article
        className={[_s.outlineNone, `${twoColumns ? _s.width50PCMD : ''}`].join(' ')}
        ref={this.handleRef}
        aria-posinset={index + 1}
        aria-setsize={listLength}
        data-id={id}
        tabIndex='0'
      >
        {React.cloneElement(children, { isHidden: false, isIntersecting, cachedHeight })}
      </article>
    )
  }

}
