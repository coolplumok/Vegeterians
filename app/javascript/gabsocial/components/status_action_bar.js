import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import { NavLink } from 'react-router-dom'
import { me } from '../initial_state'
import Text from './text'
import StatusActionBarItem from './status_action_bar_item'
import { CX } from '../constants'

const messages = defineMessages({
  comment: { id: 'status.comment', defaultMessage: 'Comment', title: "Comment" },
  quote: { id: 'status.quote', defaultMessage: 'Quote' , title: "Quote"},
  repost: { id: 'status.repost', defaultMessage: 'Repost', title: "Repost" },
  cannot_repost: { id: 'status.cannot_repost', defaultMessage: 'This post cannot be reposted' },
  like: { id: 'status.like', defaultMessage: 'Like' },
  likesLabel: { id: 'likes.label', defaultMessage: '{number, plural, one {# like} other {# likes}}' },
  repostsLabel: { id: 'reposts.label', defaultMessage: '{number, plural, one {# repost} other {# reposts}}' },
  commentsLabel: { id: 'comments.label', defaultMessage: '{number, plural, one {# comment} other {# comments}}' },
})

export default
@injectIntl
class StatusActionBar extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onFavorite: PropTypes.func.isRequired,
    onQuote: PropTypes.func.isRequired,
    onReply: PropTypes.func.isRequired,
    onRepost: PropTypes.func.isRequired,
    status: ImmutablePropTypes.map.isRequired,
    onOpenLikes: PropTypes.func.isRequired,
    onOpenReposts: PropTypes.func.isRequired,
  }

  updateOnProps = ['status']

  handleReplyClick = () => {
    this.props.onReply(this.props.status, null, true)
  }

  handleFavoriteClick = () => {
    this.props.onFavorite(this.props.status)
  }

  handleRepostClick = () => {
    this.props.onRepost(this.props.status)
  }

  handleQuoteClick = () => {
    this.props.onQuote(this.props.status)
  }

  openLikesList = () => {
    this.props.onOpenLikes(this.props.status)
  }

  openRepostsList = () => {
    this.props.onOpenReposts(this.props.status)
  }

  setRepostButton = (n) => {
    this.repostButton = n
  }

  render() {
    const { status, intl } = this.props

    const publicStatus = ['public', 'unlisted'].includes(status.get('visibility'))

    const replyCount = status.get('replies_count')
    const repostCount = status.get('reblogs_count')
    const favoriteCount = status.get('favourites_count')

    const hasInteractions = favoriteCount > 0 || replyCount > 0 || repostCount > 0
    const shouldCondense = (
      !!status.get('card') ||
      status.get('media_attachments').size > 0 ||
      !!status.get('quote')
    ) && !hasInteractions

    const statusUrl = `/${status.getIn(['account', 'acct'])}/posts/${status.get('id')}`
    const myStatus = status.getIn(['account', 'id']) === me

    const containerClasses = CX({
      default: 1,
      px10: 1,
      mt10: !shouldCondense,
      mt5: shouldCondense,
    })

    const innerContainerClasses = CX({
      default: 1,
      py2: 1,
      flexRow: 1,
      width100PC: 1,
      borderTop1PX: !shouldCondense,
      borderColorSecondary: !shouldCondense,
      mt5: hasInteractions,
    })

    const likeBtnClasses = CX({
      default: 1,
      text: 1,
      cursorPointer: myStatus,
      fontWeightNormal: 1,
      noUnderline: 1,
      underline_onHover: myStatus,
      bgTransparent: 1,
      mr10: 1,
      py5: 1,
    })

    const interactionBtnClasses = CX({
      default: 1,
      text: 1,
      cursorPointer: 1,
      fontWeightNormal: 1,
      noUnderline: 1,
      underline_onHover: 1,
      bgTransparent: 1,
      mr10: 1,
      py5: 1,
    })

    return (
      <div className={containerClasses}>
       
        {
          hasInteractions && 
          <div className={[_s.default, _s.flexRow, _s.alignItemsEnd, _s.px5].join(' ')}>
            {
              favoriteCount > 0 &&
              <button
                className={likeBtnClasses}
                onClick={this.openLikesList}
                disabled={!myStatus}
              >
                <Text color='secondary' size='small'>
                  {intl.formatMessage(messages.likesLabel, {
                    number: favoriteCount,
                  })}
                </Text>
              </button>
            }
            {
              replyCount > 0 &&
              <NavLink
                className={interactionBtnClasses}
                to={statusUrl}
              >
                <Text color='secondary' size='small'>
                  {intl.formatMessage(messages.commentsLabel, {
                    number: replyCount,
                  })}
                </Text>
              </NavLink>
            }
            {
              repostCount > 0 &&
              <button className={interactionBtnClasses} onClick={this.openRepostsList}>
                <Text color='secondary' size='small'>
                  {intl.formatMessage(messages.repostsLabel, {
                    number: repostCount,
                  })}
                </Text>
              </button>
            }
          </div>
        }
        <div className={innerContainerClasses}>
          <div className={[_s.default, _s.flexRow, _s.py2, _s.width100PC].join(' ')}>
            <StatusActionBarItem
              title={intl.formatMessage(messages.like)}
              icon={!!status.get('favourited') ? 'liked' : 'like'}
              active={!!status.get('favourited')}
              onClick={this.handleFavoriteClick}
              altTitle={intl.formatMessage(messages.like)}
            />
            <StatusActionBarItem
              title={intl.formatMessage(messages.comment)}
              icon='comment'
              onClick={this.handleReplyClick}
              altTitle={intl.formatMessage(messages.comment)}
            />
            <StatusActionBarItem
              title={intl.formatMessage(messages.repost)}
              altTitle={!publicStatus ? intl.formatMessage(messages.cannot_repost) : "Share to your feed without comment"}
              icon={!publicStatus ? 'lock' : 'repost'}
              disabled={!publicStatus}
              active={!!status.get('reblogged')}
              buttonRef={this.setRepostButton}
              onClick={this.handleRepostClick}
            />
            <StatusActionBarItem
              title={intl.formatMessage(messages.quote)}
              altTitle={!publicStatus ? intl.formatMessage(messages.cannot_repost) : 'Share to your feed along with a comment'}
              icon={!publicStatus ? 'lock' : 'quote'}
              disabled={!publicStatus}
              onClick={this.handleQuoteClick}
            />
          </div>
        </div>
      </div>
    )
  }

}