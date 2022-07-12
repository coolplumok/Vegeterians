import classNames from 'classnames/bind'

const cx = classNames.bind(_s)

export default class Image extends PureComponent {

  static propTypes = {
    alt: PropTypes.string.isRequired,
    src: PropTypes.string,
    className: PropTypes.string,
    width: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    height: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    fit: PropTypes.oneOf(['contain', 'cover', 'tile', 'none']),
    nullable: PropTypes.bool,
    lazy: PropTypes.bool,
    imageRef: PropTypes.func,
  }

  static defaultProps = {
    width: '100%',
    fit: 'cover',
  }

  state = {
    error: false,
  }

  handleOnError = () => {
    this.setState({ error: true })
  }

  render() {
    const {
      alt,
      src,
      fit,
      className,
      nullable,
      lazy,
      imageRef,
      ...otherProps
    } = this.props
    const { error } = this.state

    const classes = cx(className, {
      default: 1,
      objectFitCover: !!src && fit === 'cover',
      bgSecondary: !src,
    })

    //If error and not our own image
    if (error && nullable) {
      return null
    }

    if (!src) {
      return (
        <div className={classes} />
      )
    }

    return (
      <img
        alt={alt}
        className={classes}
        {...otherProps}
        ref={imageRef}
        src={src}
        onError={this.handleOnError}
      />
    )
  }

}