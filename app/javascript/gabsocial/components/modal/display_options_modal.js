import { injectIntl, defineMessages } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { changeSetting, saveSettings } from '../../actions/settings'
import {
  DEFAULT_THEME,
  DEFAULT_FONT_SIZE,
  FONT_SIZES,
} from '../../constants'
import ModalLayout from './modal_layout'
import Button from '../button'
import Text from '../text'
import SettingSwitch from '../setting_switch'

const messages = defineMessages({
  message: { id: 'display_options.message', defaultMessage: 'Display settings affect your Vegeterians.live account on this browser. These settings are only visible to you.' },
  title: { id: 'display_options', defaultMessage: 'Customize your view' },
})

const mapStateToProps = (state) => ({
  displayOptionsSettings: state.getIn(['settings', 'displayOptions']),
  fontSize: state.getIn(['settings', 'displayOptions', 'fontSize'], DEFAULT_FONT_SIZE),
  theme: state.getIn(['settings', 'displayOptions', 'theme'], DEFAULT_THEME),
})

const mapDispatchToProps = (dispatch) => ({
  onChange(key, value) {
    dispatch(changeSetting(['displayOptions', key], value))
    dispatch(saveSettings())
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class DisplayOptionsModal extends ImmutablePureComponent {

  static propTypes = {
    fontSize: PropTypes.string,
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    displayOptionsSettings: ImmutablePropTypes.map,
    theme: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  updateOnProps = [
    'fontSize',
    'displayOptionsSettings',
    'theme',
  ]

  handleOnFontSizeChange = (e) => {
    const fontSizeNames = Object.keys(FONT_SIZES)
    const index = fontSizeNames[e.target.value]

    this.props.onChange('fontSize', index)
  }

  handleOnThemeSelected = (e) => {
    this.props.onChange('theme', e.target.value)
  }

  handleOnRadiusKeyDisabled = (key, checked) => {
    this.props.onChange(key, checked)
  }

  render() {
    const {
      fontSize,
      displayOptionsSettings,
      intl,
      theme,
      onClose,
    } = this.props

    const fontSizeNames = Object.keys(FONT_SIZES)
    const currentFontSizeIndex = fontSizeNames.indexOf(fontSize)

    return (
      <ModalLayout
        onClose={onClose}
        width={520}
        title={intl.formatMessage(messages.title)}
      >

        <div className={[_s.default, _s.mb15].join(' ')}>
          <Text align='center' color='secondary' size='medium'>
            {intl.formatMessage(messages.message)}
          </Text>
        </div>

        <div className={[_s.default, _s.mb15].join(' ')}>
          <Text weight='bold' size='small' color='secondary'>
            Font Size
          </Text>
          <div className={[_s.default, _s.radiusSmall, _s.mt10, _s.py15, _s.px15, _s.bgTertiary].join(' ')}>
            <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
              <span className={[_s.default, _s.text, _s.colorPrimary].join(' ')} style={{fontSize: '12px'}}>
                Aa
              </span>
              <input
                type='range'
                min='0'
                value={currentFontSizeIndex}
                max={fontSizeNames.length - 1}
                onInput={this.handleOnFontSizeChange}
                onChange={this.handleOnFontSizeChange}
                className={[_s.flexGrow1, _s.outlineNone, _s.ml15, _s.mr15].join(' ')}
              />
              <span className={[_s.default, _s.text, _s.colorPrimary].join(' ')} style={{fontSize: '18px'}}>
                Aa
              </span>
            </div>
          </div>
        </div>

        <div className={[_s.default, _s.mb15].join(' ')}>
          <Text weight='bold' size='small' color='secondary'>
            Rounded
          </Text>
          <div className={[_s.default, _s.radiusSmall, _s.mt10, _s.py15, _s.px15, _s.bgTertiary].join(' ')}>
            <SettingSwitch
              prefix='displayOptions'
              settings={displayOptionsSettings}
              settingPath={'radiusSmallDisabled'}
              onChange={this.handleOnRadiusKeyDisabled}
              label={'Small Radius Disabled'}
            />

            <SettingSwitch
              prefix='displayOptions'
              settings={displayOptionsSettings}
              settingPath={'radiusCircleDisabled'}
              onChange={this.handleOnRadiusKeyDisabled}
              label={'Circles Disabled'}
            />
          </div>
        </div>

        <div className={[_s.default, _s.mb10].join(' ')}>
          <Text weight='bold' size='small' color='secondary'>
            Theme
          </Text>
          <div className={[_s.default, _s.radiusSmall, _s.flexRow, _s.mt10, _s.py10, _s.bgTertiary].join(' ')}>

            <ThemeBlock
              title='Light'
              value='light'
              checked={theme === 'light'}
              onChange={this.handleOnThemeSelected}
              style={{
                borderColor: '#ececed',
                backgroundColor: '#fff',
                color: '#2d3436',
              }}
            />

            <ThemeBlock
              title='Muted'
              value='muted'
              checked={theme === 'muted'}
              onChange={this.handleOnThemeSelected}
              style={{
                borderColor: '#424141',
                backgroundColor: '#222',
                color: '#fff',
              }}
            />

            <ThemeBlock
              title='Black'
              value='black'
              checked={theme === 'black'}
              onChange={this.handleOnThemeSelected}
              style={{
                borderColor: '#212020',
                backgroundColor: '#13171b',
                color: '#cccbcb',
              }}
            />

          </div>
        </div>

        <div className={[_s.mlAuto, _s.my10, _s.mrAuto].join(' ')}>
          <Button onClick={onClose}>
            <Text size='medium' color='inherit' className={_s.px10}>
              Done
            </Text>
          </Button>
        </div>

      </ModalLayout>
    )
  }

}

class ThemeBlock extends PureComponent {

  static propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    title: PropTypes.string,
    value: PropTypes.string,
    style: PropTypes.object,
  }

  render() {
    const {
      checked,
      onChange,
      title,
      value,
      style,
    } = this.props

    const id = `theme-${value}`

    return (
      <label className={[_s.default, _s.px10, _s.flexGrow1].join(' ')} htmlFor={id}>
        <div
          className={[_s.default, _s.borderBottom6PX, _s.alignItemsCenter, _s.flexRow, _s.py10, _s.px15, _s.radiusSmall].join(' ')}
          style={style}
        >
          <input
            type='radio'
            name='theme'
            value={value}
            id={id}
            checked={checked}
            onChange={onChange}
          />
          <Text
            align='center'
            size='medium'
            weight='bold'
            color='inherit'
            className={[_s.py10, _s.flexGrow1].join(' ')}
          >
            {title}
          </Text>
        </div>
      </label>
    )
  }

}
