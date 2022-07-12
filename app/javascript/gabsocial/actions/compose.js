import api from '../api';
import { FormattedMessage } from 'react-intl'
import { CancelToken, isCancel } from 'axios';
import throttle from 'lodash.throttle'
import moment from 'moment-mini'
import { isMobile } from '../utils/is_mobile'
import { search as emojiSearch } from '../components/emoji/emoji_mart_search_light';
import { urlRegex } from '../features/ui/util/url_regex'
import { tagHistory } from '../settings';
import { joinGroup } from './groups'
import { useEmoji } from './emojis';
import resizeImage from '../utils/resize_image';
import { importFetchedAccounts } from './importer';
import { updateTimeline, dequeueTimeline, expandAccountTimeline } from './timelines';
// import { showAlert, showAlertForError } from './alerts';
import { defineMessages } from 'react-intl';
import { openModal, closeModal } from './modal';
import {
  STATUS_EXPIRATION_OPTION_5_MINUTES,
  STATUS_EXPIRATION_OPTION_60_MINUTES,
  STATUS_EXPIRATION_OPTION_6_HOURS,
  STATUS_EXPIRATION_OPTION_24_HOURS,
  STATUS_EXPIRATION_OPTION_3_DAYS,
  STATUS_EXPIRATION_OPTION_7_DAYS,
} from '../constants'
import { me } from '../initial_state';
import { makeGetStatus } from '../selectors'

let cancelFetchComposeSuggestionsAccounts;

export const COMPOSE_CHANGE          = 'COMPOSE_CHANGE';
export const COMPOSE_SUBMIT_REQUEST  = 'COMPOSE_SUBMIT_REQUEST';
export const COMPOSE_SUBMIT_SUCCESS  = 'COMPOSE_SUBMIT_SUCCESS';
export const COMPOSE_SUBMIT_FAIL     = 'COMPOSE_SUBMIT_FAIL';
export const COMPOSE_REPLY           = 'COMPOSE_REPLY';
export const COMPOSE_QUOTE           = 'COMPOSE_QUOTE';
export const COMPOSE_REPLY_CANCEL    = 'COMPOSE_REPLY_CANCEL';
export const COMPOSE_MENTION         = 'COMPOSE_MENTION';
export const COMPOSE_RESET           = 'COMPOSE_RESET';
export const COMPOSE_UPLOAD_REQUEST  = 'COMPOSE_UPLOAD_REQUEST';
export const COMPOSE_UPLOAD_SUCCESS  = 'COMPOSE_UPLOAD_SUCCESS';
export const COMPOSE_UPLOAD_FAIL     = 'COMPOSE_UPLOAD_FAIL';
export const COMPOSE_UPLOAD_PROGRESS = 'COMPOSE_UPLOAD_PROGRESS';
export const COMPOSE_UPLOAD_UNDO     = 'COMPOSE_UPLOAD_UNDO';

export const THUMBNAIL_UPLOAD_REQUEST  = 'THUMBNAIL_UPLOAD_REQUEST';
export const THUMBNAIL_UPLOAD_SUCCESS  = 'THUMBNAIL_UPLOAD_SUCCESS';
export const THUMBNAIL_UPLOAD_FAIL     = 'THUMBNAIL_UPLOAD_FAIL';
export const THUMBNAIL_UPLOAD_PROGRESS = 'THUMBNAIL_UPLOAD_PROGRESS';

export const COMPOSE_SUGGESTIONS_CLEAR = 'COMPOSE_SUGGESTIONS_CLEAR';
export const COMPOSE_SUGGESTIONS_READY = 'COMPOSE_SUGGESTIONS_READY';
export const COMPOSE_SUGGESTION_SELECT = 'COMPOSE_SUGGESTION_SELECT';
export const COMPOSE_SUGGESTION_TAGS_UPDATE = 'COMPOSE_SUGGESTION_TAGS_UPDATE';

