import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import api from '../../api'
import ModalLayout from './modal_layout'
import Divider from '../divider'
import Icon from '../icon'
import Input from '../input'
import Text from '../text'

const messages = defineMessages({
  embed: { id: 'status.embed', defaultMessage: 'Embed' },
  instructions: { id: 'embed.instructions', defaultMessage: 'Embed this status on your website by copying the code below.' },
  preview: { id: 'embed.preview', defaultMessage: 'Here is what it will look like:' },
})

export default
@injectIntl
class EmbedModal extends ImmutablePureComponent {

  static propTypes = {
    url: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  }

  state = {
    loading: false,
    oembed: null,
  }

  componentDidMount() {
    const { url } = this.props

    this.setState({ loading: true })

    api().post('/api/web/embed', { url }).then(res => {
      this.setState({ loading: false, oembed: res.data })

      const iframeDocument = this.iframe.contentWindow.document

      iframeDocument.open()
      iframeDocument.write(res.data.html)
      iframeDocument.close()

      iframeDocument.body.style.margin = 0
      this.iframe.width = iframeDocument.body.scrollWidth
      this.iframe.height = iframeDocument.body.scrollHeight
    }).catch(error => {
      this.props.onError(error)
    })
  }

  setIframeRef = c => {
    this.iframe = c
  }

  handleTextareaClick = (e) => {
    e.target.select()
  }

  render() {
    const { intl, onClose } = this.props
    const { oembed } = this.state

    return (
      <ModalLayout
        title={intl.formatMessage(messages.embed)}
        onClose={onClose}
      >
        <div className={_s.default}>
          <Text className={_s.my10}>
            {intl.formatMessage(messages.instructions)}
          </Text>

          <div className={[_s.default, _s.mb10].join(' ')}>
            <Input
              readOnly
              type='text'
              className='embed-modal__html'
              value={oembed && oembed.html || ''}
              onClick={this.handleTextareaClick}
            />
          </div>

          <Divider />

          <Text className={_s.mb10}>
            {intl.formatMessage(messages.preview)}
          </Text>

          <div className={[_s.default, _s.width100PC, _s.bgSubtle, _s.height220PX, _s.alignItemsCenter, _s.justifyContentCenter].join(' ')}>
            <iframe
              className={[_s.default, _s.width100PC, _s.height100PC, _s.z2].join(' ')}
              frameBorder='0'
              ref={this.setIframeRef}
              sandbox='allow-same-origin'
              title='preview'
            />
            {
              !oembed && 
              <Icon id='loading' size='34px' className={[_s.posAbs, _s.z3].join(' ')} />
            }
          </div>

        </div>
      </ModalLayout>
    )
  }

}
