import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import { is } from 'immutable'
import throttle from 'lodash.throttle'
import { decode } from 'blurhash'
import { isFullscreen, requestFullscreen, exitFullscreen } from '../utils/fullscreen'
import { isPanoramic, isPortrait, minimumAspectRatio, maximumAspectRatio } from '../utils/media_aspect_ratio'
import {
  openPopover,
} from '../actions/popover'
import { displayMedia } from '../initial_state'
import {
  CX,
  POPOVER_VIDEO_STATS,
  BREAKPOINT_EXTRA_SMALL,
} from '../constants'
import Responsive from '../features/ui/util/responsive_component'
import Button from './button'
import Icon from './icon'
import SensitiveMediaItem from './sensitive_media_item'
import Text from './text'

// check every 50 ms for buffer
const checkInterval  = 50
const FIXED_VAR = 6

const messages = defineMessages({
  play: { id: 'video.play', defaultMessage: 'Play' },
  pause: { id: 'video.pause', defaultMessage: 'Pause' },
  mute: { id: 'video.mute', defaultMessage: 'Mute sound' },
  unmute: { id: 'video.unmute', defaultMessage: 'Unmute sound' },
  hide: { id: 'video.hide', defaultMessage: 'Hide video' },
  fullscreen: { id: 'video.fullscreen', defaultMessage: 'Full screen' },
  exit_fullscreen: { id: 'video.exit_fullscreen', defaultMessage: 'Exit full screen' },
  sensitive: { id: 'status.sensitive_warning', defaultMessage: 'Sensitive content' },
  hidden: { id: 'status.media_hidden', defaultMessage: 'Media hidden' },
  video_stats: { id: 'video.stats_label', defaultMessage: 'Video meta stats' },
  toggle_visible: { id: 'media_gallery.toggle_visible', defaultMessage: 'Hide media' },
})

const formatTime = (secondsNum) => {
  let hours = Math.floor(secondsNum / 3600)
  let minutes = Math.floor((secondsNum - (hours * 3600)) / 60)
  let seconds = Math.floor(secondsNum) - (hours * 3600) - (minutes * 60)

  if (hours < 10) hours = '0' + hours
  if (minutes < 10) minutes = '0' + minutes
  if (seconds < 10) seconds = '0' + seconds

  return (hours === '00' ? '' : `${hours}:`) + `${minutes}:${seconds}`
}

export const findElementPosition = (el) => {
  let box

  if (el.getBoundingClientRect && el.parentNode) {
    box = el.getBoundingClientRect()
  }

  if (!box) {
    return {
      left: 0,
      top: 0,
    }
  }

  const docEl = document.documentElement
  const body = document.body

  const clientLeft = docEl.clientLeft || body.clientLeft || 0
  const scrollLeft = window.pageXOffset || body.scrollLeft
  const left = (box.left + scrollLeft) - clientLeft

  const clientTop = docEl.clientTop || body.clientTop || 0
  const scrollTop = window.pageYOffset || body.scrollTop
  const top = (box.top + scrollTop) - clientTop

  return {
    left: Math.round(left),
    top: Math.round(top),
  }
}

export const getPointerPosition = (el, event) => {
  const position = {}
  const box = findElementPosition(el)
  const boxW = el.offsetWidth
  const boxH = el.offsetHeight
  const boxY = box.top
  const boxX = box.left

  let pageY = event.pageY
  let pageX = event.pageX

  if (event.changedTouches) {
    pageX = event.changedTouches[0].pageX
    pageY = event.changedTouches[0].pageY
  }

  position.y = Math.max(0, Math.min(1, (pageY - boxY) / boxH))
  position.x = Math.max(0, Math.min(1, (pageX - boxX) / boxW))

  return position
}

const mapDispatchToProps = (dispatch) => ({
  onOpenVideoStatsPopover(targetRef, meta) {
    dispatch(openPopover(POPOVER_VIDEO_STATS, {
      targetRef,
      meta,
      position: 'top',
    }))
  }
})

