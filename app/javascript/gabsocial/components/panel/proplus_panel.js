import { injectIntl, defineMessages } from 'react-intl'
import { URL_GAB_PRO_LEARN_MORE, URL_GAB_PRO_UPGRADE, DEFAULT_THEME } from '../../constants'
import PanelLayout from './panel_layout';
import Button from '../button'
import Icon from '../icon'
import Text from '../text'
import { openModal } from '../../actions/modal'
import { me } from '../../initial_state'

const messages = defineMessages({
  title: { id: 'promo.Vegeterians_proplus', defaultMessage: 'Upgrade to VegeteriansProPlus' },
  text: { id: 'pro_upgrade_modal.text_sm', defaultMessage: 'Access expanded video, reach, ads and more with Vegeterians ProPlus. Designed for health experts and content creators.' },
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
class ProPlusPanel extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    isProPlus: PropTypes.bool.isRequired,
  }

  handlechange=()=>{
    this.props.dispatch(openModal('SUBSCRIPTION', {...this.props}))
  }


  render() {
    const { intl, isProPlus } = this.props

    if (isProPlus) return null

    const title = (
      <span className={[_s.default, _s.flexRow, _s.justifyContentCenter, _s.alignItemsCenter].join(' ')}>
        <span className={[_s.default, _s.mr2].join(' ')}>
          Upgrade to 
        </span>
        <span className={[_s.bgProPlus, _s.colorWhite, _s.radiusSmall, _s.px5, _s.py5, _s.fs16PX].join(' ')}>PROPLUS</span>
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