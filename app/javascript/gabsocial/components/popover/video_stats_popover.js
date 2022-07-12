import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import { closePopover } from '../../actions/popover'
import { CX } from '../../constants'
import PopoverLayout from './popover_layout'
import Button from '../button'
import Text from '../text'

const messages = defineMessages({
  size: { id: 'size', defaultMessage: 'Size' },
  audio_bitrate: { id: 'video.audio_bitrate', defaultMessage: 'Audio Bitrate' },
  fps: { id: 'fps', defaultMessage: 'FPS' },
  aspect: { id: 'video.aspect_ratio', defaultMessage: 'Aspect Ratio' },
  audio_channels: { id: 'video.audio_channels', defaultMessage: 'Audio Channels' },
  audio_encode: { id: 'video.audio_encode', defaultMessage: 'Audio Encode' },
  original_height: { id: 'video.original_height', defaultMessage: 'Original Height' },
  original_width: { id: 'video.original_width', defaultMessage: 'Original Width' },
  original_frame_rate: { id: 'video.original_frame_rate', defaultMessage: 'Original Frame Rate' },
  original_bitrate: { id: 'video.original_bitrate', defaultMessage: 'Original Bitrate' },
})

const mapDispatchToProps = (dispatch) => ({
  onClosePopover: () => dispatch(closePopover()),
})

export default
@injectIntl
@connect(null, mapDispatchToProps)
class VideoStatsPopover extends ImmutablePureComponent {

  static propTypes = {
    meta: ImmutablePropTypes.map.isRequired,
    onClosePopover: PropTypes.func.isRequired,
    isXS: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  }

  updateOnProps = [
    'meta',
    'isXS',
  ]

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  render() {
    const {
      intl,
      meta,
      isXS,
    } = this.props

    const keys = [
      'size',
      'audio_bitrate',
      'fps',
      'aspect',
      'audio_channels',
      'audio_encode',
    ]

    const originalKeys = [
      'height',
      'width',
      'frame_rate',
      'bitrate',
    ]

    const containerClasses = CX({
      default: 1,
      bgBlack: !isXS,
      bgPrimary: !isXS,
      px10: 1,
      py10: 1,
    })

    return (
      <PopoverLayout
        isXS={isXS}
        width={320}
        onClose={this.handleOnClosePopover}
      >
        <div className={containerClasses}>
          <Button
            icon='close'
            iconSize='8px'
            color='white'
            backgroundColor='none'
            className={[_s.posAbs, _s.top0, _s.right0, _s.mt5, _s.mr5, _s.z4].join(' ')}
            onClick={this.handleOnClosePopover}
          />
          
          {
            keys.map((key) => (
              <VideoStatLine
                key={`video-stat-${key}`}
                title={intl.formatMessage(messages[key])}
                value={meta.get(key)}
                isXS={isXS}
              />
            ))
          }
          {
            originalKeys.map((key) => (
              <VideoStatLine
                key={`video-stat-o-${key}`}
                title={intl.formatMessage(messages[`original_${key}`])}
                value={meta.getIn(['original', key])}
                isXS={isXS}
              />
            ))
          }
          
        </div>
      </PopoverLayout>
    )
  }

}

class VideoStatLine extends PureComponent {

  static propTypes = {
    isXS: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }

  render() {
    const { isXS, title, value } = this.props

    const color = isXS ? 'primary' : 'white'

    return (
      <div className={[_s.default, _s.flexRow, _s.pt2].join(' ')}>
        <div className={[_s.default, _s.width115PX, _s.alignItemsEnd, _s.mr5].join(' ')}>
          <Text size='extraSmall' weight='medium' color={color}>
            {title}
          </Text>
        </div>
        <Text size='extraSmall' color={color}>
          {value}
        </Text>
      </div>
    )
  }

}