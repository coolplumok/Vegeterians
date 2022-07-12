import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { NavLink } from 'react-router-dom'
import { decode } from 'blurhash'
import { autoPlayGif, displayMedia } from '../initial_state'
import classNames from 'classnames/bind'
import Icon from './icon'
import Image from './image'
import Text from './text'

const cx = classNames.bind(_s)

export default class MediaItem extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    attachment: ImmutablePropTypes.map.isRequired,
    isSmall: PropTypes.bool,
  }

  state = {
    loaded: false,
    visible: displayMedia !== 'hide_all' && !this.props.attachment.getIn(['status', 'sensitive']) || displayMedia === 'show_all',
  }

  componentDidMount() {
    if (this.props.attachment.get('blurhash')) {
      this._decode()
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.attachment.get('blurhash') !== this.props.attachment.get('blurhash') && this.props.attachment.get('blurhash')) {
      this._decode()
    }
  }

  _decode() {
    const hash = this.props.attachment.get('blurhash')
    const pixels = decode(hash, 160, 160)

    if (pixels && this.canvas) {
      const ctx = this.canvas.getContext('2d')
      const imageData = new ImageData(pixels, 160, 160)

      ctx.putImageData(imageData, 0, 0)
    }
  }

  setCanvasRef = c => {
    this.canvas = c
  }

  handleImageLoad = () => {
    this.setState({ loaded: true })
  }

  hoverToPlay() {
    return !autoPlayGif && ['gifv', 'video'].indexOf(this.props.attachment.get('type')) !== -1
  }

  render() {
    const {
      account,
      attachment,
      isSmall,
    } = this.props
    const { visible, loaded } = this.state

    const status = attachment.get('status')
    const title = status.get('spoiler_text') || attachment.get('description')

    const attachmentType = attachment.get('type')
    let badge = null

    if (attachmentType === 'video') {
      const duration = attachment.getIn(['meta', 'duration'])
      badge = (duration / 60).toFixed(2)
    } else if (attachmentType === 'gifv') {
      badge = 'GIF'
    }

    const containerClasses = cx({
      default: 1,
      posAbs: 1,
      top0: 1,
      height100PC: 1,
      width100PC: 1,
      py2: !isSmall,
      px2: !isSmall,
    })

    const linkClasses = cx({
      default: 1,
      width100PC: 1,
      height100PC: 1,
      overflowHidden: 1,
      border1PX: 1,
      borderColorPrimary: 1,
    })

    const statusUrl = `/${account.getIn(['acct'])}/posts/${status.get('id')}`;

    return (
      <div className={[_s.default, _s.width25PC, _s.pt25PC].join(' ')}>
        <div className={containerClasses}>
          <NavLink
            to={statusUrl}
            title={title}
            className={linkClasses}
          >
            {
              (!loaded || !visible) &&
              <canvas
                height='100%'
                width='100%'
                ref={this.setCanvasRef}
                className={[_s.default, _s.width100PC, _s.height100PC, _s.z2].join(' ')}
              />
            }

            {
              visible &&
              <Image
                height='100%'
                src={attachment.get('preview_url')}
                alt={attachment.get('description')}
                title={attachment.get('description')}
                onLoad={this.handleImageLoad}
                className={_s.z1}
              />
            }

            <div className={[_s.default, _s.alignItemsCenter, _s.justifyContentCenter, _s.height100PC, _s.width100PC, _s.z3, _s.posAbs].join(' ')}>
              {
                !visible &&
                <Icon
                  id='hidden'
                  size='22px'
                  className={[_s.fillWhite].join('')}
                />
              }

              {
                !!badge &&
                <div className={[_s.default, _s.posAbs, _s.radiusSmall, _s.bgBlackOpaque, _s.px5, _s.py5, _s.mr5, _s.mt5, _s.mb5, _s.bottom0, _s.right0].join(' ')}>
                  <Text size='extraSmall' color='white'>
                    {badge}
                  </Text>
                </div>
              }

            </div>

          </NavLink>
        </div>
      </div>
    )
  }

}
