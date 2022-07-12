import { injectIntl, defineMessages } from 'react-intl'
import Button from './button'
import Text from './text'

const messages = defineMessages({
  warning: { id: 'status.sensitive_warning_2', defaultMessage: 'The following media includes potentially sensitive content.' },
  view: { id: 'view', defaultMessage: 'View' },
});

export default
@injectIntl
class SensitiveMediaItem extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  render() {
    const {
      intl,
      onClick,
    } = this.props

    return (
      <div className={[_s.default, _s.px15, _s.pt5].join(' ')}>
        <div className={[_s.default, _s.flexRow, _s.radiusSmall, _s.bgTertiary, _s.py10, _s.px15, _s.height100PC, _s.width100PC].join(' ')}>
          <div className={[_s.default, _s.justifyContentCenter, _s.flexNormal].join(' ')}>
            <Text color='secondary'>
              {intl.formatMessage(messages.warning)}
            </Text>
          </div>
          <div className={[_s.default, _s.justifyContentCenter, _s.mlAuto].join(' ')}>
            <Button
              onClick={onClick}
              color='tertiary'
              backgroundColor='none'
              className={_s.bgSecondaryDark_onHover}
            >
              <Text color='inherit' weight='bold' size='medium'>
                {intl.formatMessage(messages.view)}
              </Text>
            </Button>
          </div>
        </div>
      </div>
    )
  }

}
