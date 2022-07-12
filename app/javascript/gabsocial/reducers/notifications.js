import {
  NOTIFICATIONS_INITIALIZE,
  NOTIFICATIONS_UPDATE,
  NOTIFICATIONS_EXPAND_SUCCESS,
  NOTIFICATIONS_EXPAND_REQUEST,
  NOTIFICATIONS_EXPAND_FAIL,
  NOTIFICATIONS_FILTER_SET,
  NOTIFICATIONS_CLEAR,
  NOTIFICATIONS_SCROLL_TOP,
  NOTIFICATIONS_UPDATE_QUEUE,
  NOTIFICATIONS_DEQUEUE,
  MAX_QUEUED_NOTIFICATIONS,
  NOTIFICATIONS_MARK_READ,
} from '../actions/notifications'
import {
  ACCOUNT_BLOCK_SUCCESS,
  ACCOUNT_MUTE_SUCCESS,
} from '../actions/accounts'
import { TIMELINE_DELETE, TIMELINE_DISCONNECT } from '../actions/timelines'
import { Range, Map as ImmutableMap, List as ImmutableList } from 'immutable'
import { unreadCount, lastReadNotificationId } from '../initial_state'
import compareId from '../utils/compare_id';

const DEFAULT_NOTIFICATIONS_LIMIT = 20

const initialState = ImmutableMap({
  items: ImmutableList(),
  sortedItems: ImmutableList(),
  lastId: null,
  hasMore: true,
  top: false,
  unread: 0,
  isLoading: false,
  queuedNotifications: ImmutableList(), //max = MAX_QUEUED_NOTIFICATIONS
  totalQueuedNotificationsCount: 0, //used for queuedItems overflow for MAX_QUEUED_NOTIFICATIONS+
  lastReadId: -1,
  filter: ImmutableMap({
    active: 'all',
    onlyVerified: false,
    onlyFollowing: false,
  }),
});

const notificationToMap = (notification) => ImmutableMap({
  id: notification.id,
  type: notification.type,
  account: notification.account.id,
  created_at: notification.created_at,
  status: notification.status ? notification.status.id : null,
  group: notification.group ? notification.group.id : null,
  health_expert_application: notification.health_expert_application ? notification.health_expert_application : null,
});