export const COMPOSE_TAG_HISTORY_UPDATE = 'COMPOSE_TAG_HISTORY_UPDATE';

export const COMPOSE_MOUNT   = 'COMPOSE_MOUNT';
export const COMPOSE_UNMOUNT = 'COMPOSE_UNMOUNT';

export const COMPOSE_SENSITIVITY_CHANGE = 'COMPOSE_SENSITIVITY_CHANGE';
export const COMPOSE_SPOILERNESS_CHANGE = 'COMPOSE_SPOILERNESS_CHANGE';
export const COMPOSE_SPOILER_TEXT_CHANGE = 'COMPOSE_SPOILER_TEXT_CHANGE';
export const COMPOSE_VISIBILITY_CHANGE  = 'COMPOSE_VISIBILITY_CHANGE';
export const COMPOSE_LISTABILITY_CHANGE = 'COMPOSE_LISTABILITY_CHANGE';
export const COMPOSE_COMPOSING_CHANGE = 'COMPOSE_COMPOSING_CHANGE';

export const COMPOSE_EMOJI_INSERT = 'COMPOSE_EMOJI_INSERT';

export const COMPOSE_UPLOAD_CHANGE_REQUEST     = 'COMPOSE_UPLOAD_UPDATE_REQUEST';
export const COMPOSE_UPLOAD_CHANGE_SUCCESS     = 'COMPOSE_UPLOAD_UPDATE_SUCCESS';
export const COMPOSE_UPLOAD_CHANGE_FAIL        = 'COMPOSE_UPLOAD_UPDATE_FAIL';

export const COMPOSE_POLL_ADD             = 'COMPOSE_POLL_ADD';
export const COMPOSE_POLL_REMOVE          = 'COMPOSE_POLL_REMOVE';
export const COMPOSE_POLL_OPTION_ADD      = 'COMPOSE_POLL_OPTION_ADD';
export const COMPOSE_POLL_OPTION_CHANGE   = 'COMPOSE_POLL_OPTION_CHANGE';
export const COMPOSE_POLL_OPTION_REMOVE   = 'COMPOSE_POLL_OPTION_REMOVE';
export const COMPOSE_POLL_SETTINGS_CHANGE = 'COMPOSE_POLL_SETTINGS_CHANGE';

export const COMPOSE_SCHEDULED_AT_CHANGE = 'COMPOSE_SCHEDULED_AT_CHANGE';

export const COMPOSE_EXPIRES_AT_CHANGE = 'COMPOSE_EXPIRES_AT_CHANGE'

export const COMPOSE_RICH_TEXT_EDITOR_CONTROLS_VISIBILITY = 'COMPOSE_RICH_TEXT_EDITOR_CONTROLS_VISIBILITY'

export const COMPOSE_CLEAR = 'COMPOSE_CLEAR'

const messages = defineMessages({
  uploadErrorLimit: { id: 'upload_error.limit', defaultMessage: 'File upload limit exceeded.' },
  uploadErrorPoll:  { id: 'upload_error.poll', defaultMessage: 'File upload not allowed with polls.' },
});

const COMPOSE_PANEL_BREAKPOINT = 600 + (285 * 1) + (10 * 1);

export const ensureComposeIsVisible = (getState, routerHistory) => {
  if (!getState().getIn(['compose', 'mounted']) && window.innerWidth < COMPOSE_PANEL_BREAKPOINT) {
    routerHistory.push('/posts/new');
  }
};

