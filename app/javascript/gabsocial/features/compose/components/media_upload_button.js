import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import { uploadCompose } from '../../../actions/compose'
import ComposeExtraButton from './compose_extra_button'

const messages = defineMessages({
  upload: { id: 'upload_button.label', defaultMessage: 'Add media (JPEG, PNG, GIF, WebM, MP4, MOV)' },
  title: { id: 'upload_button.title', defaultMessage: 'Photo/Video' },
})

const makeMapStateToProps = () => {
  const mapStateToProps = (state) => ({
    acceptContentTypes: state.getIn(['media_attachments', 'accept_content_types']),
    disabled: state.getIn(['compose', 'is_uploading']) || (state.getIn(['compose', 'media_attachments']).size + state.getIn(['compose', 'pending_media_attachments']) > 3 || state.getIn(['compose', 'media_attachments']).some(m => ['video', 'audio', 'gifv'].includes(m.get('type')))),
    unavailable: state.getIn(['compose', 'poll']) !== null,
    resetFileKey: state.getIn(['compose', 'resetFileKey']),
  })

  return mapStateToProps
}

const mapDispatchToProps = (dispatch) => ({
  onSelectFile: (files) => dispatch(uploadCompose(files)),
})

export default
@connect(makeMapStateToProps, mapDispatchToProps)
@injectIntl
class UploadButton extends ImmutablePureComponent {

  static propTypes = {
    disabled: PropTypes.bool,
    unavailable: PropTypes.bool,
    onSelectFile: PropTypes.func.isRequired,
    style: PropTypes.object,
    resetFileKey: PropTypes.number,
    acceptContentTypes: ImmutablePropTypes.listOf(PropTypes.string).isRequired,
    intl: PropTypes.object.isRequired,
    small: PropTypes.bool,
  }

  handleChange = (e) => {
    if (e.target.files.length > 0) {
      this.props.onSelectFile(e.target.files)
    }
  }

  handleClick = () => {
    this.fileElement.click()
  }

  setRef = (c) => {
    this.fileElement = c
  }

  render() {
    const { intl, resetFileKey, unavailable, disabled, acceptContentTypes, small } = this.props

    if (unavailable) return null

    return (
      <ComposeExtraButton
        title={intl.formatMessage(messages.title)}
        disabled={disabled}
        onClick={this.handleClick}
        icon='media'
        small={small}
      >
        <label>
          <span className={_s.displayNone}>{intl.formatMessage(messages.upload)}</span>
          <input
            key={resetFileKey}
            ref={this.setRef}
            type='file'
            accept={acceptContentTypes.toArray().join(',')}
            onChange={this.handleChange}
            disabled={disabled}
            className={_s.displayNone}
            multiple
          />
        </label>
      </ComposeExtraButton>
    )
  }

}
