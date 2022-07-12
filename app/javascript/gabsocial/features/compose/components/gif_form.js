import { clearSelectedGif } from '../../../actions/tenor'
import Image from '../../../components/image'

const mapDispatchToProps = (dispatch) => ({
  onClearSelectedGif() {
    dispatch(clearSelectedGif())
  },
})

export default
@connect(null, mapDispatchToProps)
class GifForm extends PureComponent {

  static propTypes = {
    onClearSelectedGif: PropTypes.func.isRequired,
    replyToId: PropTypes.string,
    small: PropTypes.bool,
    selectedGifSrc: PropTypes.string.isRequired,
  }

  render () {
    const {
      selectedGifSrc,
      small,
    } = this.props

    if (!selectedGifSrc) return null

    return (
      <div className={_s.default}>
        <div className={[_s.default, _s.flexRow, _s.flexWrap].join(' ')}>
          <Image
            width='auto'
            src={selectedGifSrc}
            className={[_s.maxWidth100PC, _s.radiusSmall, _s.height260PX].join(' ')}
          />
        </div>
      </div>
    )
  }

}