export function changeCompose(text, markdown, replyId, isStandalone, caretPosition) {
  return function (dispatch, getState) {
    const reduxReplyToId = getState().getIn(['compose', 'in_reply_to'])
    const existingText = getState().getIn(['compose', 'text']).trim()
    const isModalOpen = getState().getIn(['modal', 'modalType']) === 'COMPOSE' || isStandalone

    let status
    if (!!replyId) {
      status = getState().getIn(['statuses', replyId])
      status = makeGetStatus()(getState(), {
        id: status.get('id')
      })
    }

    if (!!replyId && replyId !== reduxReplyToId && !isModalOpen) {
      if (existingText.length === 0 && text.trim().length > 0) {
        dispatch({
          type: COMPOSE_REPLY,
          status: status,
          text: text,
        })
      } else if (existingText.length > 0 && text.trim().length > 0) {
        dispatch(openModal('CONFIRM', {
          message: <FormattedMessage id='confirmations.reply.message' defaultMessage='Replying now will overwrite the message you are currently composing. Are you sure you want to proceed?' />,
          confirm: <FormattedMessage id='confirmations.reply.confirm' defaultMessage='Reply' />,
          onConfirm: () => {
            dispatch({
              type: COMPOSE_REPLY,
              status: status,
            })
            dispatch({
              type: COMPOSE_CHANGE,
              text: text,
              markdown: markdown,
              caretPosition: caretPosition,
            })
          }
        }))
      } else {
        dispatch({
          type: COMPOSE_REPLY_CANCEL,
        })
      }
    } else if (!replyId && !!reduxReplyToId && !isModalOpen) {
      if (existingText.length === 0 && text.trim().length > 0) {
        dispatch({
          type: COMPOSE_REPLY_CANCEL,
        })
        dispatch({
          type: COMPOSE_CHANGE,
          text: text,
          markdown: markdown,
          caretPosition: caretPosition,
        })
      } else if (existingText.length > 0 && text.trim().length > 0) {
        dispatch(openModal('CONFIRM', {
          message: <FormattedMessage id='confirmations.new_compose.message' defaultMessage='Composing now will overwrite the reply you are currently writing. Are you sure you want to proceed?' />,
          confirm: <FormattedMessage id='confirmations.new_compose.confirm' defaultMessage='Yes' />,
          onConfirm: () => {
            dispatch({
              type: COMPOSE_REPLY_CANCEL,
            })
            dispatch({
              type: COMPOSE_CHANGE,
              text: text,
              markdown: markdown,
              caretPosition: caretPosition,
            })
          },
        }))    
      } else {
        //
      }
    } else {
      dispatch({
        type: COMPOSE_CHANGE,
        text: text,
        markdown: markdown,
        caretPosition: caretPosition,
      })
    }
  }
}

export function replyCompose(status, router, showModal) {
  return (dispatch) => {
    dispatch({
      type: COMPOSE_REPLY,
      status: status,
    });

    if (isMobile(window.innerWidth)) {
      router.history.push('/compose')
    } else {
      if (showModal) {
        dispatch(openModal('COMPOSE'));
      }
    }
  };
};

export function quoteCompose(status, router) {
  return (dispatch) => {
    dispatch({
      type: COMPOSE_QUOTE,
      status: status,
    });

    if (isMobile(window.innerWidth)) {
      router.history.push('/compose')
    } else {
      dispatch(openModal('COMPOSE'));
    }
  };
};

export function cancelReplyCompose() {
  return {
    type: COMPOSE_REPLY_CANCEL,
  };
};

export function resetCompose() {
  return {
    type: COMPOSE_RESET,
  };
};

export function mentionCompose(account) {
  return (dispatch) => {
    dispatch({
      type: COMPOSE_MENTION,
      account: account,
    });

    dispatch(openModal('COMPOSE'));
  };
};

