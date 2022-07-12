import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { changeSetting, saveSettings } from '../../actions/settings'
import ModalLayout from './modal_layout'
import Button from '../button'
import SettingSwitch from '../setting_switch'
import Text from '../text'

const messages = defineMessages({
  title: { id: 'hashtag_timeline_settings', defaultMessage: 'Hashtag Timeline Settings' },
  saveAndClose: { id: 'saveClose', defaultMessage: 'Save & Close' },
  onlyMedia: { id: 'community.column_settings.media_only', defaultMessage: 'Media Only' },
  showInSidebar: { id: 'show_in_sidebar', defaultMessage: 'Show in Sidebar' },
})

const mapStateToProps = (state) => ({
  settings: state.getIn(['settings', 'community']),
})

const mapDispatchToProps = (dispatch, { onClose }) => {
  return {
    onChange(key, checked) {
      dispatch(changeSetting(['community', ...key], checked))
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
class HashtagTimelineSettingsModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    settings: ImmutablePropTypes.map.isRequired,
    onChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  handleSaveAndClose = () => {
    this.props.onSave()
  }

  render() {
    const { intl, settings, onChange, onClose } = this.props

    // : todo :

    return (
      <ModalLayout
        width={320}
        title={intl.formatMessage(messages.title)}
        onClose={onClose}
      >

        <div className={[_s.default, _s.pb10].join(' ')}>
          <SettingSwitch
            prefix='community_timeline'
            settings={settings}
            settingPath={['shows', 'inSidebar']}
            onChange={onChange}
            label={intl.formatMessage(messages.showInSidebar)}
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
