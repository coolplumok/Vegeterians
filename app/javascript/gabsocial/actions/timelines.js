import { Map as ImmutableMap, List as ImmutableList, toJS } from 'immutable';
import { importFetchedStatus, importFetchedStatuses } from './importer';
import api, { getLinks } from '../api';
import { fetchRelationships } from './accounts'

export const TIMELINE_UPDATE = 'TIMELINE_UPDATE';
export const TIMELINE_DELETE = 'TIMELINE_DELETE';
export const TIMELINE_CLEAR = 'TIMELINE_CLEAR';
export const TIMELINE_UPDATE_QUEUE = 'TIMELINE_UPDATE_QUEUE';
export const TIMELINE_DEQUEUE = 'TIMELINE_DEQUEUE';
export const TIMELINE_SCROLL_TOP = 'TIMELINE_SCROLL_TOP';

export const TIMELINE_EXPAND_REQUEST = 'TIMELINE_EXPAND_REQUEST';
export const TIMELINE_EXPAND_SUCCESS = 'TIMELINE_EXPAND_SUCCESS';
export const TIMELINE_EXPAND_FAIL = 'TIMELINE_EXPAND_FAIL';

export const TIMELINE_CONNECT = 'TIMELINE_CONNECT';
export const TIMELINE_DISCONNECT = 'TIMELINE_DISCONNECT';

export const MAX_QUEUED_ITEMS = 40;

const fetchStatusesAccountsRelationships = (dispatch, statuses) => {
  const accountIds = statuses.map(item => item.account.id)
  if (accountIds.length > 0) {
    dispatch(fetchRelationships(accountIds));
  }
}

export function updateTimeline(timeline, status, accept) {
  return dispatch => {
    if (typeof accept === 'function' && !accept(status)) {
      return;
    }

    dispatch(importFetchedStatus(status));

    dispatch({
      type: TIMELINE_UPDATE,
      timeline,
      status,
    });
  };
};

export function updateTimelineQueue(timeline, status, accept) {
  return dispatch => {
    if (typeof accept === 'function' && !accept(status)) {
      return;
    }

    dispatch({
      type: TIMELINE_UPDATE_QUEUE,
      timeline,
      status,
    });
  }
};

export function forceDequeueTimeline(timeline) {
  return (dispatch) => {
    dispatch({
      type: TIMELINE_DEQUEUE,
      timeline,
    })
  }
}

export function dequeueTimeline(timeline, expandFunc, optionalExpandArgs) {
  return (dispatch, getState) => {
    const queuedItems = getState().getIn(['timelines', timeline, 'queuedItems'], ImmutableList());
    const totalQueuedItemsCount = getState().getIn(['timelines', timeline, 'totalQueuedItemsCount'], 0);

    let shouldDispatchDequeue = true;

    if (totalQueuedItemsCount === 0) {
      return;
    } else if (totalQueuedItemsCount > 0 && totalQueuedItemsCount <= MAX_QUEUED_ITEMS) {
      queuedItems.forEach(status => {
        dispatch(updateTimeline(timeline, status.toJS(), null));
      });
    } else {
      if (typeof expandFunc === 'function') {
        dispatch(clearTimeline(timeline));
        expandFunc();
      } else {
        if (timeline === 'home') {
          dispatch(clearTimeline(timeline));
          dispatch(expandHomeTimeline(optionalExpandArgs));
        } else if (timeline === 'community') {
          dispatch(clearTimeline(timeline));
          dispatch(expandCommunityTimeline(optionalExpandArgs));
        } else {
          shouldDispatchDequeue = false;
        }
      }
    }

    if (!shouldDispatchDequeue) return;

    dispatch({
      type: TIMELINE_DEQUEUE,
      timeline,
    });
  }
};

export function deleteFromTimelines(id) {
  return (dispatch, getState) => {
    const accountId = getState().getIn(['statuses', id, 'account']);
    const references = getState().get('statuses').filter(status => status.get('reblog') === id).map(status => [status.get('id'), status.get('account')]);
    const reblogOf = getState().getIn(['statuses', id, 'reblog'], null);

    dispatch({
      type: TIMELINE_DELETE,
      id,
      accountId,
      references,
      reblogOf,
    });
  };
};

export function clearTimeline(timeline) {
  return (dispatch) => {
    dispatch({ type: TIMELINE_CLEAR, timeline });
  };
};

const noOp = () => { };

const parseTags = (tags = {}, mode) => {
  return (tags[mode] || []).map((tag) => {
    return tag.value;
  });
};

