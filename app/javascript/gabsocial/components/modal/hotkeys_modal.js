import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ModalLayout from './modal_layout'
import Text from '../text'
import Heading from '../heading'

const messages = defineMessages({
  heading: { id: 'keyboard_shortcuts.heading', defaultMessage: 'Keyboard Shortcuts' },
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  hotkey: { id: 'keyboard_shortcuts.hotkey', defaultMessage: 'Hotkey' },
  reply: { id: 'keyboard_shortcuts.reply', defaultMessage: 'reply' },
  mention: { id: 'keyboard_shortcuts.mention', defaultMessage: 'mention author' },
  profile: { id: 'keyboard_shortcuts.profile', defaultMessage: 'open author\'s profile' },
  favorite: { id: 'keyboard_shortcuts.favorite', defaultMessage: 'favorite' },
  boost: { id: 'keyboard_shortcuts.boost', defaultMessage: 'repost' },
  enter: { id: 'keyboard_shortcuts.enter', defaultMessage: 'open status' },
  toggle_hidden: { id: 'keyboard_shortcuts.toggle_hidden', defaultMessage: 'show/hide text behind CW' },
  toggle_sensitivity: { id: 'keyboard_shortcuts.toggle_sensitivity', defaultMessage: 'show/hide media' },
  up: { id: 'keyboard_shortcuts.up', defaultMessage: 'move up in the list' },
  down: { id: 'keyboard_shortcuts.down', defaultMessage: 'move down in the list' },
  column: { id: 'keyboard_shortcuts.column', defaultMessage: 'focus a status in one of the columns' },
  compose: { id: 'keyboard_shortcuts.compose', defaultMessage: 'focus the compose textarea' },
  post: { id: 'keyboard_shortcuts.post', defaultMessage: 'start a brand new post' },
  back: { id: 'keyboard_shortcuts.back', defaultMessage: 'navigate back' },
  search: { id: 'keyboard_shortcuts.search', defaultMessage: 'focus search' },
  unfocus: { id: 'keyboard_shortcuts.unfocus', defaultMessage: 'un-focus compose textarea/search' },
  home: { id: 'keyboard_shortcuts.home', defaultMessage: 'open home timeline' },
  notifications: { id: 'keyboard_shortcuts.notifications', defaultMessage: 'open notifications column' },
  start: { id: 'keyboard_shortcuts.start', defaultMessage: 'open "get started" column' },
  favorites: { id: 'keyboard_shortcuts.favorites', defaultMessage: 'open favorites list' },
  pinned: { id: 'keyboard_shortcuts.pinned', defaultMessage: 'open pinned posts list' },
  my_profile: { id: 'keyboard_shortcuts.my_profile', defaultMessage: 'open your profile' },
  blocked: { id: 'keyboard_shortcuts.blocked', defaultMessage: 'open blocked users list' },
  muted: { id: 'keyboard_shortcuts.muted', defaultMessage: 'open muted users list' },
  requests: { id: 'keyboard_shortcuts.requests', defaultMessage: 'open follow requests list' },
  legend: { id: 'keyboard_shortcuts.legend', defaultMessage: 'display this legend' },
})

export default
@injectIntl
class HotkeysModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  render() {
    const { intl, onClose } = this.props

    return (
      <ModalLayout
        title={intl.formatMessage(messages.heading)}
        onClose={onClose}
      >
        <div className={[_s.default, _s.flexRow].join(' ')}>
          <table>
            <thead>
              <tr>
                <th>
                  <Heading size='h4'>
                    {intl.formatMessage(messages.hotkey)}
                  </Heading>
                </th>
              </tr>
            </thead>
            <tbody>
              <HotKeysModalRow hotkey='r' action={intl.formatMessage(messages.reply)} />
              <HotKeysModalRow hotkey='m' action={intl.formatMessage(messages.mention)} />
              <HotKeysModalRow hotkey='p' action={intl.formatMessage(messages.profile)} />
              <HotKeysModalRow hotkey='f' action={intl.formatMessage(messages.favorite)} />
              <HotKeysModalRow hotkey='b' action={intl.formatMessage(messages.boost)} />
              <HotKeysModalRow hotkey='enter, o' action={intl.formatMessage(messages.enter)} />
              <HotKeysModalRow hotkey='x' action={intl.formatMessage(messages.toggle_hidden)} />
              <HotKeysModalRow hotkey='h' action={intl.formatMessage(messages.toggle_sensitivity)} />
              <HotKeysModalRow hotkey='up, k' action={intl.formatMessage(messages.up)} />
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>
                  <Heading size='h4'>
                    {intl.formatMessage(messages.hotkey)}
                  </Heading>
                </th>
              </tr>
            </thead>
            <tbody>
              <HotKeysModalRow hotkey='down, j' action={intl.formatMessage(messages.down)} />
              <HotKeysModalRow hotkey='1 - 9' action={intl.formatMessage(messages.column)} />
              <HotKeysModalRow hotkey='n' action={intl.formatMessage(messages.compose)} />
              <HotKeysModalRow hotkey='alt + n' action={intl.formatMessage(messages.post)} />
              <HotKeysModalRow hotkey='backspace' action={intl.formatMessage(messages.back)} />
              <HotKeysModalRow hotkey='s' action={intl.formatMessage(messages.search)} />
              <HotKeysModalRow hotkey='esc' action={intl.formatMessage(messages.unfocus)} />
              <HotKeysModalRow hotkey='g + h' action={intl.formatMessage(messages.home)} />
              <HotKeysModalRow hotkey='g + n' action={intl.formatMessage(messages.notifications)} />
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>
                  <Heading size='h4'>
                    {intl.formatMessage(messages.hotkey)}
                  </Heading>
                </th>
              </tr>
            </thead>
            <tbody>
              <HotKeysModalRow hotkey='g + s' action={intl.formatMessage(messages.start)} />
              <HotKeysModalRow hotkey='g + f' action={intl.formatMessage(messages.favorites)} />
              <HotKeysModalRow hotkey='g + p' action={intl.formatMessage(messages.pinned)} />
              <HotKeysModalRow hotkey='g + u' action={intl.formatMessage(messages.my_profile)} />
              <HotKeysModalRow hotkey='g + b' action={intl.formatMessage(messages.blocked)} />
              <HotKeysModalRow hotkey='g + m' action={intl.formatMessage(messages.muted)} />
              <HotKeysModalRow hotkey='g + r' action={intl.formatMessage(messages.requests)} />
              <HotKeysModalRow hotkey='?' action={intl.formatMessage(messages.legend)} />
            </tbody>
          </table>
        </div>
      </ModalLayout>
    )
  }

}

class HotKeysModalRow extends PureComponent {
  static propTypes = {
    hotkey: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
  }

  render() {
    const { hotkey, action } = this.props

    return (
      <tr>
        <td>
          <kbd>
            <Text size='small'>
              {hotkey}
            </Text>
          </kbd>
        </td>
        <td>
          <Text size='small'>
            {action}
          </Text>
        </td>
      </tr>
    )
  }
}
