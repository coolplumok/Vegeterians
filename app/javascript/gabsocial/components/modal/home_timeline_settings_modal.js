import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { changeSetting, saveSettings } from '../../actions/settings'
import ModalLayout from './modal_layout'
import Button from '../button'
import SettingSwitch from '../setting_switch'
import Text from '../text'

const messages = defineMessages({
  title: { id: 'home_timeline_settings', defaultMessage: 'Home Timeline Settings' },
  saveAndClose: { id: 'saveClose', defaultMessage: 'Save & Close' },
  showVideos: { id: 'home.column_settings.show_videos', defaultMessage: 'Show videos' },
  showPhotos: { id: 'home.column_settings.show_photos', defaultMessage: 'Show photos' },
  showPolls: { id: 'home.column_settings.show_polls', defaultMessage: 'Show polls' },
  showReposts: { id: 'home.column_settings.show_reposts', defaultMessage: 'Show comments' },
  showReplies: { id: 'home.column_settings.show_replies', defaultMessage: 'Show replies' },
})

const mapStateToProps = (state) => ({
  settings: state.getIn(['settings', 'home']),
})

const mapDispatchToProps = (dispatch, {onClose}) => {
  return {
    onChange(key, checked) {
      dispatch(changeSetting(['home', ...key], checked))
    },
    onSave() {
      dispatch(saveSettings())
      onClose()
    },
  }
}

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class HomeTimelineSettingsModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    settings: ImmutablePropTypes.map.isRequired,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  }

  handleSaveAndClose = () => {
    this.props.onSave()
  }

  render() {
    const { intl, settings, onChange, onClose } = this.props

    return (
      <ModalLayout
        width={320}
        title={intl.formatMessage(messages.title)}
        onClose={onClose}
      >
      
        <div className={[_s.default, _s.pb10].join(' ')}>
          {
            /*
            <SettingSwitch
              prefix='home_timeline'
              settings={settings}
              settingPath={['shows', 'polls']}
              onChange={onChange}
              label={intl.formatMessage(messages.showPolls)}
            />

            <SettingSwitch
              prefix='home_timeline'
              settings={settings}
              settingPath={['shows', 'photos']}
              onChange={onChange}
              label={intl.formatMessage(messages.showPhotos)}
            />

            <SettingSwitch
              prefix='home_timeline'
              settings={settings}
              settingPath={['shows', 'videos']}
              onChange={onChange}
              label={intl.formatMessage(messages.showVideos)}
            />
            */
          }

          <SettingSwitch
            prefix='home_timeline'
            settings={settings}
            settingPath={['shows', 'repost']}
            onChange={onChange}
            label={intl.formatMessage(messages.showReposts)}
          />

          <SettingSwitch
            prefix='home_timeline'
            settings={settings}
            settingPath={['shows', 'reply']}
            onChange={onChange}
            label={intl.formatMessage(messages.showReplies)}
          />
        </div>

        <Button
          backgroundColor='brand'
          color='white'
          className={_s.justifyContentCenter}
          onClick={this.handleSaveAndClose}
        >
          <Text color='inherit' weight='bold' align='center'>
            {intl.formatMessage(messages.saveAndClose)}
          </Text>
        </Button>

      </ModalLayout>
    )
  }
}
