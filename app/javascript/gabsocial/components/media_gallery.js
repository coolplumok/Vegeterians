import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { is } from 'immutable';
import { defineMessages, injectIntl } from 'react-intl';
import classNames from 'classnames/bind'
import { decode } from 'blurhash';
import { autoPlayGif, displayMedia } from '../initial_state';
import { isIOS } from '../utils/is_mobile';
import { isPanoramic, isPortrait, isNonConformingRatio, minimumAspectRatio, maximumAspectRatio } from '../utils/media_aspect_ratio';
import Button from './button'
import SensitiveMediaItem from './sensitive_media_item'
import Text from './text'

const messages = defineMessages({
  toggle_visible: { id: 'media_gallery.toggle_visible', defaultMessage: 'Hide media' },
  warning: { id: 'status.sensitive_warning', defaultMessage: 'Sensitive content' },
  hidden: { id: 'status.media_hidden', defaultMessage: 'Media hidden' },
});

const cx = classNames.bind(_s)

class Item extends ImmutablePureComponent {

  static propTypes = {
    attachment: ImmutablePropTypes.map.isRequired,
    standalone: PropTypes.bool,
    index: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
    displayWidth: PropTypes.number,
    visible: PropTypes.bool.isRequired,
    dimensions: PropTypes.object,
  }

  static defaultProps = {
    standalone: false,
    index: 0,
    size: 1,
  }

  state = {
    loaded: false,
  }

  handleMouseEnter = (e) => {
    if (this.hoverToPlay()) {
      e.target.play();
    }
  }

  handleMouseLeave = (e) => {
    if (this.hoverToPlay()) {
      e.target.pause();
      e.target.currentTime = 0;
    }
  }

  handleLoadedMetaData = (e) => {
    if (!this.hoverToPlay()) {
      e.target.play();
    }
  }

  hoverToPlay() {
    const { attachment } = this.props;
    return autoPlayGif === false && attachment.get('type') === 'gifv';
  }

  handleClick = (e) => {
    const { index, onClick } = this.props;

    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      if (this.hoverToPlay()) {
        e.target.pause();
        e.target.currentTime = 0;
      }

      e.preventDefault();
      onClick(index);
    }

