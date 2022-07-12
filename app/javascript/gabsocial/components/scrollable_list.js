import throttle from 'lodash.throttle'
import { List as ImmutableList } from 'immutable'
import IntersectionObserverArticle from './intersection_observer_article'
import IntersectionObserverWrapper from '../features/ui/util/intersection_observer_wrapper'
import Block from './block'
import ColumnIndicator from './column_indicator'
import LoadMore from './load_more'

const MOUSE_IDLE_DELAY = 300

export default class ScrollableList extends PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    scrollKey: PropTypes.string.isRequired,
    onLoadMore: PropTypes.func,
    onReload: PropTypes.func,
    isLoading: PropTypes.bool,
    showLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
    emptyMessage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    children: PropTypes.node,
    onScrollToTop: PropTypes.func,
    onScroll: PropTypes.func,
    loadmoreMessage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    twoColumns: PropTypes.bool,
  }

  state = {
    pullToRefreshTriggered: false,
    cachedMediaWidth: 250, // Default media/card width using default Vegeterians.live theme
  }

  intersectionObserverWrapper = new IntersectionObserverWrapper();

  mouseIdleTimer = null;
  mouseMovedRecently = false;
  lastScrollWasSynthetic = false;
  scrollToTopOnMouseIdle = false;

  setScrollTop = newScrollTop => {
    if (this.documentElement.scrollTop !== newScrollTop) {
      this.lastScrollWasSynthetic = true;
      this.documentElement.scrollTop = newScrollTop;
    }
  };

  clearMouseIdleTimer = () => {
    if (this.mouseIdleTimer === null) return;

    clearTimeout(this.mouseIdleTimer);
    this.mouseIdleTimer = null;
  };

  handleMouseMove = throttle(() => {
    // As long as the mouse keeps moving, clear and restart the idle timer.
    this.clearMouseIdleTimer();
    this.mouseIdleTimer = setTimeout(this.handleMouseIdle, MOUSE_IDLE_DELAY);

    // Only set if we just started moving and are scrolled to the top.
    if (!this.mouseMovedRecently && this.documentElement.scrollTop === 0) {
      this.scrollToTopOnMouseIdle = true;
    }

    // Save setting this flag for last, so we can do the comparison above.
    this.mouseMovedRecently = true;
  }, MOUSE_IDLE_DELAY / 2);

  handleMouseIdle = () => {
    if (this.scrollToTopOnMouseIdle) {
      this.setScrollTop(0);
    }

    this.mouseMovedRecently = false;
    this.scrollToTopOnMouseIdle = false;
  }

  componentDidMount() {
    this.window = window;
    this.documentElement = document.scrollingElement || document.documentElement;

    this.attachScrollListener();
    this.attachIntersectionObserver();
    // Handle initial scroll posiiton
    this.handleScroll();
  }

  getScrollPosition = () => {
    if (this.documentElement && (this.documentElement.scrollTop > 0 || this.mouseMovedRecently)) {
      return { height: this.documentElement.scrollHeight, top: this.documentElement.scrollTop };
    }

    return null;
  }

  updateScrollBottom = (snapshot) => {
    const newScrollTop = this.documentElement.scrollHeight - snapshot;

    this.setScrollTop(newScrollTop);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Reset the scroll position when a new child comes in in order not to
    // jerk the scrollbar around if you're already scrolled down the page.
    if (snapshot !== null) {
      this.setScrollTop(this.documentElement.scrollHeight - snapshot);
    }
  }

  attachScrollListener() {
    this.window.addEventListener('scroll', this.handleScroll);
    this.window.addEventListener('wheel', this.handleWheel);
  }

  detachScrollListener() {
    this.window.removeEventListener('scroll', this.handleScroll);
    this.window.removeEventListener('wheel', this.handleWheel);
  }

  handleScroll = throttle(() => {
    if (this.window) {
      const { scrollTop, scrollHeight } = this.documentElement;
      const { innerHeight } = this.window;
      const offset = scrollHeight - scrollTop - innerHeight;

      if (scrollTop < -80 && this.props.onReload && !this.state.pullToRefreshTriggered) {
        this.setState({ pullToRefreshTriggered: true })
      } else if (scrollTop > -10 && this.props.onReload && this.state.pullToRefreshTriggered) {
        this.props.onReload()
        this.setState({ pullToRefreshTriggered: false })
      }

      if (600 > offset && this.props.onLoadMore && this.props.hasMore && !this.props.isLoading) {
        this.props.onLoadMore();
      }

      if (scrollTop < 100 && this.props.onScrollToTop) {
        this.props.onScrollToTop();
      } else if (this.props.onScroll) {
        this.props.onScroll();
      }

      if (!this.lastScrollWasSynthetic) {
        // If the last scroll wasn't caused by setScrollTop(), assume it was
        // intentional and cancel any pending scroll reset on mouse idle
        this.scrollToTopOnMouseIdle = false;
      }
      this.lastScrollWasSynthetic = false;
    }
  }, 150, {
    trailing: true,
  });

  handleWheel = throttle(() => {
    this.scrollToTopOnMouseIdle = false;
  }, 150, {
    trailing: true,
  });

  getSnapshotBeforeUpdate(prevProps) {
    const someItemInserted = React.Children.count(prevProps.children) > 0 &&
      React.Children.count(prevProps.children) < React.Children.count(this.props.children) &&
      this.getFirstChildKey(prevProps) !== this.getFirstChildKey(this.props);

    if (someItemInserted && (this.documentElement.scrollTop > 0 || this.mouseMovedRecently)) {
      return this.documentElement.scrollHeight - this.documentElement.scrollTop;
    }

    return null;
  }

  cacheMediaWidth = (width) => {
    if (width && this.state.cachedMediaWidth !== width) {
      this.setState({ cachedMediaWidth: width });
    }
  }

  componentWillUnmount() {
    this.clearMouseIdleTimer();
    this.detachScrollListener();
    this.detachIntersectionObserver();
  }

  attachIntersectionObserver() {
    this.intersectionObserverWrapper.connect();
  }

  detachIntersectionObserver() {
    this.intersectionObserverWrapper.disconnect();
  }

  getFirstChildKey(props) {
    const { children } = props;
    let firstChild = children;

    if (children instanceof ImmutableList) {
      firstChild = children.get(0);
    } else if (Array.isArray(children)) {
      firstChild = children[0];
    }

    return firstChild && firstChild.key;
  }

  handleLoadMore = (e) => {
    e.preventDefault()
    this.props.onLoadMore();
  }

  render() {
    const {
      children,
      scrollKey,
      showLoading,
      isLoading,
      hasMore,
      emptyMessage,
      onLoadMore,
      loadmoreMessage,
      twoColumns,
    } = this.props
    const childrenCount = React.Children.count(children);

    const loadMore = (hasMore && onLoadMore) ? <LoadMore visible={!isLoading} onClick={this.handleLoadMore} loadmoreMessage={loadmoreMessage}/> : null

    if (showLoading) {
      return <ColumnIndicator type='loading' />
    } else if (isLoading || childrenCount > 0 || hasMore || !emptyMessage) {
      return (
        <div onMouseMove={this.handleMouseMove}>
          <div role='feed' className={[`${twoColumns ? _s.flexRowWrap : _s.default}`, `${twoColumns && _s.py10}`].join(' ')}>
            {
              !!this.props.children &&
              React.Children.map(this.props.children, (child, index) => (
                <IntersectionObserverArticle
                  key={child.key}
                  id={child.key}
                  index={index}
                  listLength={childrenCount}
                  intersectionObserverWrapper={this.intersectionObserverWrapper}
                  saveHeightKey={`${this.context.router.route.location.key}:${scrollKey}`}
                  twoColumns={twoColumns}
                >
                  {
                    React.cloneElement(child, {
                      getScrollPosition: this.getScrollPosition,
                      updateScrollBottom: this.updateScrollBottom,
                      cachedMediaWidth: this.state.cachedMediaWidth,
                      cacheMediaWidth: this.cacheMediaWidth,
                    })
                  }
                </IntersectionObserverArticle>
              ))
            }

            {loadMore}
            {
              isLoading &&
              <ColumnIndicator type='loading' />
            }
          </div>
        </div>
      );
    }

    return (
      <Block>
        <ColumnIndicator type='error' message={emptyMessage} />
      </Block>
    )
  }

}

