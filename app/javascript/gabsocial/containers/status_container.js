import { FormattedMessage } from 'react-intl'
import {
  Map as ImmutableMap,
  List as ImmutableList,
  fromJS,
} from 'immutable';
import {
  replyCompose,
  mentionCompose,
  quoteCompose,
} from '../actions/compose';
import {
  repost,
  favorite,
  unrepost,
  unfavorite,
} from '../actions/interactions';
import {
  hideStatus,
  revealStatus,
  fetchComments,
  fetchContext,
} from '../actions/statuses';
import { openModal } from '../actions/modal';
import { openPopover } from '../actions/popover';
import {
  me,
  boostModal,
} from '../initial_state'
import {
  MODAL_BOOST,
  MODAL_CONFIRM,
  POPOVER_COMMENT_SORTING_OPTIONS,
  COMMENT_SORTING_TYPE_OLDEST,
  COMMENT_SORTING_TYPE_NEWEST,
  COMMENT_SORTING_TYPE_TOP,
} from '../constants'
import { makeGetStatus } from '../selectors'
import Status from '../components/status';


const sortReplies = (replyIds, state, type) => {
  if (!replyIds) return replyIds

  if (type === COMMENT_SORTING_TYPE_OLDEST || !type) {
    return replyIds // default
  } else if (type === COMMENT_SORTING_TYPE_NEWEST) {
    return replyIds.reverse()
  } else if (type === COMMENT_SORTING_TYPE_TOP) {
    let statusList = []
    replyIds.forEach((replyId) => {
      const status = state.getIn(['statuses', replyId])
      if (status) {
        statusList.push({
          id: replyId,
          likeCount: status.get('favourites_count'),
        })
      }
    })
    statusList.sort((a, b) => parseFloat(b.likeCount) - parseFloat(a.likeCount))
    
    let newReplyIds = ImmutableList()
    for (let i = 0; i < statusList.length; i++) {
      const block = statusList[i];
      newReplyIds = newReplyIds.set(i, block.id)   
    }

    return newReplyIds
  }

  return replyIds
}

const getDescendants = (state, status, highlightStatusId, commentSortingType) => {
  let descendantsIds = ImmutableList()
  let indent = -1
  let index = 0

  descendantsIds = descendantsIds.withMutations(mutable => {
    const ids = [status.get('id')]

    while (ids.length > 0) {
      let id = ids.shift()
      
      let replies = state.getIn(['contexts', 'replies', id])
      // Sort only Top-level replies
      if (index === 0) {
        replies = sortReplies(replies, state, commentSortingType)
      }

      if (status.get('id') !== id) {
        mutable.push(ImmutableMap({
          statusId: id,
          indent: indent,
          isHighlighted: !!highlightStatusId && highlightStatusId === id,
        }))
      }

      if (replies) {
        replies.reverse().forEach(reply => {
          ids.unshift(reply)
        });
        indent++
        indent = Math.min(2, indent)
      } else {
        indent = 0 // reset
      }

      index++
    }
  })

  return descendantsIds
}

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus()

  const mapStateToProps = (state, props) => {
    const statusId = props.id || props.params.statusId
    const username = props.params ? props.params.username : undefined
    const commentSortingType = state.getIn(['settings', 'commentSorting'])

    const status = getStatus(state, {
      id: statusId,
      username: username,
    })

    let fetchedContext = false
    let descendantsIds = ImmutableList()
    let ancestorStatus
    
    //

    if (status && status.get('in_reply_to_account_id') && !props.isChild) {
      fetchedContext = true

      let inReplyTos = state.getIn(['contexts', 'inReplyTos'])
      
      let ancestorsIds = ImmutableList()
      ancestorsIds = ancestorsIds.withMutations(mutable => {
        let id = statusId;
  
        while (id) {
          mutable.unshift(id)
          id = inReplyTos.get(id)
        }
      })
  
      const ancestorStatusId = ancestorsIds.get(0)
      if (ancestorStatusId !== statusId) {
        ancestorStatus = getStatus(state, {
          id: ancestorStatusId,
        })
        if (!!ancestorStatus) descendantsIds = getDescendants(state, ancestorStatus, statusId)
      }
    }

    //

    if (status && status.get('replies_count') > 0 && !fetchedContext) {
      descendantsIds = getDescendants(state, status, null, commentSortingType)
    }

    const isComment = !!status ? !!status.get('in_reply_to_id') : false

    let inReplyToStatus
    if (isComment) {
      if (props.isNotification) {
        inReplyToStatus = getStatus(state, {
          id: status.get('in_reply_to_id'),
        })
      }
    }

    return {
      status,
      ancestorStatus,
      descendantsIds,
      isComment,
      commentSortingType,
      isComposeModalOpen: state.getIn(['modal', 'modalType']) === 'COMPOSE',
      inReplyToStatus,
    }
  }

  return mapStateToProps
};

