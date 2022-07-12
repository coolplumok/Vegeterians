import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { me } from '../initial_state'
import Button from './button'
import DisplayName from './display_name'
import DotTextSeperator from './dot_text_seperator'
import Icon from './icon'
import RelativeTimestamp from './relative_timestamp'
import Text from './text'

const messages = defineMessages({
  edited: { id: 'status.edited', defaultMessage: 'Edited' },
  likesLabel: { id: 'likes.label', defaultMessage: '{number, plural, one {# like} other {# likes}}' },
  repostsLabel: { id: 'reposts.label', defaultMessage: '{number, plural, one {# repost} other {# reposts}}' },
  original: { id: 'original_gabber', defaultMessage: 'Original Vegeterianser' },
})

export default
@injectIntl
class CommentHeader extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    ancestorAccountId: PropTypes.string.isRequired,
    status: ImmutablePropTypes.map.isRequired,
    onOpenLikes: PropTypes.func.isRequired,
    onOpenReposts: PropTypes.func.isRequired,
    onOpenRevisions: PropTypes.func.isRequired,
  }

  openLikesList = () => {
    this.props.onOpenLikes(this.props.status)
  }

  openRepostsList = () => {
    this.props.onOpenReposts(this.props.status)
  }

  openRevisions = () => {
    this.props.onOpenRevisions(this.props.status)
  }

  render() {
    const {
      intl,
      status,
      ancestorAccountId,
    } = this.props

    if (!status) return null

    const repostCount = status.get('reblogs_count')
    const favoriteCount = status.get('favourites_count')

    const statusUrl = `/${status.getIn(['account', 'acct'])}/posts/${status.get('id')}`;
    const isOwner = ancestorAccountId === status.getIn(['account', 'id'])
    const myComment = status.getIn(['account', 'id']) === me

    return (
      <div className={[_s.default, _s.alignItemsStart, _s.py2, _s.maxWidth100PC, _s.flexGrow1].join(' ')}>

        <div className={[_s.default, _s.flexRow, _s.flexWrap, _s.overflowHidden, _s.width100PC, _s.maxWidth100PC, _s.alignItemsCenter].join(' ')}>
          <NavLink
            className={[_s.default, _s.flexRow, _s.alignItemsStart, _s.noUnderline].join(' ')}
            to={`/${status.getIn(['account', 'acct'])}`}
            title={status.getIn(['account', 'acct'])}
          >
            <DisplayName
              account={status.get('account')}
              isSmall
              isComment
            />
          </NavLink>

          {
            isOwner &&
            <div className={[_s.default, _s.alignItemsCenter, _s.ml5].join(' ')}>
              <span className={_s.visiblyHidden}>
                {intl.formatMessage(messages.original)}
              </span>
              <Icon id='mic' size='10px' className={_s.fillBrand} />
            </div>
          }

          {
            !!status.get('group') &&
            <Fragment>
              <DotTextSeperator />
              <Button
                isText
                underlineOnHover
                backgroundColor='none'
                color='tertiary'
                to={`/groups/${status.getIn(['group', 'id'])}/${status.getIn(['group', 'title']).split(" ").join("-")}`}
                className={_s.ml5}
              >
                <Text size='extraSmall' color='inherit'>
                  {status.getIn(['group', 'title'])}
                </Text>
              </Button>
            </Fragment>
          }

          {
            status.get('revised_at') !== null &&
            <Fragment>
              <DotTextSeperator />
              <Button
                isText
                underlineOnHover
                backgroundColor='none'
                color='tertiary'
                onClick={this.openRevisions}
                className={_s.ml5}
              >
                <Text size='extraSmall' color='inherit'>
                  {intl.formatMessage(messages.edited)}
                </Text>
              </Button>
            </Fragment>
          }

          {
            favoriteCount > 0 &&
            <Fragment>
              <DotTextSeperator />
                <Button
                  isText
                  underlineOnHover={myComment}
                  backgroundColor='none'
                  color='tertiary'
                  className={_s.ml5}
                  onClick={myComment ? this.openLikesList : undefined}
                >
                <Text size='extraSmall' color='inherit'>
                  {intl.formatMessage(messages.likesLabel, {
                    number: favoriteCount,
                  })}
                </Text>
              </Button>
            </Fragment>
          }

          {
            repostCount > 0 &&
            <Fragment>
              <DotTextSeperator />
                <Button
                  isText
                  underlineOnHover
                  backgroundColor='none'
                  color='tertiary'
                  className={_s.ml5}
                  onClick={this.openRepostsList}
                >
                <Text size='extraSmall' color='inherit'>
                  {intl.formatMessage(messages.repostsLabel, {
                    number: repostCount,
                  })}
                </Text>
              </Button>
            </Fragment>
          }

          <DotTextSeperator />

          <Button
            isText
            underlineOnHover
            backgroundColor='none'
            color='tertiary'
            to={statusUrl}
            className={_s.ml5}
          >
            <Text size='extraSmall' color='inherit'>
              <RelativeTimestamp timestamp={status.get('created_at')} />
            </Text>
          </Button>

        </div>
      </div>
    )
  }

}
