import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { injectIntl, defineMessages } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { me } from '../initial_state' 
import {
  CX,
  BREAKPOINT_EXTRA_SMALL,
} from '../constants'
import { approveHealthExpert } from '../actions/accounts'
import Responsive from '../features/ui/util/responsive_component'
import StatusContainer from '../containers/status_container'
import Avatar from './avatar'
import Icon from './icon'
import Text from './text'
import Button from './button'
import DotTextSeperator from './dot_text_seperator'
import RelativeTimestamp from './relative_timestamp'
import DisplayName from './display_name'
import GroupListItem from './group_list_item'

const messages = defineMessages({
  poll: { id: 'notification.poll', defaultMessage: 'A poll you have voted in has ended' },
  ownPoll: { id: 'notification.own_poll', defaultMessage: 'Your poll has ended' },
  mentionedInPost: { id: 'mentioned_in_post', defaultMessage: 'mentioned you in their post' },
  mentionedInComment: { id: 'mentioned_in_comment', defaultMessage: 'mentioned you in their comment' },
  followedYouOne: { id: 'followed_you_one', defaultMessage: 'followed you' },
  followedYouMultiple: { id: 'followed_you_multiple', defaultMessage: 'and {count} others followed you' },
  likedStatusOne: { id: 'liked_status_one', defaultMessage: 'liked your status' },
  likedStatusMultiple: { id: 'liked_status_multiple', defaultMessage: 'and {count} others liked your status' },
  repostedStatusOne: { id: 'reposted_status_one', defaultMessage: 'reposted your status' },
  repostedStatusMultiple: { id: 'reposted_status_multiple', defaultMessage: 'and {count} others reposted your status' },
  groupInvitedYouOne: { id: 'group_invited_you_one', defaultMessage: 'invited you to "{group}"' },
  groupInvitedYouMultiple: { id: 'group_invited_you_multiple', defaultMessage: 'and {count} others invited you to "{group}"' },
  groupJoinPrivateOne: { id: 'group_join_private_one', defaultMessage: 'sent the join request to "{group}"' },
  groupJoinPrivateMultiple: { id: 'group_join_private_multiple', defaultMessage: 'and {count} others sent the join request to "{group}"' },
  groupApproveJoinPrivate: { id: 'group_approve_join_private', defaultMessage: 'approved the join request to "{group}"' },
  healthExpertApplication: { id: 'health_expert_application', defaultMessage: ' sent the join request as Vegeterians Health Expert' },
  healthExpertApprove: { id: 'health_expert_approve', defaultMessage: 'Congratulations! Your application to join as a Vegeterians Health Expert has been approved. New posts you make will show up on our Expert Feed.' },
  trainingCertification: { id: 'training_certification', defaultMessage: 'Training and Certifications' },
  websiteURL: { id: 'website_url', defaultMessage: 'Website Url' },
  facebookURL: { id: 'facebook_url', defaultMessage: 'Facebook Url' },
  twitterURL: { id: 'twitter_url', defaultMessage: 'Twitter Url' },
  instagramURL: { id: 'instagram_url', defaultMessage: 'Instagram Url' },
  telegramURL: { id: 'telegram_url', defaultMessage: 'Telegram Url' },
  youtubeURL: { id: 'youtube_url', defaultMessage: 'Youtube Url' },
  approve: { id: 'approve', defaultMessage: 'Approve' },
})

const mapDispatchToProps = (dispatch) => ({
  onApproveHealthExpertApplication(accountId) {
    dispatch(approveHealthExpert(accountId))
  }
})

