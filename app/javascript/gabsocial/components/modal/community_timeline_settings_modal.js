import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { changeSetting, saveSettings } from '../../actions/settings'
import ModalLayout from './modal_layout'
import Button from '../button'
import SettingSwitch from '../setting_switch'
import Text from '../text'

const messages = defineMessages({
  title: { id: 'community_timeline_settings', defaultMessage: 'Community Feed Settings' },
  saveAndClose: { id: 'saveClose', defaultMessage: 'Save & Close' },
  onlyMedia: { id: 'community.column_settings.media_only', defaultMessage: 'Media Only' },
})

const mapStateToProps = (state) => ({
  settings: state.getIn(['settings', 'community']),
})

const mapDispatchToProps = (dispatch, { onClose }) => ({
  onChange(key, checked) {
    dispatch(changeSetting(['community', ...key], checked))
  },
  onSave() {
    dispatch(saveSettings())
    onClose()
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class CommunityTimelineSettingsModal extends ImmutablePureComponent {

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
    const {
      intl,
      settings,
      onChange,
      onClose,
    } = this.props

    return (
      <ModalLayout
        onClose={onClose}
        width={320}
        title={intl.formatMessage(messages.title)}
      >
      
        <div className={[_s.default, _s.pb10].join(' ')}>
          <SettingSwitch
            prefix='community_timeline'
            settings={settings}
            settingPath={['shows', 'onlyMedia']}
            onChange={onChange}
            label={intl.formatMessage(messages.onlyMedia)}
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
