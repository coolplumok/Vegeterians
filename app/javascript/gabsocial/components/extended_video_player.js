export default class ExtendedVideoPlayer extends PureComponent {

  static propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    time: PropTypes.number,
    controls: PropTypes.bool.isRequired,
    muted: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
  }

  handleLoadedData = () => {
    if (this.props.time) {
      this.video.currentTime = this.props.time
    }
  }

  componentDidMount () {
    this.video.addEventListener('loadeddata', this.handleLoadedData)
  }

  componentWillUnmount () {
    this.video.removeEventListener('loadeddata', this.handleLoadedData)
  }

  setRef = (c) => {
    this.video = c
  }

  handleClick = e => {
    e.stopPropagation()
    const handler = this.props.onClick
    if (handler) handler()
  }

  render () {
    const { src, muted, controls, alt } = this.props

    return (
      <div className={[_s.default, _s.width100PC, _s.height100PC, _s.alignItemsCenter, _s.justifyContentCenter].join(' ')}>
        <video
          className={[_s.default, _s.maxWidth100PC, _s.heightMax100PC].join(' ')}
          playsInline
          ref={this.setRef}
          src={src}
          role='button'
          tabIndex='0'
          aria-label={alt}
          title={alt}
          muted={muted}
          controls={controls}
          loop={!controls}
          onClick={this.handleClick}
        />
      </div>
    )
  }

}