    e.stopPropagation();
  }

  componentDidMount() {
    if (this.props.attachment.get('blurhash')) {
      this._decode();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.attachment.get('blurhash') !== this.props.attachment.get('blurhash') && this.props.attachment.get('blurhash')) {
      this._decode();
    }
  }

  _decode() {
    const hash = this.props.attachment.get('blurhash');
    const pixels = decode(hash, 32, 32);

    if (pixels && this.canvas) {
      const ctx = this.canvas.getContext('2d');
      const imageData = new ImageData(pixels, 32, 32);

      ctx.putImageData(imageData, 0, 0);
    }
  }

  setCanvasRef = c => {
    this.canvas = c;
  }

  handleImageLoad = () => {
    this.setState({ loaded: true });
  }

  render() {
    const { attachment, index, size, standalone, displayWidth, visible, dimensions } = this.props;

    const ar = attachment.getIn(['meta', 'small', 'aspect']);

    let width = 100;
    let height = '100%';
    let top = '0';
    let left = 'auto';
    let bottom = '0';
    let right = 'auto';
    let float = 'left';
    let position = 'relative';
    let borderRadius = '0 0 0 0';

    if (dimensions) {
      width = dimensions.w;
      height = dimensions.h;
      top = dimensions.t || '0';
      right = dimensions.r || 'auto';
      bottom = dimensions.b || '0';
      left = dimensions.l || 'auto';
      float = dimensions.float || 'left';
      position = dimensions.pos || 'relative';

      const br = dimensions.br || []
      const hasTL = br.indexOf('tl') > -1
      const hasTR = br.indexOf('tr') > -1
      const hasBR = br.indexOf('br') > -1
      const hasBL = br.indexOf('bl') > -1
      borderRadius = `${hasTL ? '8px' : '0'} ${hasTR ? '8px' : '0'} ${hasBR ? '8px' : '0'} ${hasBL ? '8px' : '0'}`
    }

    let thumbnail = '';

    if (attachment.get('type') === 'unknown') {
      return (
        <div className={[_s.default, _s.posAbs].join(' ')} key={attachment.get('id')} style={{ position, float, left, top, right, bottom, height, borderRadius, width: `${width}%` }}>
          <a className={[_s.default, _s.heigh100PC, _s.width100PC, _s.cursorPointer].join(' ')} href={attachment.get('remote_url')} target='_blank' rel='noreferrer noopener'>
            <canvas width={32} height={32} ref={this.setCanvasRef} className={[_s.default, _s.heigh100PC, _s.width100PC].join(' ')} />
          </a>
        </div>
      )
    } else if (attachment.get('type') === 'image') {
      const previewUrl = attachment.get('preview_url');
      const previewWidth = attachment.getIn(['meta', 'small', 'width']);

      const originalUrl = attachment.get('url');
      const originalWidth = attachment.getIn(['meta', 'original', 'width']);

      const hasSize = typeof originalWidth === 'number' && typeof previewWidth === 'number';

      const srcSet = hasSize ? `${originalUrl} ${originalWidth}w, ${previewUrl} ${previewWidth}w` : null;
      const sizes = hasSize && (displayWidth > 0) ? `${displayWidth * (width / 100)}px` : null;

      const focusX = attachment.getIn(['meta', 'focus', 'x']) || 0;
      const focusY = attachment.getIn(['meta', 'focus', 'y']) || 0;
      const x = ((focusX / 2) + .5) * 100;
      const y = ((focusY / -2) + .5) * 100;

      thumbnail = (
        <a
          className={[_s.default, _s.overflowHidden, _s.height100PC, _s.width100PC, _s.cursorPointer].join(' ')}
          href={attachment.get('remote_url') || originalUrl}
          onClick={this.handleClick}
          target='_blank'
          style={{ borderRadius }}
        >
          <img
            src={previewUrl}
            srcSet={srcSet}
            sizes={sizes}
            className={[_s.height100PC, _s.width100PC, _s.objectFitCover].join(' ')}
            alt={attachment.get('description')}
            title={attachment.get('description')}
            style={{ objectPosition: `${x}% ${y}%` }}
            onLoad={this.handleImageLoad}
          />
        </a>
      );
    } else if (attachment.get('type') === 'gifv') {
      const autoPlay = !isIOS() && autoPlayGif !== false;

      thumbnail = (
        <div className={[_s.default, _s.overflowHidden, _s.heigh100PC, _s.width100PC].join(' ')}>
          <video
            className={[_s.default, _s.cursorPointer, _s.objectFitCover, _s.width100PC, _s.height100PC, _s.z1].join(' ')}
            aria-label={attachment.get('description')}
            title={attachment.get('description')}
            role='application'
            src={attachment.get('url')}
            onClick={this.handleClick}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            onLoadedMetadata={this.handleLoadedMetaData}
            autoPlay={autoPlay}
            type='video/mp4'
            loop
            muted
            playsInline
          />

          <div className={[_s.default, _s.posAbs, _s.z2, _s.radiusSmall, _s.bgBlackOpaque, _s.px5, _s.py5, _s.mr10, _s.mb10, _s.bottom0, _s.right0].join(' ')}>
            <Text size='extraSmall' color='white' weight='medium'>GIF</Text>
          </div>
        </div>
      );
    }

    return (
      <div className={[_s.defeault, _s.posAbs].join(' ')} key={attachment.get('id')} style={{ position, float, left, top, right, bottom, height, width: `${width}%` }}>
        {
          !visible && !this.state.loaded &&
          <canvas width={32} height={32} ref={this.setCanvasRef} className={[_s.default, _s.heigh100PC, _s.width100PC].join(' ')} />
        }
        {visible && thumbnail}
      </div>
    );
  }

}

export default
@injectIntl
class MediaGallery extends PureComponent {

  static propTypes = {
    sensitive: PropTypes.bool,
    standalone: PropTypes.bool,
    media: ImmutablePropTypes.list.isRequired,
    size: PropTypes.object,
    height: PropTypes.number.isRequired,
    onOpenMedia: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    defaultWidth: PropTypes.number,
    cacheWidth: PropTypes.func,
    visible: PropTypes.bool,
    onToggleVisibility: PropTypes.func,
    reduced: PropTypes.bool,
    isComment: PropTypes.bool,
  };

  static defaultProps = {
    standalone: false,
    height: 110,
  };

  state = {
    visible: this.props.visible !== undefined ? this.props.visible : (displayMedia !== 'hide_all' && !this.props.sensitive || displayMedia === 'show_all'),
    width: this.props.defaultWidth,
  };

  componentWillReceiveProps(nextProps) {
    if (!is(nextProps.media, this.props.media) && nextProps.visible === undefined) {
      this.setState({
        visible: displayMedia !== 'hide_all' && !nextProps.sensitive || displayMedia === 'show_all',
      })
    } else if (!is(nextProps.visible, this.props.visible) && nextProps.visible !== undefined) {
      this.setState({ visible: nextProps.visible });
    }
  }