export function handleComposeSubmit(dispatch, getState, response, status) {
  if (!dispatch || !getState) return;

  const isScheduledStatus = response.data.scheduled_at !== undefined;
  if (isScheduledStatus) {
    // dispatch(showAlertForError({
    //   response: {
    //     data: {},
    //     status: 200,
    //     statusText: 'Successfully scheduled status',
    //   }
    // }));
    dispatch(submitComposeSuccess({ ...response.data }));
    return;
  }
  if (response.data.boost_post_reject == "true"){
    alert("Only one post boost can be used each 24 hours");
  }

  if (response.data.counter_message == "true"){
    window.location.reload();
  }

  dispatch(insertIntoTagHistory(response.data.tags, status));
  dispatch(submitComposeSuccess({ ...response.data }));
  const accountId = response.data.account.id;
  dispatch(expandAccountTimeline(accountId));

  // To make the app more responsive, immediately push the status into the columns
  const insertIfOnline = timelineId => {
    const timeline = getState().getIn(['timelines', timelineId]);

    if (timeline && timeline.get('items').size > 0 && timeline.getIn(['items', 0]) !== null && timeline.get('online')) {
      const dequeueArgs = {};
      if (timelineId === 'community') dequeueArgs.onlyMedia = getState().getIn(['settings', 'community', 'other', 'onlyMedia']);
      dispatch(dequeueTimeline(timelineId, null, dequeueArgs));
      dispatch(updateTimeline(timelineId, { ...response.data }));
    }
  };

  if (response.data.visibility === 'public') {
    insertIfOnline('home');
    insertIfOnline('community');
    insertIfOnline('public');
  }
}

export function submitCompose(groupId, replyToId = null, router, isStandalone, autoJoinGroup, boost) {
  return function (dispatch, getState) {
    if (!me) return;

    if (autoJoinGroup) dispatch(joinGroup(groupId))

    let status = getState().getIn(['compose', 'text'], '');
    let markdown = getState().getIn(['compose', 'markdown'], '');
    const media = getState().getIn(['compose', 'media_attachments']);

    const replacer = (match) => {
      const hasProtocol = match.startsWith('https://') || match.startsWith('http://')
      //Make sure not a remote mention like @someone@somewhere.com
      if (!hasProtocol) {
        if (status.indexOf(`@${match}`) > -1) return match
      }
      return hasProtocol ? match : `http://${match}`
    }

    // : hack :
    //Prepend http:// to urls in status that don't have protocol
    status = `${status}`.replace(urlRegex, replacer)
    markdown = !!markdown ? `${markdown}`.replace(urlRegex, replacer) : undefined

    const inReplyToId = getState().getIn(['compose', 'in_reply_to'], null) || replyToId

    dispatch(submitComposeRequest());
    dispatch(closeModal());

    const id = getState().getIn(['compose', 'id']);
    const endpoint = id === null
      ? '/api/v1/statuses'
      : `/api/v1/statuses/${id}`;
    const method = id === null ? 'post' : 'put';

    let scheduled_at = getState().getIn(['compose', 'scheduled_at'], null);
    if (scheduled_at !== null) scheduled_at = moment.utc(scheduled_at).toDate();

    let expires_at = getState().getIn(['compose', 'expires_at'], null);

    if (expires_at) {
      if (expires_at === STATUS_EXPIRATION_OPTION_5_MINUTES) {
        expires_at = moment.utc().add('5', 'minute').toDate()
      } else if (expires_at === STATUS_EXPIRATION_OPTION_60_MINUTES) {
        expires_at = moment.utc().add('60', 'minute').toDate()
      } else if (expires_at === STATUS_EXPIRATION_OPTION_6_HOURS) {
        expires_at = moment.utc().add('6', 'hour').toDate()
      } else if (expires_at === STATUS_EXPIRATION_OPTION_24_HOURS) {
        expires_at = moment.utc().add('24', 'hour').toDate()
      } else if (expires_at === STATUS_EXPIRATION_OPTION_3_DAYS) {
        expires_at = moment.utc().add('3', 'day').toDate()
      } else if (expires_at === STATUS_EXPIRATION_OPTION_7_DAYS) {
        expires_at = moment.utc().add('7', 'day').toDate()
      }
    }

    if (isMobile(window.innerWidth) && router && isStandalone) {
      router.history.goBack()
    }

    api(getState)[method](endpoint, {
      status,
      markdown,
      expires_at,
      scheduled_at,
      autoJoinGroup,
      in_reply_to_id: inReplyToId,
      quote_of_id: getState().getIn(['compose', 'quote_of_id'], null),
      media_ids: media.map(item => item.get('id')),
      sensitive: getState().getIn(['compose', 'sensitive']),
      spoiler_text: getState().getIn(['compose', 'spoiler_text'], ''),
      visibility: getState().getIn(['compose', 'privacy']),
      poll: getState().getIn(['compose', 'poll'], null),
      group_id: groupId || null,
      boost: boost || false,
    }, {
      headers: {
        'Idempotency-Key': getState().getIn(['compose', 'idempotencyKey']),
      },
    }).then(function (response) {
      handleComposeSubmit(dispatch, getState, response, status);
    }).catch(function (error) {
      dispatch(submitComposeFail(error));
    });
  };
};

