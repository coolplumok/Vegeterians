import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { me } from '../../initial_state'
import { setFilter } from '../../actions/notifications'
import PanelLayout from './panel_layout'
import SettingSwitch from '../setting_switch'

const messages = defineMessages({
  title: { id: 'notification_filters', defaultMessage: 'Notification Filters' },
  onlyVerified: { id: 'notification_only_verified', defaultMessage: 'Only Verified Users' },
  // onlyFollowing: { id: 'notification_only_following', defaultMessage: 'Only People I Follow' },
})

const mapStateToProps = (state) => ({
  settings: state.getIn(['notifications', 'filter']),
  isPro: state.getIn(['accounts', me, 'is_pro']),
  isProPlus: state.getIn(['accounts', me, 'is_proplus']),
})

const mapDispatchToProps = (dispatch) => ({
  onChange(path, value) {
    dispatch(setFilter(path, value))
  },
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class NotificationFilterPanel extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    settings: ImmutablePropTypes.map.isRequired,
    isPro: PropTypes.bool.isRequired,
  }

  render() {
    const {
      intl,
      onChange,
      settings,
      isPro,
      isProPlus
    } = this.props

    if (!isPro || !isProPlus) return null

    return (
      <PanelLayout title={intl.formatMessage(messages.title)}>
        <SettingSwitch
          prefix='notification'
          settings={settings}
          settingPath={'onlyVerified'}
          onChange={onChange}
          label={intl.formatMessage(messages.onlyVerified)}
        />

        { /* : todo :
          <SettingSwitch
          prefix='notification'
          settings={settings}
          settingPath={'onlyFollowing'}
          onChange={onChange}
          label={intl.formatMessage(messages.onlyFollowing)}
        /> */ }
      </PanelLayout>
    )
  }
}