const makeSortedNotifications = (state) => {
  let finalSortedItems = ImmutableList()
  const items = state.get('items')
  const lastReadId = state.get('lastReadId')

  const chunks = Range(0, items.count(), DEFAULT_NOTIFICATIONS_LIMIT)
    .map((chunkStart) => items.slice(chunkStart, chunkStart + DEFAULT_NOTIFICATIONS_LIMIT)) 
  
  chunks.forEach((chunk) => {
    let sortedItems = ImmutableList()

    let follows = ImmutableList()
    let likes = {}
    let reposts = {}
    let group_invites = {}
    let group_join_privates = {}
    let group_approve_join_privates = {}
    let health_expert_applications = ImmutableList()
    let health_expert_approves = ImmutableList()
  
    let followIndex = -1
    let indexesForStatusesForReposts = {}
    let indexesForStatusesForFavorites = {}
    let indexesForGroupForGroupInvites = {}
    let indexesForGroupForGroupJoinPrivates = {}
    let indexesForGroupForGroupApproveJoinPrivates = {}
    let healthExpertApplicationIndex = -1
    let healthExpertApproveIndex = -1

    chunk.forEach((notification) => {
      if (!!notification) {
        const statusId = notification.get('status')
        const type = notification.get('type')

        switch (type) {
          case 'follow': {
            if (followIndex === -1) followIndex = sortedItems.size
            sortedItems = sortedItems.set(followIndex, ImmutableMap())
            follows = follows.set(follows.size, notification)
            break
          }
          case 'favourite': {
            if (likes[statusId] === undefined) {
              let size = sortedItems.size
              sortedItems = sortedItems.set(size, ImmutableMap())
              indexesForStatusesForFavorites[statusId] = size
              likes[statusId] = []
            }
            likes[statusId].push({
              account: notification.get('account'),
              created_at: notification.get('created_at'),
              id: notification.get('id'),
            })
            break
          }
          case 'reblog': {
            if (reposts[statusId] === undefined) {
              let size = sortedItems.size
              sortedItems = sortedItems.set(size, ImmutableMap())
              indexesForStatusesForReposts[statusId] = size
              reposts[statusId] = []
            }
            reposts[statusId].push({
              account: notification.get('account'),
              created_at: notification.get('created_at'),
              id: notification.get('id'),
            })
            break
          }
          case 'group_invite': {
            const groupId = notification.get('group')
            if (group_invites[groupId] === undefined) {
              let size = sortedItems.size
              sortedItems = sortedItems.set(size, ImmutableMap())
              indexesForGroupForGroupInvites[groupId] = size
              group_invites[groupId] = []
            }
            group_invites[groupId].push({
              account: notification.get('account'),
              created_at: notification.get('created_at'),
              id: notification.get('id'),
            })
            break
          }
          case 'group_join_private': {
            const groupId = notification.get('group')
            if (group_join_privates[groupId] === undefined) {
              let size = sortedItems.size
              sortedItems = sortedItems.set(size, ImmutableMap())
              indexesForGroupForGroupJoinPrivates[groupId] = size
              group_join_privates[groupId] = []
            }
            group_join_privates[groupId].push({
              account: notification.get('account'),
              created_at: notification.get('created_at'),
              id: notification.get('id'),
            })
            break
          }
          case 'group_approve_join_private': {
            const groupId = notification.get('group')
            if (group_approve_join_privates[groupId] === undefined) {
              let size = sortedItems.size
              sortedItems = sortedItems.set(size, ImmutableMap())
              indexesForGroupForGroupApproveJoinPrivates[groupId] = size
              group_approve_join_privates[groupId] = []
            }
            group_approve_join_privates[groupId].push({
              account: notification.get('account'),
              created_at: notification.get('created_at'),
              id: notification.get('id'),
            })
            break
          }
          case 'health_expert_application': {
            sortedItems = sortedItems.set(sortedItems.size, ImmutableMap({
              health_expert_application: notification,
            }))
            break
          }
          case 'health_expert_approve': {
            sortedItems = sortedItems.set(sortedItems.size, ImmutableMap({
              health_expert_approve: notification,
            }))
            break
          }
          default: {
            sortedItems = sortedItems.set(sortedItems.size, notification)
            break
          }
        }

        if (follows.size > 0) {
          sortedItems = sortedItems.set(followIndex, ImmutableMap({
            follow: follows,
          }))
        }
        if (Object.keys(likes).length > 0) {
          for (const statusId in likes) {
            if (likes.hasOwnProperty(statusId)) {
              const likeArr = likes[statusId]
              const accounts = likeArr.map((l) => l.account)
              const lastUpdated = likeArr[0]['created_at']
              const isUnread = parseInt(likeArr[0]['id']) > lastReadId

              sortedItems = sortedItems.set(indexesForStatusesForFavorites[statusId], ImmutableMap({
                like: ImmutableMap({
                  accounts,
                  lastUpdated,
                  isUnread,
                  status: statusId,
                })
              }))
            }
          }
        }
        if (Object.keys(reposts).length > 0) {
          for (const statusId in reposts) {
            if (reposts.hasOwnProperty(statusId)) {
              const repostArr = reposts[statusId]
              const accounts = repostArr.map((l) => l.account)
              const lastUpdated = repostArr[0]['created_at']
              const isUnread = parseInt(repostArr[0]['id']) > lastReadId

              sortedItems = sortedItems.set(indexesForStatusesForReposts[statusId], ImmutableMap({
                repost: ImmutableMap({
                  accounts,
                  lastUpdated,
                  isUnread,
                  status: statusId,
                })
              }))
            }
          }
        }
        if (Object.keys(group_invites).length > 0) {
          for (const groupId in group_invites) {
            if (group_invites.hasOwnProperty(groupId)) {
              const groupInviteArr = group_invites[groupId]
              const accounts = groupInviteArr.map((l) => l.account)
              const lastUpdated = groupInviteArr[0]['created_at']
              const isUnread = parseInt(groupInviteArr[0]['id']) > lastReadId
              const statusId =  groupInviteArr[0]['status']

              sortedItems = sortedItems.set(indexesForGroupForGroupInvites[groupId], ImmutableMap({
                group_invite: ImmutableMap({
                  accounts,
                  lastUpdated,
                  isUnread,
                  status: statusId,
                  group: groupId,
                })
              }))
            }
          }
        }
        if (Object.keys(group_join_privates).length > 0) {
          for (const groupId in group_join_privates) {
            if (group_join_privates.hasOwnProperty(groupId)) {
              const groupInviteArr = group_join_privates[groupId]
              const accounts = groupInviteArr.map((l) => l.account)
              const lastUpdated = groupInviteArr[0]['created_at']
              const isUnread = parseInt(groupInviteArr[0]['id']) > lastReadId
              const statusId =  groupInviteArr[0]['status']

              sortedItems = sortedItems.set(indexesForGroupForGroupJoinPrivates[groupId], ImmutableMap({
                group_join_private: ImmutableMap({
                  accounts,
                  lastUpdated,
                  isUnread,
                  status: statusId,
                  group: groupId,
                })
              }))
            }
          }
        }
        if (Object.keys(group_approve_join_privates).length > 0) {
          for (const groupId in group_approve_join_privates) {
            if (group_approve_join_privates.hasOwnProperty(groupId)) {
              const groupInviteArr = group_approve_join_privates[groupId]
              const accounts = groupInviteArr.map((l) => l.account)
              const lastUpdated = groupInviteArr[0]['created_at']
              const isUnread = parseInt(groupInviteArr[0]['id']) > lastReadId
              const statusId =  groupInviteArr[0]['status']

              sortedItems = sortedItems.set(indexesForGroupForGroupApproveJoinPrivates[groupId], ImmutableMap({
                group_approve_join_private: ImmutableMap({
                  accounts,
                  lastUpdated,
                  isUnread,
                  status: statusId,
                  group: groupId,
                })
              }))
            }
          }
        }
      }
    })

    if (sortedItems.size > 0) finalSortedItems = finalSortedItems.concat(sortedItems)
  })

  return state.set('sortedItems', finalSortedItems)
}

