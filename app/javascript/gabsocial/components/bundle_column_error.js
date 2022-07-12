import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'
import {
  source_url,
  version,
} from '../initial_state'
import {
  APP_NAME,
  DEFAULT_REL,
} from '../constants'
import Button from './button'
import Divider from './divider'
import Icon from './icon'
import Text from './text'

const messages = defineMessages({
  title: { id: 'bundle_column_error.title', defaultMessage: 'Network error' },
  body: { id: 'bundle_column_error.body', defaultMessage: 'Something went wrong while loading this component.' },
  retry: { id: 'bundle_column_error.retry', defaultMessage: 'Try again' },
})

export default
@injectIntl
class BundleColumnError extends PureComponent {

  static propTypes = {
    onRetry: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  }

  handleRetry = () => {
    this.props.onRetry()
  }

  render () {
    const { intl: { formatMessage } } = this.props

    return (
      <div className={[_s.default, _s.heightMin100VH, _s.width100PC, _s.alignItemsCenter, _s.justifyContentCenter].join(' ')}>
        <div className={[_s.default, _s.heightMin53PX, _s.bgBrand, _s.alignItemsCenter, _s.z3, _s.top0, _s.right0, _s.left0, _s.posFixed].join(' ')} >
          <div className={[_s.default, _s.flexRow, _s.saveAreaInsetPT, _s.saveAreaInsetPL, _s.saveAreaInsetPR, _s.width1255PX].join(' ')}>

            <div className={[_s.default, _s.flexRow].join(' ')}>

              <h1 className={[_s.default, _s.mr15].join(' ')}>
                <Button href='/' isText aria-label='Vegeterians.live' className={[_s.default, _s.justifyContentCenter, _s.noSelect, _s.noUnderline, _s.height53PX, _s.cursorPointer, _s.px10, _s.mr15].join(' ')}>
                  <Icon id='logo' className={_s.fillWhite} />
                </Button>
              </h1>

            </div>
          </div>
        </div>

        <div className={[_s.default, _s.maxWidth640PX, _s.px15, _s.py10].join(' ')}>

          <Icon id='warning' size='28px' className={[_s.default, _s.fillSecondary, _s.mb15].join(' ')} />

          <Text size='medium' className={_s.pt15}>
            {formatMessage(messages.body)}
          </Text>

          <div className={[_s.default, _s.py10, _s.my10].join(' ')}>
            <Text>
              {APP_NAME} ({version})
            </Text>

            <div className={[_s.default, _s.flexRow, _s.mt10, _s.alignItemsCenter].join(' ')}>
              <Button
                isText
                href={source_url}
                rel={DEFAULT_REL}
                target='_blank'
                backgroundColor='tertiary'
                color='primary'
                radiusSmall
                className={[_s.py2, _s.px10].join(' ')}
              >
                <Text color='inherit'>
                  <FormattedMessage
                    id='errors.unexpected_crash.report_issue'
                    defaultMessage='Report issue'
                  />
                </Text>
              </Button>

            </div>
          </div>

          <Divider />

          <div className={[_s.default, _s.flexRow].join(' ')}>
            <Button
              icon='repost'
              onClick={this.handleRetry} size={64}
            >
              <Text align='center' color='inherit' className={_s.ml5}>
                {formatMessage(messages.retry)}
              </Text>
            </Button>
          </div>

        </div>
      </div>
    )
  }

}
