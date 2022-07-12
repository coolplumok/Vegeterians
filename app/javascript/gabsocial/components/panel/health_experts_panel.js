import { injectIntl, defineMessages } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { me } from '../../initial_state'
import { makeGetAccount } from '../../selectors'
import { openModal } from '../../actions/modal'
import {
  MODAL_HEALTH_EXPRTS,
} from '../../constants'
import PanelLayout from './panel_layout'
import Text from '../text'
import Button from '../button'

const messages = defineMessages({
  title: { id: 'account.health_experts', defaultMessage: 'Health Experts' },
  text: { id: 'account.health_experts.text_sm', defaultMessage: 'Apply for an Expert tag, which ensures your posts show up under the Vegeterians Expert feed. Help us promote your good work.' },
  apply: { id: 'account.health_experts.apply', defaultMessage: 'Apply' },
})

const mapStateToProps = (state) => ({
  account: makeGetAccount()(state, me),
})

const mapDispatchToProps = (dispatch) => ({
  onOpenApplyForm() {
    dispatch(openModal(MODAL_HEALTH_EXPRTS))
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class HealthExpertsPanel extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    intl: PropTypes.object.isRequired,
  }

  updateOnProps = [
    'account'
  ]

  handleOnApplyForm = () => {
    this.props.onOpenApplyForm()
  }

  render() {
    const {
      account,
      intl,
    } = this.props

    if (!account) return null

    const isExpert = account.get('is_expert')

    if (isExpert) return null

    return (
      <PanelLayout
        title={intl.formatMessage(messages.title)}
      >
        <div className={[_s.default, _s.pb15].join(' ')}>
          <Text color='inherit' weight='normal' align='center' size='small'>
            {intl.formatMessage(messages.text)}
          </Text>          
        </div>

        <div className={[_s.default, _s.pb5].join(' ')}>
          <Button
            onClick={this.handleOnApplyForm}
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
      </PanelLayout>
    )
  }

}