const normalizeNotification = (state, notification) => {
  const top = state.get('top')

  if (!top) {
    state = state.update('unread', (unread) => unread + 1)
  }

  state = state.update('items', (list) => {
    if (top && list.size > 40) list = list.take(20)
    return list.unshift(notificationToMap(notification))
  })

  return makeSortedNotifications(state)
}

const expandNormalizedNotifications = (state, notifications, next) => {
  let items = ImmutableList()

  notifications.forEach((n, i) => {
    const noti = notificationToMap(n)
    if (!!noti) items = items.set(items.size, noti)
  })

  state = state.withMutations((mutable) => {
    if (!items.isEmpty()) {
      mutable.update('items', (list) => {
        const lastIndex = 1 + list.findLastIndex(
          item => item !== null && (compareId(item.get('id'), items.last().get('id')) > 0 || item.get('id') === items.last().get('id'))
        )

        const firstIndex = 1 + list.take(lastIndex).findLastIndex(
          item => item !== null && compareId(item.get('id'), items.first().get('id')) > 0
        )

        return list.take(firstIndex).concat(items, list.skip(lastIndex))
      })
    }

    if (!next) mutable.set('hasMore', false)
    mutable.set('isLoading', false)
  })

  return makeSortedNotifications(state)
}

const updateTop = (state, top) => {
  return state.withMutations((mutable) => {
    if (top) mutable.set('unread', 0)
    mutable.set('top', top)
  })
}

