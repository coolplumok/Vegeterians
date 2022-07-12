import { injectIntl, defineMessages } from 'react-intl'
import { me } from '../../initial_state'
import Button from '../button'
import Text from '../text'
import PanelLayout from './panel_layout'

const messages = defineMessages({
  title: { id: 'signup_panel.title', defaultMessage: 'New to Vegeterians.live?' },
  subtitle: { id: 'signup_panel.subtitle', defaultMessage: 'Sign up now to speak freely.' },
  register: { id: 'account.register', defaultMessage: 'Sign up' },
  login: { id: 'account.login', defaultMessage: 'Log in' },
})

export default
@injectIntl
class SignUpPanel extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  render() {
    if (me) return null

    const { intl } = this.props

    return (
      <PanelLayout
        title={intl.formatMessage(messages.title)}
        subtitle={intl.formatMessage(messages.subtitle)}
      >
        <div className={[_s.default, _s.flexRow, _s.pb5].join(' ')}>
          <Button
            isOutline
            color='brand'
            backgroundColor='none'
            href='/auth/sign_in'
            className={[_s.flexRow, _s.alignItemsCenter, _s.justifyContentCenter, _s.mr10].join(' ')}
          >
            <Text color='inherit' weight='medium' align='center' className={_s.px10}>
              {intl.formatMessage(messages.login)}
            </Text>
          </Button>
          <Button
            href='/auth/sign_up'
            className={_s.flexGrow1}
          >
            <Text color='inherit' size='large' weight='bold' align='center'>
              {intl.formatMessage(messages.register)}
            </Text>
          </Button>
        </div>
      </PanelLayout>
    )
  }

}
