import { defineMessages, injectIntl } from 'react-intl'
import classNames from 'classnames/bind'
import Button from '../button'
import Block from '../block'
import Heading from '../heading'

const cx = classNames.bind(_s)

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
})

export default
@injectIntl
class ModalLayout extends PureComponent {

  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
    width: PropTypes.number,
    hideClose: PropTypes.bool,
    noPadding: PropTypes.bool,
    isXS: PropTypes.bool,
  }

  static defaultProps = {
    width: 600,
  }

  onHandleCloseModal = () => {
    this.props.onClose()
  }

  render() {
    const {
      title,
      children,
      intl,
      width,
      hideClose,
      noPadding,
      isXS,
      className
    } = this.props

    const childrenContainerClasses = cx({
      default: 1,
      heightMax80VH: 1,
      overflowYScroll: 1,
      px15: !noPadding,
      py10: !noPadding,
    })

    return (
      <div style={{width: `${width}px`}} className={[_s.default, _s.modal].join(' '), className}>
        <Block>
          <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.justifyContentCenter, _s.borderBottom1PX, _s.borderColorSecondary, _s.height53PX, _s.px15].join(' ')}>
            <Heading size='h2'>
              {title}
            </Heading>
            {
              !hideClose && !isXS &&
              <Button
                backgroundColor='none'
                title={intl.formatMessage(messages.close)}
                className={_s.mlAuto}
                onClick={this.onHandleCloseModal}
                color='secondary'
                icon='close'
                iconSize='10px'
              />
            }
          </div>
          <div className={childrenContainerClasses}>
            {children}
          </div>
        </Block>
      </div>
    )
  }

}