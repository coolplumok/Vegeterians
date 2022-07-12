import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Block from './block'
import ScrollableList from './scrollable_list'
import ListItem from './list_item'
import Dummy from './dummy'

export default class List extends ImmutablePureComponent {

  static propTypes = {
    items: PropTypes.oneOfType([
      PropTypes.array,
      ImmutablePropTypes.map,
      ImmutablePropTypes.list,
    ]),
    scrollKey: PropTypes.string,
    emptyMessage: PropTypes.any,
    size: PropTypes.oneOf([
      'small',
      'large'
    ]),
    onLoadMore: PropTypes.func,
    hasMore: PropTypes.bool,
    showLoading: PropTypes.bool,
  }

  render() {
    const {
      items,
      scrollKey,
      emptyMessage,
      hasMore,
      size,
      onLoadMore,
      showLoading,
    } = this.props

    const Wrapper = !!scrollKey ? ScrollableList : Dummy

    return (
      <Block>
        <Wrapper
          onLoadMore={onLoadMore}
          hasMore={hasMore}
          scrollKey={scrollKey}
          emptyMessage={emptyMessage}
          showLoading={showLoading}
        >
          {
            items.map((item, i) => (
              <ListItem
                size={size}
                key={`list-item-${i}`}
                isLast={items.size - 1 === i}
                {...item}
              />
            ))
          }
        </Wrapper>
      </Block>
    )
  }

}