export function submitComposeRequest() {
  return {
    type: COMPOSE_SUBMIT_REQUEST,
  };
};

export function submitComposeSuccess(status) {
  return {
    type: COMPOSE_SUBMIT_SUCCESS,
    status: status,
  };
};

export function clearCompose() {
  return {
    type: COMPOSE_CLEAR,
  };
};

export function submitComposeFail(error) {
  return {
    type: COMPOSE_SUBMIT_FAIL,
    error: error,
  }
}

export function uploadCompose(files) {
  return function (dispatch, getState) {
    if (!me) return

    const uploadLimit = 4
    const media  = getState().getIn(['compose', 'media_attachments'])
    const pending  = getState().getIn(['compose', 'pending_media_attachments'])
    const progress = new Array(files.length).fill(0);
    let total = Array.from(files).reduce((a, v) => a + v.size, 0);

    if (files.length + media.size + pending > uploadLimit) {
      // dispatch(showAlert(undefined, messages.uploadErrorLimit));
      return;
    }

    if (getState().getIn(['compose', 'poll'])) {
      // dispatch(showAlert(undefined, messages.uploadErrorPoll));
      return;
    }

    dispatch(uploadComposeRequest());

    for (const [i, f] of Array.from(files).entries()) {
      if (media.size + i > 3) break;

      resizeImage(f).then((file) => {
        const data = new FormData();
        data.append('file', file);
        // Account for disparity in size of original image and resized data
        total += file.size - f.size;

        return api(getState).post('/api/v1/media', data, {
          onUploadProgress: function({ loaded }){
            progress[i] = loaded;
            dispatch(uploadComposeProgress(progress.reduce((a, v) => a + v, 0), total));
          },
        }).then(({ data }) => dispatch(uploadComposeSuccess(data)));
      }).catch(error => dispatch(uploadComposeFail(error, true)));
    };
  };
};

export const uploadThumbnail = (id, file) => (dispatch, getState) => {
  dispatch(uploadThumbnailRequest());

  const total = file.size;
  const data = new FormData();

  data.append('thumbnail', file);

  api(getState).put(`/api/v1/media/${id}`, data, {
    onUploadProgress: ({ loaded }) => {
      dispatch(uploadThumbnailProgress(loaded, total));
    },
  }).then(({ data }) => {
    dispatch(uploadThumbnailSuccess(data));
  }).catch(error => {
    dispatch(uploadThumbnailFail(id, error));
  });
};

export const uploadThumbnailRequest = () => ({
  type: THUMBNAIL_UPLOAD_REQUEST,
  skipLoading: true,
});

export const uploadThumbnailProgress = (loaded, total) => ({
  type: THUMBNAIL_UPLOAD_PROGRESS,
  loaded,
  total,
  skipLoading: true,
});

export const uploadThumbnailSuccess = media => ({
  type: THUMBNAIL_UPLOAD_SUCCESS,
  media,
  skipLoading: true,
});

export const uploadThumbnailFail = error => ({
  type: THUMBNAIL_UPLOAD_FAIL,
  error,
  skipLoading: true,
});

export function changeUploadCompose(id, params) {
  return (dispatch, getState) => {
    if (!me) return;

    dispatch(changeUploadComposeRequest());

    api(getState).put(`/api/v1/media/${id}`, params).then(response => {
      dispatch(changeUploadComposeSuccess(response.data));
    }).catch(error => {
      dispatch(changeUploadComposeFail(id, error));
    });
  };
};

