import unicodeMapping from './emoji/emoji_unicode_mapping_light'
import Text from './text'

const assetHost = process.env.CDN_HOST || ''

export default class AutosuggestEmoji extends PureComponent {

  static propTypes = {
    emoji: PropTypes.object.isRequired,
  }

  render () {
    const { emoji } = this.props
    let url

    if (emoji.custom) {
      url = emoji.imageUrl
    } else {
      const mapping = unicodeMapping[emoji.native] || unicodeMapping[emoji.native.replace(/\uFE0F$/, '')]

      if (!mapping) return null

      url = `${assetHost}/emoji/${mapping.filename}.svg`
    }

    return (
      <div className={[_s.default, _s.cursorPointer, _s.bgSubtle_onHover, _s.flexRow, _s.py10, _s.alignItemsCenter, _s.px10, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
        <img className='emojione' src={url} alt={emoji.native || emoji.colons} />
        <Text className={_s.ml10}>
          {emoji.colons}
        </Text>
      </div>
    )
  }

}
