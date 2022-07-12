import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import {
  URL_GAB_PRO_LEARN_MORE,
  URL_GAB_PRO_UPGRADE,
  DEFAULT_THEME,
} from '../../constants'
import Button from '../button'
import Text from '../text'
import Icon from '../icon'
import Image from '../image'
import ModalLayout from './modal_layout'
import { me } from '../../initial_state'
import { openModal } from '../../actions/modal'

const messages = defineMessages({
  title: { id: 'promo.Vegeterians_pro', defaultMessage: 'Upgrade to VegeteriansPro' },
  upgrade: { id: 'promo.upgrade', defaultMessage: 'Upgrade' },
  learnMore: { id: 'promo.learn_more', defaultMessage: 'Learn more' },
  text: { id: 'pro_upgrade_modal.text', defaultMessage: 'Vegeterians.live is fully funded by people like you. Please consider supporting us on our mission to defend free expression online for all people.' },
  benefits: { id: 'pro_upgrade_modal.benefits', defaultMessage: 'Here are some benefits that VegeteriansPro members receive:' },
})

const mapStateToProps = (state) => ({
  theme: state.getIn(['settings', 'displayOptions', 'theme'], DEFAULT_THEME),
  isPro: state.getIn(['accounts', me, 'is_pro']),
  isProPlus: state.getIn(['accounts', me, 'is_proplus']),
})

export default
@injectIntl
@connect(mapStateToProps)
class ProUpgradeModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired,
  }

  state = {
    Subscription_modal:false
  }
  handlechange=()=>{
    this.props.dispatch(openModal('SUBSCRIPTION', {...this.props}))
  }

  render() {
    const {
      intl,
      onClose,
      theme,
      isPro,
      isProPlus,
    } = this.props
  
    const imgSuffix = (theme === 'light' || !theme) ? 'light' : 'dark'

    const title = (
      <span className={[_s.default, _s.flexRow, _s.justifyContentCenter, _s.alignItemsCenter].join(' ')}>
        <span className={[_s.default, _s.mr2].join(' ')}>
          Upgrade to Vegeterians
        </span>
        <span className={[_s.bgPro, _s.colorBlack, _s.radiusSmall, _s.px5, _s.py5].join(' ')}>PRO</span>
      </span>
    )
    return (
      <ModalLayout
        title={title}
        width={540}
        onClose={onClose}
      >
        <Text size='medium' weight='medium' className={_s.mb10}>
          {intl.formatMessage(messages.text)}
        </Text>
        <Text size='medium' color='secondary'>
          {intl.formatMessage(messages.benefits)}
        </Text>

        <div className={[_s.default, _s.my10].join(' ')}>
          <Image
            src={'/headers/pro-features.png'}
            width='100%'
            height='auto'
            fit='cover'
            className={_s.heightMin320PX}
          />
        </div>

        <div className={[_s.default, _s.flexRow, _s.py10].join(' ')}>
          <Button
            isOutline
            color='brand'
            backgroundColor='none'
            href={URL_GAB_PRO_LEARN_MORE}
            className={[_s.flexRow, _s.alignItemsCenter, _s.justifyContentCenter, _s.mr10].join(' ')}
          >
            <Text color='inherit' weight='medium' align='center'>
              {intl.formatMessage(messages.learnMore)}
            </Text>
          </Button>
          <Button
            onClick={this.handlechange}
            className={[_s.flexRow, _s.flexGrow1, _s.alignItemsCenter, _s.justifyContentCenter].join(' ')}
          >
            <Text color='inherit' size='large' weight='bold' align='center'>
              {intl.formatMessage(messages.upgrade)}
            </Text>
            <Icon id='arrow-right' size='20px' className={[_s.fillWhite, _s.ml5].join(' ')} />
          </Button>
        </div>
      </ModalLayout>
    )
    
   
  }
}