  handleOpen = () => {
    if (this.props.onToggleVisibility) {
      this.props.onToggleVisibility();
    } else {
      this.setState({ visible: !this.state.visible });
    }
  }

  handleClick = (index) => {
    this.props.onOpenMedia(this.props.media, index);
  }

  handleRef = (node) => {
    if (node) {
      // offsetWidth triggers a layout, so only calculate when we need to
      if (this.props.cacheWidth) this.props.cacheWidth(node.offsetWidth);

      this.setState({
        width: node.offsetWidth,
      });
    }
  }

  render() {
    const {
      media,
      intl,
      sensitive,
      height,
      defaultWidth,
      reduced,
    } = this.props
    const { visible } = this.state

    let width = this.state.width || defaultWidth
    if (reduced) width = width / 2

    const style = {}
    const size = media.take(4).size

    const standard169 = width / (16 / 9);
    const standard169_percent = 100 / (16 / 9);
    const standard169_px = `${standard169}px`;
    const panoSize = Math.floor(width / maximumAspectRatio);
    const panoSize_px = `${Math.floor(width / maximumAspectRatio)}px`;
    let itemsDimensions = [];

    if (size === 1 && width && visible) {
      const aspectRatio = media.getIn([0, 'meta', 'small', 'aspect']);

      if (isPanoramic(aspectRatio)) {
        style.height = Math.floor(width / maximumAspectRatio);
      } else if (isPortrait(aspectRatio)) {
        style.height = Math.floor(width / minimumAspectRatio);
      } else {
        style.height = Math.floor(width / aspectRatio);
      }
    } else if (size > 1 && width && visible) {
      const ar1 = media.getIn([0, 'meta', 'small', 'aspect']);
      const ar2 = media.getIn([1, 'meta', 'small', 'aspect']);
      const ar3 = media.getIn([2, 'meta', 'small', 'aspect']);
      const ar4 = media.getIn([3, 'meta', 'small', 'aspect']);

      if (size === 2) {
        if (isPortrait(ar1) && isPortrait(ar2)) {
          style.height = width - (width / maximumAspectRatio);
        } else if (isPanoramic(ar1) && isPanoramic(ar2)) {
          style.height = panoSize * 2;
        } else if (
          (isPanoramic(ar1) && isPortrait(ar2)) ||
          (isPortrait(ar1) && isPanoramic(ar2)) ||
          (isPanoramic(ar1) && isNonConformingRatio(ar2)) ||
          (isNonConformingRatio(ar1) && isPanoramic(ar2))
        ) {
          style.height = (width * 0.6) + (width / maximumAspectRatio);
        } else {
          style.height = width / 2;
        }

        //

        if (isPortrait(ar1) && isPortrait(ar2)) {
          itemsDimensions = [
            { w: 50, h: '100%', r: '2px', br: ['tl', 'bl'] },
            { w: 50, h: '100%', l: '2px', br: ['tr', 'br'] },
          ];
        } else if (isPanoramic(ar1) && isPanoramic(ar2)) {
          itemsDimensions = [
            { w: 100, h: panoSize_px, b: '2px', br: ['tl', 'tr'] },
            { w: 100, h: panoSize_px, t: '2px', br: ['bl', 'br'] },
          ];
        } else if (
          (isPanoramic(ar1) && isPortrait(ar2)) ||
          (isPanoramic(ar1) && isNonConformingRatio(ar2))
        ) {
          itemsDimensions = [
            { w: 100, h: `${(width / maximumAspectRatio)}px`, b: '2px', br: ['tl', 'tr'] },
            { w: 100, h: `${(width * 0.6)}px`, t: '2px', br: ['bl', 'br'] },
          ];
        } else if (
          (isPortrait(ar1) && isPanoramic(ar2)) ||
          (isNonConformingRatio(ar1) && isPanoramic(ar2))
        ) {
          itemsDimensions = [
            { w: 100, h: `${(width * 0.6)}px`, b: '2px', br: ['tl', 'tr'] },
            { w: 100, h: `${(width / maximumAspectRatio)}px`, t: '2px', br: ['bl', 'br'] },
          ];
        } else {
          itemsDimensions = [
            { w: 50, h: '100%', r: '2px', br: ['tl', 'bl'] },
            { w: 50, h: '100%', l: '2px', br: ['tr', 'br'] },
          ];
        }
      } else if (size === 3) {
        if (isPanoramic(ar1) && isPanoramic(ar2) && isPanoramic(ar3)) {
          style.height = panoSize * 3;
        } else if (isPortrait(ar1) && isPortrait(ar2) && isPortrait(ar3)) {
          style.height = Math.floor(width / minimumAspectRatio);
        } else {
          style.height = width;
        }

        //

        if (isPanoramic(ar1) && isNonConformingRatio(ar2) && isNonConformingRatio(ar3)) {
          itemsDimensions = [
            { w: 100, h: '50%', b: '2px', br: ['tl', 'tr'] },
            { w: 50, h: '50%', t: '2px', r: '2px', br: ['bl'] },
            { w: 50, h: '50%', t: '2px', l: '2px', br: ['br'] },
          ];
        } else if (isPanoramic(ar1) && isPanoramic(ar2) && isPanoramic(ar3)) {
          itemsDimensions = [
            { w: 100, h: panoSize_px, b: '4px', br: ['tl', 'tr'] },
            { w: 100, h: panoSize_px },
            { w: 100, h: panoSize_px, t: '4px', br: ['bl', 'br'] },
          ];
        } else if (isPortrait(ar1) && isNonConformingRatio(ar2) && isNonConformingRatio(ar3)) {
          itemsDimensions = [
            { w: 50, h: '100%', r: '2px', br: ['tl', 'bl'] },
            { w: 50, h: '50%', b: '2px', l: '2px', br: ['tr'] },
            { w: 50, h: '50%', t: '2px', l: '2px', br: ['br'] },
          ];
        } else if (isNonConformingRatio(ar1) && isNonConformingRatio(ar2) && isPortrait(ar3)) {
          itemsDimensions = [
            { w: 50, h: '50%', b: '2px', r: '2px', br: ['tl'] },
            { w: 50, h: '50%', l: '-2px', b: '-2px', pos: 'absolute', float: 'none', br: ['bl'] },
            { w: 50, h: '100%', r: '-2px', t: '0px', b: '0px', pos: 'absolute', float: 'none', br: ['tr', 'br'] },
          ];
        } else if (
          (isNonConformingRatio(ar1) && isPortrait(ar2) && isNonConformingRatio(ar3)) ||
          (isPortrait(ar1) && isPortrait(ar2) && isPortrait(ar3))
        ) {
          itemsDimensions = [
            { w: 50, h: '50%', b: '2px', r: '2px', br: ['tl'] },
            { w: 50, h: '100%', l: '2px', float: 'right', br: ['tr', 'br'] },
            { w: 50, h: '50%', t: '2px', r: '2px', br: ['bl'] },
          ];
        } else if (
          (isPanoramic(ar1) && isPanoramic(ar2) && isNonConformingRatio(ar3)) ||
          (isPanoramic(ar1) && isPanoramic(ar2) && isPortrait(ar3))
        ) {
          itemsDimensions = [
            { w: 50, h: panoSize_px, b: '2px', r: '2px', br: ['tl'] },
            { w: 50, h: panoSize_px, b: '2px', l: '2px', br: ['tr'] },
            { w: 100, h: `${width - panoSize}px`, t: '2px', br: ['bl', 'br'] },
          ];
        } else if (
          (isNonConformingRatio(ar1) && isPanoramic(ar2) && isPanoramic(ar3)) ||
          (isPortrait(ar1) && isPanoramic(ar2) && isPanoramic(ar3))
        ) {
          itemsDimensions = [
            { w: 100, h: `${width - panoSize}px`, b: '2px', br: ['tl', 'tr'] },
            { w: 50, h: panoSize_px, t: '2px', r: '2px', br: ['bl'] },
            { w: 50, h: panoSize_px, t: '2px', l: '2px', br: ['br'] },
          ];
        } else {
          itemsDimensions = [
            { w: 50, h: '50%', b: '2px', r: '2px', br: ['tl'] },
            { w: 50, h: '50%', b: '2px', l: '2px', br: ['tr'] },
            { w: 100, h: '50%', t: '2px', br: ['bl', 'br'] },
          ];
        }
      } else if (size === 4) {
        if (
          (isPortrait(ar1) && isPortrait(ar2) && isPortrait(ar3) && isPortrait(ar4)) ||
          (isPortrait(ar1) && isPortrait(ar2) && isPortrait(ar3) && isNonConformingRatio(ar4)) ||
          (isPortrait(ar1) && isPortrait(ar2) && isNonConformingRatio(ar3) && isPortrait(ar4)) ||
          (isPortrait(ar1) && isNonConformingRatio(ar2) && isPortrait(ar3) && isPortrait(ar4)) ||
          (isNonConformingRatio(ar1) && isPortrait(ar2) && isPortrait(ar3) && isPortrait(ar4))
        ) {
          style.height = Math.floor(width / minimumAspectRatio);
        } else if (isPanoramic(ar1) && isPanoramic(ar2) && isPanoramic(ar3) && isPanoramic(ar4)) {
          style.height = panoSize * 2;
        } else if (
          (isPanoramic(ar1) && isPanoramic(ar2) && isNonConformingRatio(ar3) && isNonConformingRatio(ar4)) ||
          (isNonConformingRatio(ar1) && isNonConformingRatio(ar2) && isPanoramic(ar3) && isPanoramic(ar4))
        ) {
          style.height = panoSize + (width / 2);
        } else {
          style.height = width;
        }

        //

        if (isPanoramic(ar1) && isPanoramic(ar2) && isNonConformingRatio(ar3) && isNonConformingRatio(ar4)) {
          itemsDimensions = [
            { w: 50, h: panoSize_px, b: '2px', r: '2px' },
            { w: 50, h: panoSize_px, b: '2px', l: '2px' },
            { w: 50, h: `${(width / 2)}px`, t: '2px', r: '2px' },
            { w: 50, h: `${(width / 2)}px`, t: '2px', l: '2px' },
          ];
        } else if (isNonConformingRatio(ar1) && isNonConformingRatio(ar2) && isPanoramic(ar3) && isPanoramic(ar4)) {
          itemsDimensions = [
            { w: 50, h: `${(width / 2)}px`, b: '2px', r: '2px' },
            { w: 50, h: `${(width / 2)}px`, b: '2px', l: '2px' },
            { w: 50, h: panoSize_px, t: '2px', r: '2px' },
            { w: 50, h: panoSize_px, t: '2px', l: '2px' },
          ];
        } else if (
          (isPortrait(ar1) && isNonConformingRatio(ar2) && isNonConformingRatio(ar3) && isNonConformingRatio(ar4)) ||
          (isPortrait(ar1) && isPanoramic(ar2) && isPanoramic(ar3) && isPanoramic(ar4))
        ) {
          itemsDimensions = [
            { w: 67, h: '100%', r: '2px' },
            { w: 33, h: '33%', b: '4px', l: '2px' },
            { w: 33, h: '33%', l: '2px' },
            { w: 33, h: '33%', t: '4px', l: '2px' },
          ];
        } else {
          itemsDimensions = [
            { w: 50, h: '50%', b: '2px', r: '2px' },
            { w: 50, h: '50%', b: '2px', l: '2px' },
            { w: 50, h: '50%', t: '2px', r: '2px' },
            { w: 50, h: '50%', t: '2px', l: '2px' },
          ];
        }
      }
    } else {
      style.height = height;
    }

    //If reduced (i.e. like in a quoted post)
    //then we need to make media smaller
    // if (reduced) {
    //   style.height = width / 2 || '50%'
    // }

    if (!visible) {
      style.height = 'auto'
    }

    const children = media.take(4).map((attachment, i) => (
      <Item
        key={attachment.get('id')}
        onClick={this.handleClick}
        attachment={attachment}
        index={i}
        size={size}
        displayWidth={width}
        visible={visible}
        dimensions={itemsDimensions[i]}
      />
    ))

    const containerClasses = cx({
      default: 1,
      displayBlock: 1,
      overflowHidden: 1,
      borderColorSecondary: size === 1 && visible,
      borderTop1PX: size === 1 && visible,
      borderBottom1PX: size === 1 && visible,
      px5: size > 1 && visible,
    })

    return (
      <div
        className={containerClasses}
        style={style}
        ref={this.handleRef}
      >

        {
          !visible && sensitive &&
          <SensitiveMediaItem onClick={this.handleOpen} />
        }

        {
          visible &&
          <div className={[_s.default, _s.displayBlock, _s.width100PC, _s.height100PC, _s.overflowHidden].join(' ')}>
            {children}
          </div>
        }

        {
          visible && sensitive &&
          <div className={[_s.posAbs, _s.z2, _s.top0, _s.right0, _s.mt10, _s.mr10].join(' ')}>
            <Button
              title={intl.formatMessage(messages.toggle_visible)}
              icon='hidden'
              backgroundColor='black'
              className={[_s.px10, _s.bgBlackOpaque_onHover].join(' ')}
              onClick={this.handleOpen}
            />
          </div>
        }
      </div>
    );
  }

}
