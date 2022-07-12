import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { applyHealthExpert } from '../../actions/accounts'
import { closeModal } from '../../actions/modal'
import { me } from '../../initial_state'
import Button from '../button'
import Block from '../block'
import Textarea from '../textarea'
import Input from '../input'
import Text from '../text'
import Heading from '../heading'

const messages = defineMessages({
  title: { id: 'account.health_experts_modal.title', defaultMessage: 'Apply to join as Health Expert' },
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  training_certification: { id: 'account.health_experts_modal.training_certification', defaultMessage: 'Training and Certifications' },
  website_url: { id: 'account.health_experts_modal.website_url', defaultMessage: 'Website URL' },
  facebook_url: { id: 'account.health_experts_modal.facebook_url', defaultMessage: 'Facebook URL' },
  twitter_url: { id: 'account.health_experts_modal.twitter_url', defaultMessage: 'Twitter URL' },
  instagram_url: { id: 'account.health_experts_modal.instagram_url', defaultMessage: 'Instagram URL' },
  telegram_url: { id: 'account.health_experts_modal.telegram_url', defaultMessage: 'Telegram URL' },
  youtube_url: { id: 'account.health_experts_modal.youtube_url', defaultMessage: 'Youbube URL' },
  apply: { id: 'account.health_experts_modal.apply', defaultMessage: 'Apply' },
})

const mapStateToProps = (state) => ({
  account: state.getIn(['accounts', me]),
})

const mapDispatchToProps = (dispatch) => ({
  onApplyHealthExperts(account, data) {
    dispatch(applyHealthExpert(account.get('id'), data))
    dispatch(closeModal())
  }
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class HealthExpertsModal extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onApplyHealthExperts: PropTypes.func.isRequired,
  }

  state = {
    trainingCertification: '',
    websiteURL: '',
    facebookURL: '',
    twitterURL: '',
    instagramURL: '',
    telegramURL: '',
    youtubeURL: '',
  }

  componentDidUpdate (prevProps) {
    if (prevProps.account !== this.props.account) {
    }
  }

  handleURLChange = (key, value) => {
    this.setState({ ...this.state, [key]: value })
  }

  handleOnClose = () => {
    this.props.onClose()
  }

  handleOnApplyHealthExperts = () => {
    this.props.onApplyHealthExperts(this.props.account, this.state)
  }

  render() {
    const { intl, account } = this.props
    const {
      trainingCertification,
      websiteURL,
      facebookURL,
      twitterURL,
      instagramURL,
      telegramURL,
      youtubeURL,
    } = this.state

    return (
      <div style={{ width: '440px' }} className={[_s.default, _s.modal].join(' ')}>
        <Block>
          <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.justifyContentCenter, _s.borderBottom1PX, _s.borderColorSecondary, _s.height53PX, _s.px15].join(' ')}>
            <Heading size='h2'>
              {intl.formatMessage(messages.title)}
            </Heading>
            <Button
              backgroundColor='none'
              title={intl.formatMessage(messages.close)}
              className={[_s.mlAuto, _s.pl0].join(' ')}
              onClick={this.handleOnClose}
              color='secondary'
              icon='close'
              iconSize='10px'
            />
          </div>

          <div className={[_s.default, _s.heightMax80VH, _s.overflowYScroll].join(' ')}>
            <div className={[_s.default, _s.py5, _s.px15, _s.mt5, _s.width100PC].join(' ')}>
              <Textarea
                id='training-certification'
                title={intl.formatMessage(messages.training_certification)}
                value={trainingCertification}
                required={true}
                onChange={(val) => { this.handleURLChange('trainingCertification', val) }}
              />
            </div>

            <div className={[_s.default, _s.py5, _s.px15, _s.mt5, _s.width100PC].join(' ')}>
              <Input
                id='website-url'
                title={intl.formatMessage(messages.website_url)}
                value={websiteURL}
                onChange={(val) => { this.handleURLChange('websiteURL', val) }}
              />
            </div>

            <div className={[_s.default, _s.py5, _s.px15, _s.mt5, _s.width100PC].join(' ')}>
              <Input
                id='facebook-url'
                title={intl.formatMessage(messages.facebook_url)}
                value={facebookURL}
                onChange={(val) => { this.handleURLChange('facebookURL', val) }}
              />
            </div>

            <div className={[_s.default, _s.py5, _s.px15, _s.mt5, _s.width100PC].join(' ')}>
              <Input
                id='twitter-url'
                title={intl.formatMessage(messages.twitter_url)}
                value={twitterURL}
                onChange={(val) => { this.handleURLChange('twitterURL', val) }}
              />
            </div>

            <div className={[_s.default, _s.py5, _s.px15, _s.mt5, _s.width100PC].join(' ')}>
              <Input
                id='instagram-url'
                title={intl.formatMessage(messages.instagram_url)}
                value={instagramURL}
                onChange={(val) => { this.handleURLChange('instagramURL', val) }}
              />
            </div>

            <div className={[_s.default, _s.py5, _s.px15, _s.mt5, _s.width100PC].join(' ')}>
              <Input
                id='telegram-url'
                title={intl.formatMessage(messages.telegram_url)}
                value={telegramURL}
                onChange={(val) => { this.handleURLChange('telegramURL', val) }}
              />
            </div>

            <div className={[_s.default, _s.py5, _s.px15, _s.mt5, _s.width100PC].join(' ')}>
              <Input
                id='youtube-url'
                title={intl.formatMessage(messages.youtube_url)}
                value={youtubeURL}
                onChange={(val) => { this.handleURLChange('youtubeURL', val) }}
              />
            </div>

            <div className={[_s.default, _s.py5, _s.px15, _s.mt5, _s.width100PC].join(' ')}>
              <Button
					      isDisabled={!trainingCertification}
                onClick={this.handleOnApplyHealthExperts}
                isOutline
                color='brand'
                backgroundColor='none'
                className={[_s.flexRow, _s.alignItemsCenter, _s.justifyContentCenter, _s.mb15].join(' ')}
              >
                <Text color='inherit' weight='medium' align='center' size='small'>
                  {intl.formatMessage(messages.apply)}
                </Text>
              </Button>
            </div>
            
          </div>
        </Block>
      </div>
    )
  }
}