export default
@injectIntl
@connect(null, mapDispatchToProps)
class Notification extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    intl: PropTypes.object.isRequired,
    accounts: ImmutablePropTypes.list.isRequired,
    group: ImmutablePropTypes.map,
    healthExpertApplication: ImmutablePropTypes.map,
    createdAt: PropTypes.string,
    statusId: PropTypes.string,
    type: PropTypes.string.isRequired,
    isHidden: PropTypes.bool,
    isUnread: PropTypes.bool,
  }

  handleOnApprove = () => {
    this.props.onApproveHealthExpertApplication(this.props.accounts.first().get('id'))
  }

  render() {
    const {
      intl,
      accounts,
      group,
      healthExpertApplication,
      createdAt,
      type,
      statusId,
      isHidden,
      isUnread,
    } = this.props
    
    const count = !!accounts ? accounts.size : 0

    let message
    let icon

    switch (type) {
      case 'follow':
        icon = 'group'
        message =  intl.formatMessage(count > 1 ? messages.followedYouMultiple : messages.followedYouOne, {
          count: count - 1,
        })
        break
      case 'mention':
        icon = 'comment'
        message = intl.formatMessage(messages.mentionedInPost)
        break
      case 'like':
        icon = 'like'
        message = intl.formatMessage(count > 1 ? messages.likedStatusMultiple : messages.likedStatusOne, {
          count: count - 1,
        })
        break
      case 'repost':
        icon = 'repost'
        message = intl.formatMessage(count > 1 ? messages.repostedStatusMultiple : messages.repostedStatusOne, {
          count: count - 1,
        })
        break
      case 'poll':
        let msg = messages.poll
        if (accounts.size === 1) {
          if (accounts.first().get('id') === me) {
            msg = messages.ownPoll
          }
        }
        icon = 'poll'
        message = intl.formatMessage(msg)
        break
      case 'group_invite':
        icon = 'group'
        message =  intl.formatMessage(count > 1 ? messages.groupInvitedYouMultiple : messages.groupInvitedYouOne, {
          count: count - 1,
          group: group ? group.get('title') : '',
        })
        break
      case 'group_join_private':
        icon = 'group'
        message =  intl.formatMessage(count > 1 ? messages.groupJoinPrivateMultiple : messages.groupJoinPrivateOne, {
          count: count - 1,
          group: group ? group.get('title') : '',
        })
        break
      case 'group_approve_join_private':
        icon = 'group'
        message =  intl.formatMessage(messages.groupApproveJoinPrivate, {
          group: group ? group.get('title') : '',
        })
        break
      case 'health_expert_application':
        icon = 'star-outline'
        message =  intl.formatMessage(messages.healthExpertApplication)
        break
      case 'health_expert_approve':
        icon = 'star'
        message =  intl.formatMessage(messages.healthExpertApprove)
        break
      default:
        return null
    }

    if (isHidden) {
      return (
        <Fragment>
          {
            accounts && accounts.slice(0, 1).map((account, i) => (
              <DisplayName key={i} account={account} noUsername />
            ))
          }
          {message}
        </Fragment>
      )
    }

    const containerClasses = CX({
      default: 1,
      px10: 1,
      cursorPointer: 1,
      bgSubtle_onHover: !isUnread,
      highlightedComment: isUnread,
    })

    return (
      <div
        className={containerClasses}
        tabIndex='0'
        aria-label={`${message} ${createdAt}`}
      >
        <div className={[_s.default, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
          <div className={[_s.default, _s.flexRow, _s.my10, _s.py10, _s.px10].join(' ')}>

            <Responsive min={BREAKPOINT_EXTRA_SMALL}>
              <Icon id={icon} size='20px' className={[_s.fillPrimary, _s.minWidth20PX, _s.mt5, _s.mr15].join(' ')} />
            </Responsive>

            <div className={[_s.default, _s.flexNormal].join(' ')}>
              {
                !!group &&
                <div className={[_s.default, _s.flexRow, _s.flexWrap, _s.pb10].join(' ')}>
                  <GroupListItem
                    isAddable={false}
                    id={group.get('id')}
                  />
                </div>
              }
              <div className={[_s.default, _s.flexRow, _s.flexWrap].join(' ')}>
                {
                  accounts && accounts.map((account, i) => (
                    <NavLink
                      to={`/${account.get('acct')}`}
                      key={`fav-avatar-${i}`}
                      className={[_s.mr5, _s.mb5].join(' ')}
                    >
                      <Avatar size={34} account={account} />
                    </NavLink>
                  ))
                }
              </div>
              <div className={[_s.default, _s.pt5].join(' ')}>
                <div className={[_s.default, _s.flexRow, _s.alignItemsEnd].join(' ')}>
                  <div className={_s.text}>
                    {
                      accounts && accounts.slice(0, 1).map((account, i) => (
                        <DisplayName key={i} account={account} noUsername />
                      ))
                    }

                    <Text size='medium'>
                      {' '}
                      {message}
                    </Text>
                  </div>
                  {
                    !!createdAt &&
                    <Fragment>
                      <DotTextSeperator />
                      <Text size='small' color='tertiary' className={_s.ml5}>
                        <RelativeTimestamp timestamp={createdAt} />
                      </Text>
                    </Fragment>
                  }
                </div>
              </div>
              {
                !!statusId &&
                <div className={[_s.default, _s.pt10, _s.mt5].join(' ')}>
                  <StatusContainer
                    contextType='notification'
                    id={statusId}
                    isChild
                    isNotification
                  />
                </div>
              }

              {
                !!healthExpertApplication &&
                <div className={[_s.default, _s.pt10, _s.mt5].join(' ')}>
                  <Text size='small' color='tertiary' className={_s.ml5}>
                    {intl.formatMessage(messages.trainingCertification)}: {healthExpertApplication.training_certification}
                  </Text>
                  <Text size='small' color='tertiary' className={_s.ml5}>
                    {intl.formatMessage(messages.websiteURL)}: {healthExpertApplication.website_url}
                  </Text>
                  <Text size='small' color='tertiary' className={_s.ml5}>
                    {intl.formatMessage(messages.facebookURL)}: {healthExpertApplication.facebook_url}
                  </Text>
                  <Text size='small' color='tertiary' className={_s.ml5}>
                    {intl.formatMessage(messages.twitterURL)}: {healthExpertApplication.twitter_url}
                  </Text>
                  <Text size='small' color='tertiary' className={_s.ml5}>
                    {intl.formatMessage(messages.instagramURL)}: {healthExpertApplication.instagram_url}
                  </Text>
                  <Text size='small' color='tertiary' className={_s.ml5}>
                    {intl.formatMessage(messages.telegramURL)}: {healthExpertApplication.telegram_url}
                  </Text>
                  <Text size='small' color='tertiary' className={_s.ml5}>
                    {intl.formatMessage(messages.youtubeURL)}: {healthExpertApplication.youtube_url}
                  </Text>
                </div>
              }

              {
                !!healthExpertApplication &&
                <Button
                  isBlock
                  radiusSmall
                  className={[_s.default, _s.width115PX, _s.mt10].join(' ')}
                  onClick={this.handleOnApprove}
                >
                  <Text color='inherit' align='center' size='small'>
                    {intl.formatMessage(messages.approve)}
                  </Text>
                </Button>
              }
            </div>

          </div>
        </div>
      </div>
    )
  }

}
