import { FormattedMessage } from 'react-intl'
import {
  source_url,
  version,
} from '../initial_state'
import {
  APP_NAME,
  DEFAULT_REL,
} from '../constants'
import Button from './button'
import DotTextSeperator from './dot_text_seperator'
import Divider from './divider'
import Icon from './icon'
import Text from './text'

export default class ErrorBoundary extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
  }

  state = {
    hasError: false,
    stackTrace: undefined,
    componentStack: undefined,
    copied: false,
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: true,
      stackTrace: error.stack,
      componentStack: info && info.componentStack,
      copied: false,
    })
  }

  handleCopyStackTrace = () => {
    const { stackTrace } = this.state;
    const textarea = document.createElement('textarea');

    textarea.textContent = stackTrace;
    textarea.style.position = 'fixed';

    document.body.appendChild(textarea);

    try {
      textarea.select();
      document.execCommand('copy');
    } catch (e) {
      //
    }

    document.body.removeChild(textarea);

    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 700);
  }

  render() {
    const { hasError, copied } = this.state

    if (!hasError) return this.props.children

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
            <FormattedMessage
              id='error.unexpected_crash.explanation'
              defaultMessage='Due to a bug in our code or a browser compatibility issue, this page or feature could not be displayed correctly.'
            />
          </Text>

          <Text size='medium' className={_s.mt10}>
            <FormattedMessage
              id='error.unexpected_crash.next_steps'
              defaultMessage='Try refreshing the page or trying the action again. If that does not help, you may still be able to use Vegeterians.live through a different browser or native app.'
            />
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

              <DotTextSeperator />

              <Button
                isText
                backgroundColor='tertiary'
                color='primary'
                onClick={this.handleCopyStackTrace}
                radiusSmall
                className={[_s.ml5, _s.py2, _s.px10].join(' ')}
              >
                <Text color='inherit'>
                  <FormattedMessage
                    id='errors.unexpected_crash.copy_stacktrace'
                    defaultMessage='Copy error to clipboard'
                  />
                </Text>
              </Button>
            </div>
          </div>

          <Divider />

          <div className={[_s.default, _s.flexRow].join(' ')}>
            <Button href='/home'>
              <Text align='center' color='inherit'>
                <FormattedMessage
                  id='return_home'
                  defaultMessage='Return Home'
                />
              </Text>
            </Button>
          </div>

        </div>
      </div>
    )
  }

}