const mapDispatchToProps = (dispatch) => ({
  onReply (status, router, showModal) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    dispatch((_, getState) => {
      const state = getState();
      if (state.getIn(['compose', 'text']).trim().length !== 0) {
        dispatch(openModal('CONFIRM', {
          message: <FormattedMessage id='confirmations.reply.message' defaultMessage='Replying now will overwrite the message you are currently composing. Are you sure you want to proceed?' />,
          confirm: <FormattedMessage id='confirmations.reply.confirm' defaultMessage='Reply' />,
          onConfirm: () => dispatch(replyCompose(status, router)),
        }))
      } else {
        dispatch(replyCompose(status, router, showModal));
      }
    })
  },

  onShowRevisions (status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    dispatch(openModal('STATUS_REVISION', { status }));
  },

  onFavorite (status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    if (status.get('favourited')) {
      dispatch(unfavorite(status));
    } else {
      dispatch(favorite(status));
    }
  },

  onMention (account, router) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    dispatch(mentionCompose(account, router));
  },

  onOpenMedia (media, index) {
    dispatch(openModal('MEDIA', { media, index }));
  },

  onOpenVideo (media, time) {
    dispatch(openModal('VIDEO', { media, time }));
  },

  onToggleHidden (status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    if (status.get('hidden')) {
      dispatch(revealStatus(status.get('id')));
    } else {
      dispatch(hideStatus(status.get('id')));
    }
  },

  onOpenLikes(status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    dispatch(openModal('STATUS_LIKES', { status }))
  },
    
  onOpenReposts(status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))

    dispatch(openModal('STATUS_REPOSTS', { status }))
  },
  
  onFetchComments(statusId) {
    dispatch(fetchComments(statusId))
  },

  onFetchContext(statusId) {
    dispatch(fetchContext(statusId))
  },

  onQuote (status, router) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))
    
    dispatch((_, getState) => {
      const state = getState()
      if (state.getIn(['compose', 'text']).trim().length !== 0) {
        dispatch(openModal(MODAL_CONFIRM, {
          message: <FormattedMessage id='confirmations.quote.message' defaultMessage='Quoting now will overwrite the message you are currently composing. Are you sure you want to proceed?' />,
          confirm: <FormattedMessage id='confirmations.quote.confirm' defaultMessage='Quote' />,
          onConfirm: () => dispatch(quoteCompose(status, router)),
        }))
      } else {
        dispatch(quoteCompose(status, router))
      }
    })
  },

  onRepost (status) {
    if (!me) return dispatch(openModal('UNAUTHORIZED'))
    
    const alreadyReposted = status.get('reblogged')

    if (boostModal && !alreadyReposted) {
      dispatch(openModal(MODAL_BOOST, {
        status,
        onRepost: () => dispatch(repost(status)),
      }))
    } else {
      if (alreadyReposted) {
        dispatch(unrepost(status))
      } else {
        dispatch(repost(status))
      }
    }
  },

  onCommentSortOpen(targetRef, callback) {
    dispatch(openPopover(POPOVER_COMMENT_SORTING_OPTIONS, {
      targetRef,
      callback,
      position: 'top',
    }))
  }

});

export default connect(makeMapStateToProps, mapDispatchToProps)(Status);
