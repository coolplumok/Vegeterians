import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Textarea from 'react-textarea-autosize';
import { changeUploadCompose, uploadThumbnail } from '../../actions/compose';
import { getPointerPosition } from '../video';
import { defineMessages, injectIntl } from 'react-intl';
import Button from '../button';
import Video from '../video';
import CharacterCounter from '../character_counter';
import { length } from 'stringz';
import { me } from '../../initial_state';
import Block from '../block'
import Heading from '../heading'
// import Audio from 'gabsocial/components/audio';
// import UploadProgress from 'gabsocial/features/compose/components/upload_progress';
// import { Tesseract as fetchTesseract } from 'gabsocial/features/ui/util/async_components';
// import GIFV from 'gabsocial/components/gifv';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  apply: { id: 'upload_modal.apply', defaultMessage: 'Apply' },
  placeholder: { id: 'upload_modal.description_placeholder', defaultMessage: 'A quick brown fox jumps over the lazy dog' },
  chooseImage: { id: 'upload_modal.choose_image', defaultMessage: 'Choose image' },
  editMedia: { id: 'upload_modal.edit_media', defaultMessage: 'Edit Media' },
  audioDescription: { id: 'upload_form.audio_description', defaultMessage: 'Describe for people with hearing loss' },
  videoDescription: { id: 'upload_form.video_description', defaultMessage: 'Describe for people with hearing loss or visual impairment' },
  description: { id: 'upload_form.description', defaultMessage: 'Describe for the visually impaired' },
  hint: { id: 'upload_modal.hint', defaultMessage: 'Click or drag the circle on the preview to choose the focal point which will always be in view on all thumbnails.' },
  thumbnail: { id: 'upload_form.thumbnail', defaultMessage: 'Change thumbnail' },
  analyzingPicture: { id: 'upload_modal.analyzing_picture', defaultMessage: 'Analyzing picture…' },
  detectText: { id: 'upload_modal.detect_text', defaultMessage: 'Detect text from picture' },
  previewLabel: { id: 'upload_modal.preview_label', defaultMessage: 'Preview ({ratio})', values: { ratio: '16:9' } },
});

const mapStateToProps = (state, { id }) => ({
  media: state.getIn(['compose', 'media_attachments']).find(item => item.get('id') === id),
  account: state.getIn(['accounts', me]),
  isUploadingThumbnail: state.getIn(['compose', 'isUploadingThumbnail']),
});

const mapDispatchToProps = (dispatch, { id }) => ({

  onSave: (description, x, y) => {
    dispatch(changeUploadCompose(id, { description, focus: `${x.toFixed(2)},${y.toFixed(2)}` }));
  },

  onSelectThumbnail: files => {
    dispatch(uploadThumbnail(id, files[0]));
  },

});

const removeExtraLineBreaks = str => str.replace(/\n\n/g, '******')
  .replace(/\n/g, ' ')
  .replace(/\*\*\*\*\*\*/g, '\n\n');

const assetHost = process.env.CDN_HOST || '';

class ImageLoader extends React.PureComponent {

  static propTypes = {
    src: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
  };

  state = {
    loading: true,
  };

  componentDidMount() {
    const image = new Image();
    image.addEventListener('load', () => this.setState({ loading: false }));
    image.src = this.props.src;
  }

