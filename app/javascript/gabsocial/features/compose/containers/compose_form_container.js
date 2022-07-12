import { List as ImmutableList } from 'immutable'
import ComposeForm from '../components/compose_form'
import {
  changeCompose,
  submitCompose,
  clearComposeSuggestions,
  fetchComposeSuggestions,
  selectComposeSuggestion,
  changeComposeSpoilerText,
  uploadCompose,
  changeScheduledAt,
} from '../../../actions/compose'
import {
  fetchStatus,
} from '../../../actions/statuses';
import { me } from '../../../initial_state'

const mapStateToProps = (state, props) => {
  const {
    replyToId,
    isStandalone,
    shouldCondense,
    modal,
  } = props

  const reduxReplyToId = state.getIn(['compose', 'in_reply_to'])
  const isModalOpen = state.getIn(['modal', 'modalType']) === 'COMPOSE' || isStandalone
  let isMatch;

  if (!!reduxReplyToId && !!replyToId && replyToId === reduxReplyToId) {
    isMatch = true
  } else if (!reduxReplyToId && !replyToId) {
    isMatch = true
  } else {
    isMatch = false
  }

  if (isModalOpen) isMatch = true
  if (isModalOpen && shouldCondense) isMatch = false
  if (isModalOpen && (!modal && !isStandalone)) isMatch = false
  
  // console.log("isMatch:", isMatch, modal, isModalOpen, state.getIn(['compose', 'text']))
  // console.log("reduxReplyToId:", reduxReplyToId, isModalOpen, isStandalone)
  // const edit = state.getIn(['compose', 'id'])

  if (!isMatch) {
    return {
      isMatch,
      isModalOpen,
      reduxReplyToId,
      edit: null,
      text: '',
      markdown: null,
      suggestions: ImmutableList(),
      spoiler: false,
      spoilerText: '',
      privacy: null,
      focusDate: null,
      caretPosition: null,
      preselectDate: null,
      isSubmitting: false,
      isChangingUpload: false,
      isUploading: false,
      showSearch: false,
      anyMedia: false,
      quoteOfId: null,
      scheduledAt: null,
      account: state.getIn(['accounts', me]),
      hasPoll: false,
      selectedGifSrc: null,
    }
  }
  
  return {
    isMatch,
    isModalOpen,
    reduxReplyToId,
    edit: state.getIn(['compose', 'id']) !== null,
    text: state.getIn(['compose', 'text']),
    markdown: state.getIn(['compose', 'markdown']),
    suggestions: state.getIn(['compose', 'suggestions']),
    spoiler: state.getIn(['compose', 'spoiler']),
    spoilerText: state.getIn(['compose', 'spoiler_text']),
    privacy: state.getIn(['compose', 'privacy']),
    focusDate: state.getIn(['compose', 'focusDate']),
    caretPosition: state.getIn(['compose', 'caretPosition']),
    preselectDate: state.getIn(['compose', 'preselectDate']),
    isSubmitting: state.getIn(['compose', 'is_submitting']),
    isChangingUpload: state.getIn(['compose', 'is_changing_upload']),
    isUploading: state.getIn(['compose', 'is_uploading']),
    showSearch: state.getIn(['search', 'submitted']) && !state.getIn(['search', 'hidden']),
    anyMedia: state.getIn(['compose', 'media_attachments']).size > 0,
    quoteOfId: state.getIn(['compose', 'quote_of_id']),
    scheduledAt: state.getIn(['compose', 'scheduled_at']),
    account: state.getIn(['accounts', me]),
    isPro: state.getIn(['accounts', me, 'is_pro']),
    isProPlus: state.getIn(['accounts', me, 'is_proplus']),
    hasPoll: state.getIn(['compose', 'poll']),
    selectedGifSrc: state.getIn(['tenor', 'selectedGif', 'src']),
  }
}

const mapDispatchToProps = (dispatch, { isStandalone }) => ({

  onChange(text, markdown, newReplyToId, position) {
    dispatch(changeCompose(text, markdown, newReplyToId, isStandalone, position))
  },

  onSubmit(groupId, replyToId, router, autoJoinGroup, boost) {
    dispatch(submitCompose(groupId, replyToId, router, isStandalone, autoJoinGroup, boost))
    setTimeout(() => {
      dispatch(fetchStatus(replyToId))
    }, 500);
  },

  onClearSuggestions() {
    dispatch(clearComposeSuggestions())
  },

  onFetchSuggestions(token) {
    dispatch(fetchComposeSuggestions(token))
  },

  onSuggestionSelected(position, token, suggestion, path) {
    dispatch(selectComposeSuggestion(position, token, suggestion, path))
  },

  onChangeSpoilerText(checked) {
    dispatch(changeComposeSpoilerText(checked))
  },

  onPaste(files) {
    dispatch(uploadCompose(files))
  },

  setScheduledAt(date) {
    dispatch(changeScheduledAt(date))
  },
})

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, {
    ...stateProps,
    ...dispatchProps,
  })
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ComposeForm)
