import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { makeGetStatus } from '../selectors';
import CommentHeader from './comment_header'
import Avatar from './avatar'
import Button from './button'
import DisplayName from './display_name'
import DotTextSeperator from './dot_text_seperator'
import RelativeTimestamp from './relative_timestamp'
import Text from './text'
import StatusContent from './status_content'

const messages = defineMessages({
  follow: { id: 'follow', defaultMessage: 'Follow' },
})

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus()

  const mapStateToProps = (state, props) => {
    const status = getStatus(state, props)
    let descendantsIds = Immutable.List()

    if (status) {
      // ALL descendants
      descendantsIds = descendantsIds.withMutations(mutable => {
        const ids = [status.get('id')]

        while (ids.length > 0) {
          const id = ids.shift();
          const replies = state.getIn(['contexts', 'replies', id])

          if (status.get('id') !== id) {
            mutable.push(id)
          }

          if (replies) {
            replies.reverse().forEach(reply => {
              ids.unshift(reply)
            });
          }
        }
      })
    }

    return {
      status,
      descendantsIds,
    }
  }

  return mapStateToProps
}

export default
@injectIntl
@connect(makeMapStateToProps)
class Comment extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    descendantsIds: ImmutablePropTypes.list,

  }

  constructListItem = (item) => {
    if (item.nestedItems) {
      return (
        <List key={item.key}>
          {item.nestedItems.map(this.constructListItem)}
        </List>
      )
    } else {
      return <ListItem key={item.key} item={item} />
    }
  }

  render() {
    const { listItems } = this.props

    return (
      <List>
        {listItems.map(this.constructListItem)}
      </List>
    )
  }

}