  render () {
    const { loading } = this.state;

    if (loading) {
      return <canvas width={this.props.width} height={this.props.height} />;
    } else {
      return <img {...this.props} alt='' />;
    }
  }

}

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class EditMediaModal extends ImmutablePureComponent {

  static propTypes = {
    media: ImmutablePropTypes.map.isRequired,
    account: ImmutablePropTypes.map.isRequired,
    isUploadingThumbnail: PropTypes.bool,
    onSave: PropTypes.func.isRequired,
    onSelectThumbnail: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    x: 0,
    y: 0,
    focusX: 0,
    focusY: 0,
    dragging: false,
    description: '',
    dirty: false,
    progress: 0,
    loading: true,
  };

  componentWillMount () {
    this.updatePositionFromMedia(this.props.media);
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.media.get('id') !== nextProps.media.get('id')) {
      this.updatePositionFromMedia(nextProps.media);
    }
  }

  componentWillUnmount () {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseDown = e => {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);

    this.updatePosition(e);
    this.setState({ dragging: true });
  }

  handleTouchStart = e => {
    document.addEventListener('touchmove', this.handleMouseMove);
    document.addEventListener('touchend', this.handleTouchEnd);

    this.updatePosition(e);
    this.setState({ dragging: true });
  }

  handleMouseMove = e => {
    this.updatePosition(e);
  }

  handleMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);

    this.setState({ dragging: false });
  }

  handleTouchEnd = () => {
    document.removeEventListener('touchmove', this.handleMouseMove);
    document.removeEventListener('touchend', this.handleTouchEnd);

    this.setState({ dragging: false });
  }

  updatePosition = e => {
    const { x, y } = getPointerPosition(this.node, e);
    const focusX   = (x - .5) *  2;
    const focusY   = (y - .5) * -2;

    this.setState({ x, y, focusX, focusY, dirty: true });
  }

  updatePositionFromMedia = media => {
    const focusX      = media.getIn(['meta', 'focus', 'x']);
    const focusY      = media.getIn(['meta', 'focus', 'y']);
    const description = media.get('description') || '';

    if (focusX && focusY) {
      const x = (focusX /  2) + .5;
      const y = (focusY / -2) + .5;

      this.setState({
        x,
        y,
        focusX,
        focusY,
        description,
        dirty: false,
      });
    } else {
      this.setState({
        x: 0.5,
        y: 0.5,
        focusX: 0,
        focusY: 0,
        description,
        dirty: false,
      });
    }
  }

  handleChange = e => {
    this.setState({ description: e.target.value, dirty: true });
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();
      this.setState({ description: e.target.value, dirty: true });
      this.handleSubmit();
    }
  }

  handleSubmit = () => {
    this.props.onSave(this.state.description, this.state.focusX, this.state.focusY);
    this.props.onClose();
  }

  handleOnClose = () => {
    this.props.onClose();
  }

  setRef = c => {
    this.node = c;
  }

  handleTextDetection = () => {
    /* const { media } = this.props;

    this.setState({ detecting: true });

    fetchTesseract().then(({ TesseractWorker }) => {
      const worker = new TesseractWorker({
        workerPath: `${assetHost}/packs/ocr/worker.min.js`,
        corePath: `${assetHost}/packs/ocr/tesseract-core.wasm.js`,
        langPath: `${assetHost}/ocr/lang-data`,
      });

      let media_url = media.get('url');

      if (window.URL && URL.createObjectURL) {
        try {
          media_url = URL.createObjectURL(media.get('file'));
        } catch (error) {
          console.error(error);
        }
      }

      worker.recognize(media_url)
        .progress(({ progress }) => this.setState({ progress }))
        .finally(() => worker.terminate())
        .then(({ text }) => this.setState({ description: removeExtraLineBreaks(text), dirty: true, detecting: false }))
        .catch(() => this.setState({ detecting: false }));
    }).catch(() => this.setState({ detecting: false })); */
  }

  handleThumbnailChange = e => {
    if (e.target.files.length > 0) {
      this.setState({ dirty: true });
      this.props.onSelectThumbnail(e.target.files);
    }
  }

  setFileInputRef = c => {
    this.fileInput = c;
  }

  handleFileInputClick = () => {
    this.fileInput.click();
  }

  render () {
    const { media, intl, isUploadingThumbnail } = this.props;
    const { x, y, dragging, description, dirty, detecting } = this.state;

    const width  = media.getIn(['meta', 'original', 'width']) || null;
    const height = media.getIn(['meta', 'original', 'height']) || null;
    const focals = ['image'].includes(media.get('type'));
    const thumbnailable = ['audio', 'video', 'gifv'].includes(media.get('type'));

    const previewRatio  = 16/9;
    const previewWidth  = 200;
    const previewHeight = previewWidth / previewRatio;

    let descriptionLabel = null;

    if (media.get('type') === 'audio') {
      descriptionLabel = intl.formatMessage(messages.audioDescription);
    } else if (media.get('type') === 'video') {
      descriptionLabel = intl.formatMessage(messages.videoDescription);
    } else {
      descriptionLabel = intl.formatMessage(messages.description);
    }

    return (
      <div style={{ maxWidth: '960px' }} className={[_s.default, _s.modal].join(' ')}>
        <Block>
          <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.justifyContentCenter, _s.borderBottom1PX, _s.borderColorSecondary, _s.height53PX, _s.px15].join(' ')}>
            <div className={[_s.mlAuto].join(' ')}>
              <Heading size='h2'>
                {intl.formatMessage(messages.editMedia)}
              </Heading>
            </div>
            <Button
              className={[_s.mlAuto].join(' ')}
              backgroundColor='none'
              title={intl.formatMessage(messages.close)}
              onClick={this.handleOnClose}
              color='secondary'
              icon='close'
              iconSize='10px'
            />
          </div>

          <div className={[_s.default, _s.flexRow, _s.justifyContentCenter].join(' ')}>
            <div className={[_s.px15, _s.py15, _s.borderColorSecondary, _s.borderRight1PX].join(' ')} style={{ 'border-right-style': 'solid' }}>
              {focals && <p>{intl.formatMessage(messages.hint)}</p>}

              {thumbnailable && (
                <React.Fragment>
                  <label className={[_s.fontWeightBold, _s.pb10].join(' ')} style={{ display: 'inline-block' }} htmlFor='upload-modal__thumbnail'>{intl.formatMessage(messages.thumbnail)}</label>

                  <Button disabled={isUploadingThumbnail} onClick={this.handleFileInputClick}>
                    {intl.formatMessage(messages.chooseImage)}
                  </Button>

                  <label>
                    <span style={{ display: 'none' }}>{intl.formatMessage(messages.chooseImage)}</span>

                    <input
                      id='upload-modal__thumbnail'
                      ref={this.setFileInputRef}
                      type='file'
                      accept='image/png,image/jpeg'
                      onChange={this.handleThumbnailChange}
                      style={{ display: 'none' }}
                      disabled={isUploadingThumbnail}
                    />
                  </label>
                </React.Fragment>
              )}

              <label className={[_s.fontWeightBold, _s.pt15, _s.pb5].join(' ')} style={{ display: 'inline-block' }} htmlFor='upload-modal__description'>
                {descriptionLabel}
              </label>

              <div className={[_s.default].join(' ')}>
                <Textarea
                  id='upload-modal__description'
                  className={[_s.heightMin50PX, _s.flexGrow1].join(' ')}
                  value={detecting ? '…' : description}
                  onChange={this.handleChange}
                  onKeyDown={this.handleKeyDown}
                  disabled={detecting}
                  autoFocus
                />

                <div className='setting-text__modifiers'>
                  {/* <UploadProgress progress={progress * 100} active={detecting} icon='file-text-o' message={intl.formatMessage(messages.analyzingPicture)} /> */}
                </div>
              </div>

              <div className={[_s.default, _s.flexRow, _s.justifyContentSpaceBetween].join(' ')}>
                {media.get('type') === 'image' &&
                  <button disabled={detecting || media.get('type') !== 'image'} onClick={this.handleTextDetection}>{intl.formatMessage(messages.detectText)}</button>
                }
                <CharacterCounter max={1500} text={detecting ? '' : description} />
              </div>

              {/* <div className={[_s.mb15].join(' ')}> */}
              <Button className={[_s.pt15].join(' ')} disabled={!dirty || detecting || isUploadingThumbnail || length(description) > 1500} onClick={this.handleSubmit}>
                {intl.formatMessage(messages.apply)}
              </Button>
              {/* </div> */}
            </div>

            <div className='focal-point-modal__content'>
              {focals && (
                <div className={classNames('focal-point', { dragging })} ref={this.setRef} onMouseDown={this.handleMouseDown} onTouchStart={this.handleTouchStart}>
                  {media.get('type') === 'image' && <ImageLoader src={media.get('url')} width={width} height={height} alt='' />}
                  {/* {media.get('type') === 'gifv' && <GIFV src={media.get('url')} width={width} height={height} />} */}

                  <div className='focal-point__preview'>
                    <strong>{intl.formatMessage(messages.previewLabel)}</strong>
                    <div style={{ width: previewWidth, height: previewHeight, backgroundImage: `url(${media.get('preview_url')})`, backgroundSize: 'cover', backgroundPosition: `${x * 100}% ${y * 100}%` }} />
                  </div>

                  <div className='focal-point__reticle' style={{ top: `${y * 100}%`, left: `${x * 100}%` }} />
                  <div className='focal-point__overlay' />
                </div>
              )}

              {(media.get('type') === 'video' || media.get('type') === 'gifv') && (
                <Video
                  preview={media.get('preview_url')}
                  blurhash={media.get('blurhash')}
                  src={media.get('url')}
                  meta={media.get('meta')}
                  detailed
                  inline
                  editable
                />
              )}

              {/* {media.get('type') === 'audio' && (
                <Audio
                  src={media.get('url')}
                  duration={media.getIn(['meta', 'original', 'duration'], 0)}
                  height={150}
                  poster={media.get('preview_url') || account.get('avatar_static')}
                  backgroundColor={media.getIn(['meta', 'colors', 'background'])}
                  foregroundColor={media.getIn(['meta', 'colors', 'foreground'])}
                  accentColor={media.getIn(['meta', 'colors', 'accent'])}
                  editable
                />
              )} */}
            </div>
          </div>
        </Block>
      </div>
    );
  }

}