export function changeUploadComposeRequest() {
  return {
    type: COMPOSE_UPLOAD_CHANGE_REQUEST,
    skipLoading: true,
  };
};
export function changeUploadComposeSuccess(media) {
  return {
    type: COMPOSE_UPLOAD_CHANGE_SUCCESS,
    media: media,
    skipLoading: true,
  };
};

export function changeUploadComposeFail(error, decrement = false) {
  return {
    type: COMPOSE_UPLOAD_CHANGE_FAIL,
    error: error,
    decrement: decrement,
    skipLoading: true,
  };
};

export function uploadComposeRequest() {
  return {
    type: COMPOSE_UPLOAD_REQUEST,
    skipLoading: true,
  };
};

export function uploadComposeProgress(loaded, total) {
  return {
    type: COMPOSE_UPLOAD_PROGRESS,
    loaded: loaded,
    total: total,
  };
};

export function uploadComposeSuccess(media) {
  return {
    type: COMPOSE_UPLOAD_SUCCESS,
    media: media,
    skipLoading: true,
  };
};

export function uploadComposeFail(error) {
  return {
    type: COMPOSE_UPLOAD_FAIL,
    error: error,
    skipLoading: true,
  };
};

export function undoUploadCompose(media_id) {
  return {
    type: COMPOSE_UPLOAD_UNDO,
    media_id: media_id,
  };
};

export function clearComposeSuggestions() {
  if (cancelFetchComposeSuggestionsAccounts) {
    cancelFetchComposeSuggestionsAccounts();
  }
  return {
    type: COMPOSE_SUGGESTIONS_CLEAR,
  };
};

const fetchComposeSuggestionsAccounts = throttle((dispatch, getState, token) => {
  if (cancelFetchComposeSuggestionsAccounts) {
    cancelFetchComposeSuggestionsAccounts();
  }
  api(getState).get('/api/v1/accounts/search', {
    cancelToken: new CancelToken(cancel => {
      cancelFetchComposeSuggestionsAccounts = cancel;
    }),
    params: {
      q: token.slice(1),
      resolve: false,
      limit: 4,
    },
  }).then(response => {
    dispatch(importFetchedAccounts(response.data));
    dispatch(readyComposeSuggestionsAccounts(token, response.data));
  }).catch(error => {
    if (!isCancel(error)) {
      // dispatch(showAlertForError(error));
    }
  });
}, 200, { leading: true, trailing: true });

const fetchComposeSuggestionsEmojis = (dispatch, getState, token) => {
  const results = emojiSearch(token.replace(':', ''), { maxResults: 5 });
  dispatch(readyComposeSuggestionsEmojis(token, results));
};

const fetchComposeSuggestionsTags = (dispatch, getState, token) => {
  dispatch(updateSuggestionTags(token));
};

export function fetchComposeSuggestions(token) {
  return (dispatch, getState) => {
    switch (token[0]) {
    case ':':
      fetchComposeSuggestionsEmojis(dispatch, getState, token);
      break;
    case '#':
      fetchComposeSuggestionsTags(dispatch, getState, token);
      break;
    default:
      fetchComposeSuggestionsAccounts(dispatch, getState, token);
      break;
    }
  };
};

export function readyComposeSuggestionsEmojis(token, emojis) {
  return {
    type: COMPOSE_SUGGESTIONS_READY,
    token,
    emojis,
  };
};

export function readyComposeSuggestionsAccounts(token, accounts) {
  return {
    type: COMPOSE_SUGGESTIONS_READY,
    token,
    accounts,
  };
};

