import api, { getLinks } from '../api';
import IntlMessageFormat from 'intl-messageformat';
import { fetchAccount, fetchRelationships } from './accounts';
import { fetchStatus } from './statuses';
import {
  importFetchedAccount,
  importFetchedAccounts,
  importFetchedStatus,
  importFetchedStatuses,
  importFetchedGroups,
} from './importer';
import { defineMessages } from 'react-intl';
import { List as ImmutableList } from 'immutable';
import { unescapeHTML } from '../utils/html';
import { getFilters, regexFromFilters } from '../selectors';
import { me } from '../initial_state';
import { NOTIFICATION_FILTERS } from '../constants'

export const NOTIFICATIONS_INITIALIZE = 'NOTIFICATIONS_INITIALIZE';
export const NOTIFICATIONS_UPDATE = 'NOTIFICATIONS_UPDATE';
export const NOTIFICATIONS_UPDATE_QUEUE = 'NOTIFICATIONS_UPDATE_QUEUE';
export const NOTIFICATIONS_DEQUEUE = 'NOTIFICATIONS_DEQUEUE';

export const NOTIFICATIONS_EXPAND_REQUEST = 'NOTIFICATIONS_EXPAND_REQUEST';
export const NOTIFICATIONS_EXPAND_SUCCESS = 'NOTIFICATIONS_EXPAND_SUCCESS';
export const NOTIFICATIONS_EXPAND_FAIL = 'NOTIFICATIONS_EXPAND_FAIL';

export const NOTIFICATIONS_FILTER_SET = 'NOTIFICATIONS_FILTER_SET';

export const NOTIFICATIONS_CLEAR = 'NOTIFICATIONS_CLEAR';
export const NOTIFICATIONS_SCROLL_TOP = 'NOTIFICATIONS_SCROLL_TOP';
export const NOTIFICATIONS_MARK_READ = 'NOTIFICATIONS_MARK_READ';

export const MAX_QUEUED_NOTIFICATIONS = 40

defineMessages({
  mention: { id: 'notification.mention', defaultMessage: '{name} mentioned you' },
  group: { id: 'notifications.group', defaultMessage: '{count} notifications' },
});

const fetchRelatedRelationships = (dispatch, notifications) => {
  const accountIds = notifications.filter(item => item.type === 'follow').map(item => item.account.id);

  if (accountIds.length > 0) {
    dispatch(fetchRelationships(accountIds));
  }
}

const fetchRelatedAccounts = (dispatch, notifications) => {
  const accountIds = notifications.filter(item => item.type === 'mention').map(item => item.status.in_reply_to_account_id);

  if (accountIds.length > 0) {
    accountIds.map(accountId => {
      dispatch(fetchAccount(accountId));
    })
  }
}

const fetchRelatedStatuses = (dispatch, notifications) => {
  const statusIds = notifications.filter(item => item.type === 'mention').map(item => item.status.in_reply_to_id);

  if (statusIds.length > 0) {
    statusIds.map(statusId => {
      dispatch(fetchStatus(statusId));
    })
  }
}

export function initializeNotifications() {
  return {
    type: NOTIFICATIONS_INITIALIZE,
  }
}

export function updateNotifications(notification, intlMessages, intlLocale) {
  return (dispatch, getState) => {
    const showInColumn = getState().getIn(['notifications', 'filter', notification.type], true);

    if (showInColumn) {
      dispatch(importFetchedAccount(notification.account));

      if (notification.status) {
        dispatch(importFetchedStatus(notification.status));
      }

      dispatch({
        type: NOTIFICATIONS_UPDATE,
        notification,
      });

      fetchRelatedRelationships(dispatch, [notification]);
    }
  };
};

export function updateNotificationsQueue(notification, intlMessages, intlLocale, curPath) {
  return (dispatch, getState) => {
    // : todo :
    // const showAlert = getState().getIn(['settings', 'notifications', 'alerts', notification.type], true);
    const filters = getFilters(getState(), { contextType: 'notifications' });

    let filtered = false;

    const isOnNotificationsPage = curPath === '/notifications';

    if (notification.type === 'mention') {
      const regex = regexFromFilters(filters);
      const searchIndex = notification.status.spoiler_text + '\n' + unescapeHTML(notification.status.content);
      filtered = regex && regex.test(searchIndex);
    }

    // Desktop notifications
    // : todo :
    // if (typeof window.Notification !== 'undefined' && showAlert && !filtered) {
    //   const title = new IntlMessageFormat(intlMessages[`notification.${notification.type}`], intlLocale).format({ name: notification.account.display_name.length > 0 ? notification.account.display_name : notification.account.username });
    //   const body = (notification.status && notification.status.spoiler_text.length > 0) ? notification.status.spoiler_text : unescapeHTML(notification.status ? notification.status.content : '');

    //   const notify = new Notification(title, { body, icon: notification.account.avatar, tag: notification.id });

    //   notify.addEventListener('click', () => {
    //     window.focus();
    //     notify.close();
    //   });
    // }

    if (isOnNotificationsPage) {
      dispatch({
        type: NOTIFICATIONS_UPDATE_QUEUE,
        notification,
        intlMessages,
        intlLocale,
      });
    } else {
      dispatch(updateNotifications(notification, intlMessages, intlLocale));
    }
  }
};

