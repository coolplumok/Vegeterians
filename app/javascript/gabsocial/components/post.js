import ImmutablePureComponent from 'react-immutable-pure-component'
import Block from './block'
import ScrollableList from './scrollable_list'
import PostItem from './post_item'
import Dummy from './dummy'

export default class Post extends ImmutablePureComponent {

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
    // debugger
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
              <PostItem
                size={size}
                key={`post-item-${i}`}
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