export function selectComposeSuggestion(position, token, suggestion, path) {
  return (dispatch, getState) => {
    let completion, startPosition;

    if (typeof suggestion === 'object' && suggestion.id) {
      completion    = suggestion.native || suggestion.colons;
      startPosition = position - 1;

      dispatch(useEmoji(suggestion));
    } else if (suggestion[0] === '#') {
      completion    = suggestion;
      startPosition = position - 1;
    } else {
      completion    = getState().getIn(['accounts', suggestion, 'acct']);
      startPosition = position;
    }

    dispatch({
      type: COMPOSE_SUGGESTION_SELECT,
      position: startPosition,
      token,
      completion,
      path,
    });
  };
};

export function updateSuggestionTags(token) {
  return {
    type: COMPOSE_SUGGESTION_TAGS_UPDATE,
    token,
  };
}

export function updateTagHistory(tags) {
  return {
    type: COMPOSE_TAG_HISTORY_UPDATE,
    tags,
  };
}

export function hydrateCompose() {
  return (dispatch, getState) => {
    const me = getState().getIn(['meta', 'me']);
    const history = tagHistory.get(me);

    if (history !== null) {
      dispatch(updateTagHistory(history));
    }
  };
}

function insertIntoTagHistory(recognizedTags, text) {
  return (dispatch, getState) => {
    const state = getState();
    const oldHistory = state.getIn(['compose', 'tagHistory']);
    const me = state.getIn(['meta', 'me']);
    const names = recognizedTags.map(tag => text.match(new RegExp(`#${tag.name}`, 'i'))[0].slice(1));
    const intersectedOldHistory = oldHistory.filter(name => names.findIndex(newName => newName.toLowerCase() === name.toLowerCase()) === -1);

    names.push(...intersectedOldHistory.toJS());

    const newHistory = names.slice(0, 1000);

    tagHistory.set(me, newHistory);
    dispatch(updateTagHistory(newHistory));
  };
}

export function mountCompose() {
  return {
    type: COMPOSE_MOUNT,
  };
};

export function unmountCompose() {
  return {
    type: COMPOSE_UNMOUNT,
  };
};

export function changeComposeSensitivity() {
  return {
    type: COMPOSE_SENSITIVITY_CHANGE,
  };
};

export function changeComposeSpoilerness() {
  return {
    type: COMPOSE_SPOILERNESS_CHANGE,
  };
};

export function changeComposeSpoilerText(text) {
  return {
    type: COMPOSE_SPOILER_TEXT_CHANGE,
    text,
  };
};

export function changeComposeVisibility(value) {
  return {
    type: COMPOSE_VISIBILITY_CHANGE,
    value,
  };
};

export function insertEmojiCompose(emoji, needsSpace) {
  return {
    type: COMPOSE_EMOJI_INSERT,
    emoji,
    needsSpace,
  };
};

export function changeComposing(value) {
  return {
    type: COMPOSE_COMPOSING_CHANGE,
    value,
  };
};

export function addPoll() {
  return {
    type: COMPOSE_POLL_ADD,
  };
};

export function removePoll() {
  return {
    type: COMPOSE_POLL_REMOVE,
  };
};

export function addPollOption(title) {
  return {
    type: COMPOSE_POLL_OPTION_ADD,
    title,
  };
};

export function changePollOption(index, title) {
  return {
    type: COMPOSE_POLL_OPTION_CHANGE,
    index,
    title,
  };
};

export function removePollOption(index) {
  return {
    type: COMPOSE_POLL_OPTION_REMOVE,
    index,
  };
};

export function changePollSettings(expiresIn, isMultiple) {
  return {
    type: COMPOSE_POLL_SETTINGS_CHANGE,
    expiresIn,
    isMultiple,
  };
};

export function changeScheduledAt(date) {
  return {
    type: COMPOSE_SCHEDULED_AT_CHANGE,
    date,
  };
};

export function changeExpiresAt(value) {
  return {
    type: COMPOSE_EXPIRES_AT_CHANGE,
    value,
  }
}

export function changeRichTextEditorControlsVisibility(open) {
  return {
    type: COMPOSE_RICH_TEXT_EDITOR_CONTROLS_VISIBILITY,
    open,
  }
}