export function forceDequeueNotifications() {
  return (dispatch,) => {
    dispatch({
      type: NOTIFICATIONS_DEQUEUE,
    })
  }
}

export function dequeueNotifications() {
  return (dispatch, getState) => {
    const queuedNotifications = getState().getIn(['notifications', 'queuedNotifications'], ImmutableList());
    const totalQueuedNotificationsCount = getState().getIn(['notifications', 'totalQueuedNotificationsCount'], 0);

    if (totalQueuedNotificationsCount === 0) {
      return;
    } else if (totalQueuedNotificationsCount > 0 && totalQueuedNotificationsCount <= MAX_QUEUED_NOTIFICATIONS) {
      queuedNotifications.forEach(block => {
        dispatch(updateNotifications(block.notification, block.intlMessages, block.intlLocale));
      });
    } else {
      dispatch(expandNotifications());
    }

    dispatch({
      type: NOTIFICATIONS_DEQUEUE,
    });
    dispatch(markReadNotifications());
  }
};

const excludeTypesFromFilter = filter => {
  const allTypes = ImmutableList(['follow', 'favourite', 'reblog', 'mention', 'poll', 'group_invite', 'group_join_private', 'group_approve_join_private', 'health_expert_application', 'health_expert_approve']);
  return allTypes.filterNot(item => item === filter).toJS();
};

const noOp = () => {}

export function expandNotifications({ maxId } = {}, done = noOp, init = 0) {
  return (dispatch, getState) => {
    if (!me) return

    const onlyVerified = getState().getIn(['notifications', 'filter', 'onlyVerified'])
    const onlyFollowing = getState().getIn(['notifications', 'filter', 'onlyFollowing'])
    const activeFilter = getState().getIn(['notifications', 'filter', 'active'])
    const notifications = getState().get('notifications')
    const isLoadingMore = !!maxId

    if (notifications.get('isLoading') || activeFilter === 'follow_requests') {
      done();
      return;
    }

    const params = {
      max_id: maxId,
      exclude_types: activeFilter === 'all' ? null : excludeTypesFromFilter(activeFilter),
    }

    if (!!onlyVerified) params.only_verified = onlyVerified
    if (!!onlyFollowing) params.only_following = onlyFollowing

    if (!init) {
      if (!maxId && notifications.get('items').size > 0) {
        params.since_id = notifications.getIn(['items', 0, 'id']);
      }
    }

    dispatch(expandNotificationsRequest(isLoadingMore));

    api(getState).get('/api/v1/notifications', { params }).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data.map(item => item.account)));
      dispatch(importFetchedStatuses(response.data.map(item => item.status).filter(status => !!status)));
      dispatch(importFetchedGroups(response.data.map(item => item.group)));

      dispatch(expandNotificationsSuccess(response.data, next ? next.uri : null, isLoadingMore));

      fetchRelatedRelationships(dispatch, response.data);
      fetchRelatedStatuses(dispatch, response.data);

      done();
    }).catch(error => {
      dispatch(expandNotificationsFail(error, isLoadingMore));
      done();
    });
  };
};

export function expandNotificationsRequest(isLoadingMore) {
  return {
    type: NOTIFICATIONS_EXPAND_REQUEST,
    skipLoading: !isLoadingMore,
  };
};

export function expandNotificationsSuccess(notifications, next, isLoadingMore) {
  return {
    type: NOTIFICATIONS_EXPAND_SUCCESS,
    notifications,
    next,
    skipLoading: !isLoadingMore,
  };
};

export function expandNotificationsFail(error, isLoadingMore) {
  return {
    type: NOTIFICATIONS_EXPAND_FAIL,
    error,
    skipLoading: !isLoadingMore,
  };
};

export function clearNotifications() {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch({
      type: NOTIFICATIONS_CLEAR,
    });

    api(getState).post('/api/v1/notifications/clear');
  };
};

export function scrollTopNotifications(top) {
  return (dispatch, getState) => {
    dispatch({
      type: NOTIFICATIONS_SCROLL_TOP,
      top,
    });
    dispatch(markReadNotifications());
  }
};

export function setFilter(path, value) {
  return (dispatch) => {
    if (path === 'active' && NOTIFICATION_FILTERS.indexOf(value) === -1) return

    dispatch({
      type: NOTIFICATIONS_FILTER_SET,
      path: path,
      value: value,
    })
    dispatch(expandNotifications())
  }
}

export function markReadNotifications() {
  return (dispatch, getState) => {
    if (!me) return
    
    const topNotification = parseInt(getState().getIn(['notifications', 'items', 0, 'id']))
    const lastReadId = getState().getIn(['notifications', 'lastReadId'])

    if (topNotification && topNotification > lastReadId && lastReadId !== -1) {
      api(getState).post('/api/v1/notifications/mark_read', {
        id: topNotification
      }).then(() => {
        dispatch({
          type: NOTIFICATIONS_MARK_READ,
          notification: topNotification,
        })
      })
    }
  }
}