const filterNotifications = (state, relationship) => {
  const filterer = (list) => list.filterNot((item) => !!item && item.get('account') === relationship.id)
  state = state.update('items', filterer)
  return makeSortedNotifications(state)
}

const deleteByStatus = (state, statusId) => {
  const filterer = (list) => list.filterNot((item) => !!item && item.get('status') === statusId)
  state = state.update('items', filterer)
  return makeSortedNotifications(state)
}

const updateNotificationsQueue = (state, notification, intlMessages, intlLocale) => {
  const queuedNotifications = state.getIn(['queuedNotifications'], ImmutableList());
  const listedNotifications = state.getIn(['items'], ImmutableList());
  const totalQueuedNotificationsCount = state.getIn(['totalQueuedNotificationsCount'], 0);
  const unread = state.getIn(['unread'], 0)

  let alreadyExists = queuedNotifications.find((existingQueuedNotification) => existingQueuedNotification.id === notification.id);
  if (!alreadyExists) {
    alreadyExists = listedNotifications.find((existingListedNotification) => existingListedNotification.get('id') === notification.id);
  }
  if (alreadyExists) {
    return state;
  }

  let newQueuedNotifications = queuedNotifications;

  return state.withMutations(mutable => {
    if (totalQueuedNotificationsCount <= MAX_QUEUED_NOTIFICATIONS) {
      mutable.set('queuedNotifications', newQueuedNotifications.push({
        notification,
        intlMessages,
        intlLocale,
      }));
    }
    mutable.set('totalQueuedNotificationsCount', totalQueuedNotificationsCount + 1);
    mutable.set('unread', unread + 1);
  });
};

export default function notifications(state = initialState, action) {
  switch(action.type) {
  case NOTIFICATIONS_INITIALIZE:
    return state.withMutations((mutable) => {
      mutable.set('unread', unreadCount)
      mutable.set('lastReadId', lastReadNotificationId)
    })
  case NOTIFICATIONS_MARK_READ:
    return state.set('lastReadId', action.lastReadId);
  case NOTIFICATIONS_EXPAND_REQUEST:
    return state.set('isLoading', true);
  case NOTIFICATIONS_EXPAND_FAIL:
    return state.set('isLoading', false);
  case NOTIFICATIONS_FILTER_SET:
    return state.withMutations(mutable => {
      mutable.set('items', ImmutableList()).set('hasMore', true)
      mutable.setIn(['filter', action.path], action.value)
    })
  case NOTIFICATIONS_SCROLL_TOP:
    return updateTop(state, action.top);
  case NOTIFICATIONS_UPDATE:
    return normalizeNotification(state, action.notification);
  case NOTIFICATIONS_UPDATE_QUEUE:
    return updateNotificationsQueue(state, action.notification, action.intlMessages, action.intlLocale);
  case NOTIFICATIONS_DEQUEUE:
    return state.withMutations(mutable => {
      mutable.set('queuedNotifications', ImmutableList())
      mutable.set('totalQueuedNotificationsCount', 0)
    });
  case NOTIFICATIONS_EXPAND_SUCCESS:
    return expandNormalizedNotifications(state, action.notifications, action.next);
  case ACCOUNT_BLOCK_SUCCESS:
    return filterNotifications(state, action.relationship);
  case ACCOUNT_MUTE_SUCCESS:
    return action.relationship.muting_notifications ? filterNotifications(state, action.relationship) : state;
  case NOTIFICATIONS_CLEAR:
    return state.set('items', ImmutableList()).set('hasMore', false);
  case TIMELINE_DELETE:
    return deleteByStatus(state, action.id);
  case TIMELINE_DISCONNECT:
    return action.timeline === 'home' ?
      state.update('items', items => items.first() ? items.unshift(null) : items) :
      state;
  default:
    return state;
  }
};