export default
@injectIntl
@connect(null, mapDispatchToProps)
class Video extends ImmutablePureComponent {

  static propTypes = {
    preview: PropTypes.string,
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    sensitive: PropTypes.bool,
    startTime: PropTypes.number,
    detailed: PropTypes.bool,
    inline: PropTypes.bool,
    cacheWidth: PropTypes.func,
    visible: PropTypes.bool,
    onToggleVisibility: PropTypes.func,
    intl: PropTypes.object.isRequired,
    blurhash: PropTypes.string,
    aspectRatio: PropTypes.number,
    meta: ImmutablePropTypes.map,
    onOpenVideoStatsPopover: PropTypes.func.isRequired,
  }

  state = {
    currentTime: 0,
    duration: 0,
    volume: 0.5,
    paused: true,
    dragging: false,
    draggingVolume: false,
    containerWidth: this.props.width,
    fullscreen: false,
    hovered: false,
    muted: false,
    hoveringVolumeButton: false,
    hoveringVolumeControl: false,
    revealed: this.props.visible !== undefined ? this.props.visible : (displayMedia !== 'hide_all' && !this.props.sensitive || displayMedia === 'show_all'),
    pipAvailable: true,
    isBuffering: false,
  }

  bufferCheckInterval = null
  lastPlayPos = 0
  volHeight = 100
  volOffset = 13

  componentDidMount() {
    const { meta, blurhash } = this.props

    document.addEventListener('fullscreenchange', this.handleFullscreenChange, true)
    document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange, true)
    document.addEventListener('mozfullscreenchange', this.handleFullscreenChange, true)
    document.addEventListener('MSFullscreenChange', this.handleFullscreenChange, true)

    if (meta) {
      this.setState({ duration: parseInt(meta.get('duration')) })
    }

