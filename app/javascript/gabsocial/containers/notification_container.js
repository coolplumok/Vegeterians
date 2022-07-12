import { List as ImmutableList } from 'immutable'
import { makeGetNotification } from '../selectors'
import Notification from '../components/notification'

const getAccountFromState = (state, accountId) => {
  return state.getIn(['accounts', accountId])
}

const getGroupFromState = (state, groupId) => {
  return state.getIn(['groups', groupId])
}

const makeMapStateToProps = () => {
  const getNotification = makeGetNotification()

  const mapStateToProps = (state, props) => {
    const isFollows = !!props.notification.get('follow')
    const isLikes = !!props.notification.get('like')
    const isReposts = !!props.notification.get('repost')
    const isGrouped = isFollows || isLikes || isReposts
    const lastReadId = state.getIn(['notifications', 'lastReadId'])
    const isGroupInvite = !!props.notification.get('group_invite')
    const isGroupJoinPrivate = !!props.notification.get('group_join_private')
    const isGroupApproveJoinPrivate = !!props.notification.get('group_approve_join_private')
    const isHealthExpertApplication = !!props.notification.get('health_expert_application')
    const isHealthExpertApprove = !!props.notification.get('health_expert_approve')
    
    if (isFollows) {
      let lastUpdated
      let isUnread

      const list = props.notification.get('follow')
      let accounts = ImmutableList()
      list.forEach((item) => {
        const account = getAccountFromState(state, item.get('account'))
        accounts = accounts.set(accounts.size, account)
        if (!lastUpdated) {
          isUnread = parseInt(item.get('id')) > parseInt(lastReadId)
          lastUpdated = item.get('created_at')
        }
      })
  
      return {
        type: 'follow',
        accounts: accounts,
        createdAt: lastUpdated,
        isUnread: isUnread,
        statusId: undefined,
      }
    } else if (isLikes || isReposts) {
      const theType = isLikes ? 'like' : 'repost'
      const list = props.notification.get(theType)
      let lastUpdated = list.get('lastUpdated')
      let isUnread = list.get('isUnread')

      let accounts = ImmutableList()
      const accountIdArr = list.get('accounts')

      for (let i = 0; i < accountIdArr.length; i++) {
        const accountId = accountIdArr[i];
        const account = getAccountFromState(state, accountId)
        accounts = accounts.set(accounts.size, account)
      }

      return {
        type: theType,
        accounts: accounts,
        createdAt: lastUpdated,
        isUnread: isUnread,
        statusId: list.get('status'),
      }
    } else if (isGroupInvite || isGroupJoinPrivate || isGroupApproveJoinPrivate) {
      const theType = isGroupInvite ? 'group_invite' : (isGroupJoinPrivate ? 'group_join_private' : 'group_approve_join_private')
      const list = props.notification.get(theType)
      let lastUpdated
      let isUnread

      const groupId = list.get('group')
      const group = getGroupFromState(state, groupId)
      let accounts = ImmutableList()
      const accountIdArr = list.get('accounts')

      for (let i = 0; i < accountIdArr.length; i++) {
        const accountId = accountIdArr[i];
        const account = getAccountFromState(state, accountId)
        accounts = accounts.set(accounts.size, account)
        if (!lastUpdated) {
          isUnread = parseInt(list.get('id')) > parseInt(lastReadId)
          lastUpdated = list.get('created_at')
        }
      }

      return {
        type: theType,
        accounts: accounts,
        group: group,
        createdAt: lastUpdated,
        isUnread: isUnread,
        statusId: list.get('status'),
      }
    } else if (isHealthExpertApplication) {
      const list = props.notification.get('health_expert_application')
      const accountId = list.get('account')
      const account = getAccountFromState(state, accountId)
      const statusId = list.get('status')
      const healthExpertApplication = list.get('health_expert_application')

      return {
        type: list.get('type'),
        accounts: !!account ? ImmutableList([account]) : ImmutableList(),
        healthExpertApplication: healthExpertApplication,
        createdAt: list.get('created_at'),
        isUnread: lastReadId < list.get('id'),
        statusId: statusId || undefined,
      }
    } else if (isHealthExpertApprove) {
      const list = props.notification.get('health_expert_approve')
      const accountId = list.get('account')
      const account = getAccountFromState(state, accountId)
      const statusId = list.get('status')

      return {
        type: list.get('type'),
        accounts: !!account ? ImmutableList([account]) : ImmutableList(),
        createdAt: list.get('created_at'),
        isUnread: lastReadId < list.get('id'),
        statusId: statusId || undefined,
      }
    } else if (!isGrouped) {
      const notification = getNotification(state, props.notification, props.notification.get('account'))
      const account = notification.get('account')
      const statusId = notification.get('status')

      return {
        type: notification.get('type'),
        accounts: !!account ? ImmutableList([account]) : ImmutableList(),
        createdAt: notification.get('created_at'),
        isUnread: lastReadId < notification.get('id'),
        statusId: statusId || undefined,
      }
    }
  }

  return mapStateToProps
}

export default connect(makeMapStateToProps)(Notification)