export function expandTimeline(timelineId, path, params = {}, done = noOp) {
  return (dispatch, getState) => {
    const timeline = getState().getIn(['timelines', timelineId], ImmutableMap());
    const isLoadingMore = !!params.max_id;

    if (timeline.get('isLoading')) {
      done();
      return;
    }

    if (!params.max_id && !params.pinned && timeline.get('items', ImmutableList()).size > 0) {
      params.since_id = timeline.getIn(['items', 0]);
    }

    const isLoadingRecent = !!params.since_id;

    dispatch(expandTimelineRequest(timelineId, isLoadingMore));

    api(getState).get(path, { params }).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedStatuses(response.data));
      dispatch(expandTimelineSuccess(timelineId, response.data, next ? next.uri : null, response.code === 206, isLoadingRecent, isLoadingMore));
      fetchStatusesAccountsRelationships(dispatch, response.data)
      done();
    }).catch(error => {
      dispatch(expandTimelineFail(timelineId, error, isLoadingMore));
      done();
    });
  };
};

export const expandHomeTimeline = ({ maxId } = {}, done = noOp) => expandTimeline('home', '/api/v1/timelines/home', { max_id: maxId }, done);
export const expandProTimeline = ({ maxId } = {}, done = noOp) => expandTimeline('pro', '/api/v1/timelines/pro', { max_id: maxId }, done);
export const expandExpertTimeline = ({ maxId } = {}, done = noOp) => expandTimeline('expert', '/api/v1/timelines/expert', { max_id: maxId }, done);
export const expandCommunityTimeline = ({ maxId, onlyMedia } = {}, done = noOp) => expandTimeline(`community${onlyMedia ? ':media' : ''}`, '/api/v1/timelines/public', { max_id: maxId, only_media: !!onlyMedia }, done);
export const expandAccountTimeline = (accountId, { maxId, withReplies, commentsOnly } = {}) => expandTimeline(`account:${accountId}${withReplies ? ':with_replies' : ''}${commentsOnly ? ':comments_only' : ''}`, `/api/v1/accounts/${accountId}/statuses`, { only_comments: commentsOnly, exclude_replies: (!withReplies && !commentsOnly), max_id: maxId });
export const expandAccountFeaturedTimeline = accountId => expandTimeline(`account:${accountId}:pinned`, `/api/v1/accounts/${accountId}/statuses`, { pinned: true });
export const expandAccountMediaTimeline = (accountId, { maxId, limit, mediaType } = {}) => expandTimeline(`account:${accountId}:media`, `/api/v1/accounts/${accountId}/statuses`, { max_id: maxId, only_media: true, limit: limit || 20, media_type: mediaType });
export const expandListTimeline = (id, { maxId } = {}, done = noOp) => expandTimeline(`list:${id}`, `/api/v1/timelines/list/${id}`, { max_id: maxId }, done);
export const expandGroupTimeline = (id, { maxId } = {}, done = noOp) => expandTimeline(`group:${id}`, `/api/v1/timelines/group/${id}`, { max_id: maxId }, done);
export const expandHashtagTimeline = (hashtag, { maxId, tags } = {}, done = noOp) => {
  return expandTimeline(`hashtag:${hashtag}`, `/api/v1/timelines/tag/${hashtag}`, {
    max_id: maxId,
    any: parseTags(tags, 'any'),
    all: parseTags(tags, 'all'),
    none: parseTags(tags, 'none'),
  }, done);
};

export function expandTimelineRequest(timeline, isLoadingMore) {
  return {
    type: TIMELINE_EXPAND_REQUEST,
    timeline,
    skipLoading: !isLoadingMore,
  };
};

export function expandTimelineSuccess(timeline, statuses, next, partial, isLoadingRecent, isLoadingMore) {
  return {
    type: TIMELINE_EXPAND_SUCCESS,
    timeline,
    statuses,
    next,
    partial,
    isLoadingRecent,
    skipLoading: !isLoadingMore,
  };
};

export function expandTimelineFail(timeline, error, isLoadingMore) {
  return {
    type: TIMELINE_EXPAND_FAIL,
    timeline,
    error,
    skipLoading: !isLoadingMore,
  };
};

export function connectTimeline(timeline) {
  return {
    type: TIMELINE_CONNECT,
    timeline,
  };
};

export function disconnectTimeline(timeline) {
  return {
    type: TIMELINE_DISCONNECT,
    timeline,
  };
};

export function scrollTopTimeline(timeline, top) {
  return {
    type: TIMELINE_SCROLL_TOP,
    timeline,
    top,
  };
};
export const expandTrendsTimeline = ({ maxId } = {}, done = noOp) => expandTimeline('trends', '/api/v1/timelines/trends', { max_id: maxId }, done);
