import Block from '../block'
import Button from '../button'
import Heading from '../heading'
import Text from '../text'

export default class PopoverLayout extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    width: PropTypes.number,
    isXS: PropTypes.bool,
    title: PropTypes.string,
    onClose: PropTypes.func,
  }

  static defaultProps = {
    width: 250,
  }

  handleOnClose = () => {
    this.props.onClose()
  }

  render() {
    const {
      children,
      width,
      isXS,
      title,
    } = this.props

    if (isXS) {
      return (
        <div className={[_s.default, _s.modal, _s.px10, _s.pb10].join(' ')}>
          <div className={[_s.default, _s.bgPrimary, _s.radiusSmall, _s.overflowHidden, _s.mb10].join(' ')}>
            {
              !!title &&
              <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.justifyContentCenter, _s.borderBottom1PX, _s.borderColorSecondary, _s.height53PX, _s.px15].join(' ')}>
                <Heading size='2'>
                  {title}
                </Heading>
              </div>
            }
            <div className={[_s.default, _s.heightMax80VH, _s.radiusSmall, _s.overflowYScroll].join(' ')}>
              {children}
            </div>
          </div>

          <Button
            backgroundColor='primary'
            color='primary'
            onClick={this.handleOnClose}
            radiusSmall
          >
            <Text color='inherit' size='large' align='center'>
              Cancel
            </Text>
          </Button>
        </div>
      )
    }

    return (
      <div style={{ width: `${width}px` }} className={_s.modal}>
        <Block>
          {children}
        </Block>
      </div>
    )
  }

}