    if ('pictureInPictureEnabled' in document) {
      this.setState({ pipAvailable: true })
    }
  }

  componentWillUnmount() {
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange, true)
    document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange, true)
    document.removeEventListener('mozfullscreenchange', this.handleFullscreenChange, true)
    document.removeEventListener('MSFullscreenChange', this.handleFullscreenChange, true)
    
    clearInterval(this.bufferCheckInterval)
  }

  componentWillReceiveProps(nextProps) {
    if (!is(nextProps.visible, this.props.visible) && nextProps.visible !== undefined) {
      this.setState({ revealed: nextProps.visible })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.revealed && !this.state.revealed && this.video) {
      this.video.pause()
    }
  }

  checkBuffering = () => {
    const { isBuffering, paused } = this.state
    if (!this.video) {
      this.handlePause()
      return
    }
    const { currentTime } = this.video

    // Checking offset should be at most the check interval but allow for some margin
    let offset = (checkInterval - 30) / 1000

    if (!isBuffering && currentTime < (this.lastPlayPos + offset) && !paused) {
      // If no buffering is currently detected, and the position does not seem to increase
      // and the player isn't manually paused...
      this.setState({ isBuffering: true })
    } else if (isBuffering && currentTime > (this.lastPlayPos + offset) && !paused) {
      // If we were buffering but the player has advanced, then there is no buffering
      this.setState({ isBuffering: false })
    }

    this.lastPlayPos = currentTime
  }

  volHandleOffset = (v) => {
    const offset = v * this.volHeight + this.volOffset
    return (offset > 110) ? 110 : offset
  }

  setPlayerRef = (n) => {
    this.player = n

    if (n) {
      if (this.props.cacheWidth) this.props.cacheWidth(this.player.offsetWidth)
      this.setState({
        containerWidth: n.offsetWidth,
      })
    }
  }

  setVideoRef = (n) => {
    this.video = n

    if (this.video) {
      const { volume, muted } = this.video
      this.setState({
        volume,
        muted,
      })
    }
  }

  setSeekRef = (n) => {
    this.seek = n
  }

  setVolumeRef = (n) => {
    this.volume = n
  }

  setSettingsBtnRef = (n) => {
    this.settingsBtn = n
  }

  handleClickRoot = (e) => e.stopPropagation()

  handlePlay = () => {
    this.setState({ paused: false })

    this.bufferCheckInterval = setInterval(this.checkBuffering, checkInterval)
  }

  handlePause = () => {
    this.setState({
      paused: true,
      isBuffering: false,
    })

    clearInterval(this.bufferCheckInterval)
  }

  handleTimeUpdate = () => {
    const { currentTime, duration } = this.video
    this.setState({
      currentTime: currentTime.toFixed(FIXED_VAR),
      duration: duration.toFixed(FIXED_VAR),
    })
  }

  handleVolumeMouseDown = (e) => {
    document.addEventListener('mousemove', this.handleMouseVolSlide, true)
    document.addEventListener('mouseup', this.handleVolumeMouseUp, true)
    document.addEventListener('touchmove', this.handleMouseVolSlide, true)
    document.addEventListener('touchend', this.handleVolumeMouseUp, true)

    this.handleMouseVolSlide(e)

    e.preventDefault()
    e.stopPropagation()

    this.setState({ draggingVolume: true })
  }

  handleVolumeMouseUp = () => {
    this.handleMouseLeaveVolumeControl()

    document.removeEventListener('mousemove', this.handleMouseVolSlide, true)
    document.removeEventListener('mouseup', this.handleVolumeMouseUp, true)
    document.removeEventListener('touchmove', this.handleMouseVolSlide, true)
    document.removeEventListener('touchend', this.handleVolumeMouseUp, true)

    this.setState({ draggingVolume: false })
  }

  handleMouseVolSlide = throttle((e) => {
    const rect = this.volume.getBoundingClientRect()
    const y = 1 - ((e.clientY - rect.top) / this.volHeight)

    if (!isNaN(y)) {
      const slideamt = y
      if (y > 1) {
        slideamt = 1
      } else if (y < 0) {
        slideamt = 0
      }
      this.video.volume = slideamt
      this.setState({ volume: slideamt })
    }
  }, 60)

  handleMouseDown = (e) => {
    document.addEventListener('mousemove', this.handleMouseMove, true)
    document.addEventListener('mouseup', this.handleMouseUp, true)
    document.addEventListener('touchmove', this.handleMouseMove, true)
    document.addEventListener('touchend', this.handleMouseUp, true)

    this.setState({ dragging: true })
    this.video.pause()
    this.handleMouseMove(e)

    e.preventDefault()
    e.stopPropagation()
  }

  handleMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseMove, true)
    document.removeEventListener('mouseup', this.handleMouseUp, true)
    document.removeEventListener('touchmove', this.handleMouseMove, true)
    document.removeEventListener('touchend', this.handleMouseUp, true)

    this.setState({ dragging: false })
    this.video.play()
  }

  handleMouseMove = throttle(e => {
    const { x } = getPointerPosition(this.seek, e)
    const currentTime = parseFloat(this.video.duration * x).toFixed(FIXED_VAR)

    if (!isNaN(currentTime)) {
      this.video.currentTime = currentTime
      this.setState({ currentTime })
    }
  }, 60)

  togglePlay = () => {
    if (this.state.paused) {
      this.video.play()
    } else {
      this.video.pause()
    }
  }

  toggleFullscreen = () => {
    if (isFullscreen()) {
      exitFullscreen()
    } else {
      requestFullscreen(this.player)
    }
  }
  
  togglePip = () => {
    try {
      if (this.video !== document.pictureInPictureElement) {
        if (this.state.paused) {
          this.video.play()
        }
        setTimeout(() => { // : hack :
          this.video.requestPictureInPicture()          
        }, 500)
      } else {
        document.exitPictureInPicture()
      }
    } catch(e) {
      //
    }
  }

  handleFullscreenChange = () => {
    this.setState({ fullscreen: isFullscreen() })
  }

  handleMouseEnter = () => {
    this.setState({ hovered: true })
  }

  handleMouseLeave = () => {
    this.setState({ hovered: false })
  }

  handleMouseEnterAudio = () => {
    this.setState({ hoveringVolumeButton: true })
  }

  handleMouseLeaveAudio = throttle(() => {
    this.setState({ hoveringVolumeButton: false })
  }, 2500)

  handleMouseEnterVolumeControl = () => {
    this.setState({ hoveringVolumeControl: true })
  }

  handleMouseLeaveVolumeControl = throttle(() => {
    if (!this.state.draggingVolume) {
      this.setState({ hoveringVolumeControl: false })
    }
  }, 2500)

  toggleMute = () => {
    this.video.muted = !this.video.muted
    this.setState({ muted: this.video.muted })
  }

  toggleReveal = () => {
    if (this.props.onToggleVisibility) {
      this.props.onToggleVisibility()
    } else {
      this.setState({ revealed: !this.state.revealed })
    }
  }

  handleLoadedData = () => {
    if (this.props.startTime) {
      this.video.currentTime = this.props.startTime
      this.video.play()
    }
  }

  handleProgress = () => {
    const { buffered, duration } = this.video

    if (!buffered) return
    if (buffered.length > 0) {
      this.setState({
        buffer: buffered.end(0) / duration * 100,
      })
    }
  }

  handleVolumeChange = () => {
    const { volume, muted } = this.video
    this.setState({
      volume,
      muted,
    })
  }

  handleOnClickSettings = () => {
    this.props.onOpenVideoStatsPopover(this.settingsBtn, this.props.meta)
  }

  render() {
    const {
      preview,
      src,
      inline,
      startTime,
      intl,
      alt,
      detailed,
      sensitive,
      aspectRatio,
    } = this.props

    const {
      containerWidth,
      currentTime,
      duration,
      volume,
      buffer,
      dragging,
      paused,
      fullscreen,
      hovered,
      muted,
      revealed,
      hoveringVolumeButton,
      hoveringVolumeControl,
      pipAvailable,
      isBuffering,
    } = this.state

    const progress = (currentTime / duration) * 100

    const volumeHeight = (muted) ? 0 : volume * this.volHeight
    const volumeHandleLoc = (muted) ? this.volHandleOffset(0) : this.volHandleOffset(volume)
    const playerStyle = {}

    let { width, height } = this.props

    if (inline && containerWidth) {
      width = containerWidth
      const minSize = containerWidth / (16 / 9)

      if (isPanoramic(aspectRatio)) {
        height = Math.max(Math.floor(containerWidth / maximumAspectRatio), minSize)
      } else if (isPortrait(aspectRatio)) {
        height = Math.max(Math.floor(containerWidth / minimumAspectRatio), minSize)
      } else {
        height = Math.floor(containerWidth / aspectRatio)
      }

      playerStyle.height = height
    }

    let preload

    if (startTime || fullscreen || dragging) {
      preload = 'auto'
    } else if (detailed) {
      preload = 'metadata'
    } else {
      preload = 'none'
    }

    // className={classNames('video-player', {
    //   inactive: !revealed,
    //   detailed,
    //   inline: inline && !fullscreen,
    //   fullscreen
    // })}

    // : todo spoiler :

    const mainContainerClasses = CX({
      default: 1,
      mt10: 1,
      outlineNone: 1,
    })

    const seekHandleClasses = CX({
      default: 1,
      posAbs: 1,
      circle: 1,
      height20PX: 1,
      width20PX: 1,
      bgTransparent: 1,
      mlNeg5PX: 1,
      mr5: 1,
      z3: 1,
      alignItemsCenter: 1,
      justifyContentCenter: 1,
      videoEase: 1,
      opacity0: !dragging,
      opacity1: dragging || hovered,
    })

    const seekInnerHandleClasses = CX({
      default: 1,
      circle: 1,
      height14PX: 1,
      width14PX: 1,
      bgBrand: 1,
      boxShadow1: 1,
    })

    const progressClasses = CX({
      default: 1,
      radiusSmall: 1,
      mt10: 1,
      posAbs: 1,
      height4PX: 1,
      videoEase: 1,
    })

    const volumeControlClasses = CX({
      default: 1,
      posAbs: 1,
      bgBlackOpaque: 1,
      videoPlayerVolume: 1,
      height122PX: 1,
      circle: 1,
      displayNone: !hoveringVolumeButton && !hoveringVolumeControl || !hovered,
    })

    const videoControlsBackgroundClasses = CX({
      default: 1,
      z2: 1,
      px15: 1,
      videoPlayerControlsBackground: 1,
      posAbs: 1,
      bottom0: 1,
      right0: 1,
      left0: 1,
      displayNone: !hovered && !paused,
    })

    const overlayClasses = CX({
      default: 1,
      top50PC: 1,
      left50PC: 1,
      posAbs: 1,
      z2: 1,
      alignItemsCenter: 1,
      justifyContentCenter: 1,
      displayNone: !paused,
    })

    if (!revealed && sensitive) {
      return <SensitiveMediaItem onClick={this.toggleReveal} />
    }

    return (
      <div
        className={mainContainerClasses}
        style={playerStyle}
        ref={this.setPlayerRef}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClickRoot}
        tabIndex={0}
      >

        <div className={overlayClasses}>
          {
            paused && !isBuffering &&
            <Responsive min={BREAKPOINT_EXTRA_SMALL}>
              <button
                onClick={this.togglePlay}
                className={[_s.default, _s.outlineNone, _s.cursorPointer, _s.alignItemsCenter, _s.justifyContentCenter, _s.posAbs, _s.bgBlackOpaque, _s.circle, _s.height60PX, _s.width60PX].join(' ')}
              >
                <Icon id='play' size='24px' className={_s.fillWhite} />
              </button>
            </Responsive>
          }
          {
            !paused && isBuffering &&
            <Icon id='loading' size='40px' className={[_s.default, _s.posAbs].join(' ')} />
          }
        </div>

        <video
          className={[_s.default, _s.height100PC, _s.width100PC, _s.outlineNone].join(' ')}
          playsInline
          ref={this.setVideoRef}
          src={src}
          poster={preview}
          preload={preload}
          role='button'
          tabIndex='0'
          aria-label={alt}
          title={alt}
          width={width}
          height={height}
          volume={volume}
          onClick={this.togglePlay}
          onPlay={this.handlePlay}
          onPause={this.handlePause}
          onTimeUpdate={this.handleTimeUpdate}
          onLoadedData={this.handleLoadedData}
          onProgress={this.handleProgress}
          onVolumeChange={this.handleVolumeChange}
        />

        { /* <div className={classNames('spoiler-button', { 'spoiler-button--hidden': revealed })}>
          <button type='button' className='spoiler-button__overlay' onClick={this.toggleReveal}>
            <span className='spoiler-button__overlay__label'>
              {intl.formatMessage(sensitive ? messages.sensitive : messages.hidden)}
            </span>
          </button>
        </div> */ }

        <div
          className={volumeControlClasses}
          onMouseDown={this.handleVolumeMouseDown}
          onMouseEnter={this.handleMouseEnterVolumeControl}
          onMouseLeave={this.handleMouseLeaveVolumeControl}
          ref={this.setVolumeRef}
        >
          <div
            className={[_s.default, _s.radiusSmall, _s.my10, _s.posAbs, _s.width4PX, _s.ml10, _s.bgPrimaryOpaque].join(' ')}
            style={{
              height: '102px',
            }}
          />
          <div
            className={[_s.default, _s.radiusSmall, _s.my10, _s.bottom0, _s.posAbs, _s.width4PX, _s.ml10, _s.bgPrimary].join(' ')}
            style={{
              height: `${volumeHeight}px`
            }}
          />
          <span
            className={[_s.default, _s.cursorPointer, _s.posAbs, _s.circle, _s.px5, _s.boxShadow1, _s.mbNeg5PX, _s.py5, _s.bgPrimary, _s.z3].join(' ')}
            tabIndex='0'
            style={{
              marginLeft: '7px',
              bottom: `${volumeHandleLoc}px`,
            }}
          />
        </div>

        <div className={videoControlsBackgroundClasses}>

          <div
            className={[_s.default, _s.cursorPointer, _s.height22PX, _s.videoPlayerSeek].join(' ')}
            onMouseDown={this.handleMouseDown}
            ref={this.setSeekRef}
          >

            <div className={[progressClasses, _s.bgLoading, _s.width100PC].join(' ')} />
            <div className={[progressClasses, _s.bgSubtle].join(' ')} style={{ width: `${buffer}%` }} />
            <div className={[progressClasses, _s.bgBrand].join(' ')} style={{ width: `${progress}%` }} />

            <span
              className={seekHandleClasses}
              tabIndex='0'
              style={{
                left: `${progress}%`
              }}
            >
              <span className={seekInnerHandleClasses} />
            </span>
          </div>

          <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.pb5, _s.noSelect].join(' ')}>
            <Button
              isNarrow
              backgroundColor='none'
              aria-label={intl.formatMessage(paused ? messages.play : messages.pause)}
              onClick={this.togglePlay}
              icon={paused ? 'play' : 'pause'}
              title={paused ? 'Play' : 'Pause'}
              iconSize='16px'
              iconClassName={_s.fillWhite}
              className={_s.pl0}
            />

            <Button
              isNarrow
              backgroundColor='none'
              type='button'
              aria-label={intl.formatMessage(muted ? messages.unmute : messages.mute)}
              onClick={this.toggleMute}
              icon={muted ? 'audio-mute' : 'audio'}
              iconSize='24px'
              iconClassName={_s.fillWhite}
              className={[_s.px10, _s.mr10].join(' ')}
              title='Volume'
              onMouseEnter={this.handleMouseEnterAudio}
              onMouseLeave={this.handleMouseLeaveAudio}
            />
            
            <Text color='white' size='small'>
              {formatTime(currentTime)}
              &nbsp;/&nbsp;
              {formatTime(duration)}
            </Text>

            <div className={[_s.default, _s.mlAuto, _s.flexRow, _s.alignItemsCenter].join(' ')}>
              <Button
                isNarrow
                backgroundColor='none'
                aria-label={intl.formatMessage(messages.video_stats)}
                onClick={this.handleOnClickSettings}
                icon='cog'
                iconSize='20px'
                iconClassName={_s.fillWhite}
                className={[_s.px10, _s.pr0].join(' ')}
                buttonRef={this.setSettingsBtnRef}
                title='Video stats'
              />
              <Responsive min={BREAKPOINT_EXTRA_SMALL}>
                {
                  pipAvailable &&
                  <Button
                    isNarrow
                    backgroundColor='none'
                    aria-label={intl.formatMessage(fullscreen ? messages.exit_fullscreen : messages.fullscreen)}
                    onClick={this.togglePip}
                    icon='pip'
                    iconSize='20px'
                    iconClassName={_s.fillWhite}
                    className={[_s.px10, _s.pr0].join(' ')}
                    title='Picture in Picture'
                  />
                }
              </Responsive>
              <Button
                isNarrow
                backgroundColor='none'
                aria-label={intl.formatMessage(fullscreen ? messages.exit_fullscreen : messages.fullscreen)}
                onClick={this.toggleFullscreen}
                icon={fullscreen ? 'minimize-fullscreen' : 'fullscreen'}
                title={fullscreen ? 'Minimize fullscreen' : 'Fullscreen'}
                iconSize='20px'
                iconClassName={_s.fillWhite}
                className={[_s.px10, _s.pr0].join(' ')}
              />
            </div>
          </div>

        </div>

        {
          revealed && sensitive &&
          <div className={[_s.posAbs, _s.z2, _s.top0, _s.right0, _s.mt10, _s.mr10].join(' ')}>
            <Button
              title={intl.formatMessage(messages.toggle_visible)}
              icon='hidden'
              backgroundColor='black'
              className={[_s.px10, _s.bgBlackOpaque_onHover].join(' ')}
              onClick={this.toggleReveal}
            />
          </div>
        }
      </div>
    )
  }
}
