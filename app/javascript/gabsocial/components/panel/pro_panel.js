import { injectIntl, defineMessages } from 'react-intl'
import { URL_GAB_PRO_LEARN_MORE, URL_GAB_PRO_UPGRADE, DEFAULT_THEME } from '../../constants'
import PanelLayout from './panel_layout';
import Button from '../button'
import Icon from '../icon'
import Text from '../text'
import Block from '../block'
import { openModal } from '../../actions/modal'
import { me } from '../../initial_state'

const messages = defineMessages({
  title: { id: 'promo.Vegeterians_pro', defaultMessage: 'Upgrade to VegeteriansPro' },
  text: { id: 'pro_upgrade_modal.text_sm', defaultMessage: 'Join us in our mission to provide censorship free health knowledge and community.' },
})

const mapStateToProps = (state) => ({
  theme: state.getIn(['settings', 'displayOptions', 'theme'], DEFAULT_THEME),
  isPro: state.getIn(['accounts', me, 'is_pro']),
  isProPlus: state.getIn(['accounts', me, 'is_proplus']),
  email: state.getIn(['accounts', me, 'email']),
})

export default
@injectIntl
@connect(mapStateToProps)
class ProPanel extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    isPro: PropTypes.bool.isRequired,
  }
  state={
    modal:false
  }

  handlechange=()=>{
    this.props.dispatch(openModal('SUBSCRIPTION', {...this.props}))
  }

  render() {
    const { intl, isPro } = this.props

    if (isPro) return null

    const title = (
      <span className={[_s.default, _s.flexRow, _s.justifyContentCenter, _s.alignItemsCenter].join(' ')}>
        <span className={[_s.default, _s.mr2].join(' ')}>
          Upgrade to 
        </span>
        <span className={[_s.bgPro, _s.colorBlack, _s.radiusSmall, _s.px5, _s.py5, _s.fs16PX].join(' ')}>PRO</span>
      </span>
    )
    
    return (
      <PanelLayout
        title={title}
        subtitle={intl.formatMessage(messages.text)}
      >
        <div className={[_s.default, _s.pb5].join(' ')}>
          <Button
            onClick={() => this.handlechange()}
            isOutline
            color='brand'
            backgroundColor='none'
            className={[_s.flexRow, _s.alignItemsCenter, _s.justifyContentCenter, _s.mb15].join(' ')}
          >
            <Text color='inherit' weight='medium' align='center' size='small'>
              Upgrade
            </Text>
          </Button>
        </div>
      </PanelLayout>
    )
  }
}