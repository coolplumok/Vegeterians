import { defineMessages, injectIntl } from 'react-intl'
import spring from 'react-motion/lib/spring'
import Motion from '../features/ui/util/reduced_motion'
import Text from './text'

const messages = defineMessages({
  title: { id: 'upload_area.title', defaultMessage: 'Drag & drop to upload' },
})

export default
@injectIntl
class UploadArea extends PureComponent {

  static propTypes = {
    active: PropTypes.bool,
    onClose: PropTypes.func,
    intl: PropTypes.object.isRequired,
  }

  handleKeyUp = (e) => {
    if (!this.props.active) return

    const keyCode = e.keyCode
    switch(keyCode) {
    case 27:
      e.preventDefault()
      e.stopPropagation()
      this.props.onClose()
      break
    }
  }

  componentDidMount () {
    window.addEventListener('keyup', this.handleKeyUp, false)
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  render () {
    const { active, intl } = this.props

    return (
      <Motion
        defaultStyle={{
          backgroundOpacity: 0,
          backgroundScale: 0.95
        }}
        style={{
          backgroundOpacity: spring(active ? 1 : 0, { stiffness: 150, damping: 15 }),
          backgroundScale: spring(active ? 1 : 0.95, { stiffness: 200, damping: 3 })
        }}
      >
        {({ backgroundOpacity, backgroundScale }) => (
          <div
            className={[_s.default, _s.alignItemsCenter, _s.justifyContentCenter, _s.bgPrimaryOpaque, _s.width100PC, _s.height100PC, _s.posAbs, _s.top0, _s.rightAuto, _s.bottomAuto, _s.left0].join(' ')}
            style={{
              visibility: active ? 'visible' : 'hidden',
              opacity: backgroundOpacity
            }}
          >
            <div className={[_s.default, _s.width340PX, _s.height260PX, _s.px10, _s.py10].join(' ')}>
              <div
                className={[_s.default, _s.posAbs, _s.bgPrimary, _s.height100PC, _s.width100PC, _s.radiusSmall].join(' ')}
                style={{
                  transform: `scale(${backgroundScale})`
                }}
              />
              <div className={[_s.default, _s.height100PC, _s.width100PC, _s.border2PX, _s.borderColorSecondary, _s.borderDashed, _s.radiusSmall, _s.alignItemsCenter, _s.justifyContentCenter].join(' ')}>
                <Text size='medium' color='secondary'>
                  {intl.formatMessage(messages.title)}
                </Text>
              </div>
            </div>
          </div>
        )}
      </Motion>
    )
  }

}