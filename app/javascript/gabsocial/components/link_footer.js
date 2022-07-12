import {
  FormattedMessage,
  defineMessages,
  injectIntl,
} from 'react-intl'
import { openModal } from '../actions/modal'
import {
  repository,
  source_url,
  me,
} from '../initial_state'
import { DEFAULT_REL } from '../constants'
import Text from './text'
import Button from './button'

const messages = defineMessages({
  help: { id: 'getting_started.help', defaultMessage: 'Help' },
  invite: { id: 'getting_started.invite', defaultMessage: 'Invite people' },
  hotkeys: { id: 'navigation_bar.keyboard_shortcuts', defaultMessage: 'Hotkeys' },
  security: { id: 'getting_started.security', defaultMessage: 'Security' },
  about: { id: 'navigation_bar.info', defaultMessage: 'About' },
  developers: { id: 'getting_started.developers', defaultMessage: 'Developers' },
  terms: { id: 'getting_started.terms', defaultMessage: 'Terms of Service' },
  dmca: { id: 'getting_started.dmca', defaultMessage: 'Copyright' },
  salesTerms: { id: 'getting_started.terms_of_sale', defaultMessage: 'Terms of Sale' },
  privacy: { id: 'getting_started.privacy', defaultMessage: 'Privacy Policy' },
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
})

const mapDispatchToProps = (dispatch) => ({
  onOpenHotkeys() {
    dispatch(openModal('HOTKEYS'))
  },
})

export default
@connect(null, mapDispatchToProps)
@injectIntl
class LinkFooter extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onOpenHotkeys: PropTypes.func.isRequired,
  }

  render() {
    const { onOpenHotkeys, intl } = this.props

    const currentYear = new Date().getFullYear()

    const linkFooterItems = [
      {
        href: 'https://Vegeterians.network/help',
        text: intl.formatMessage(messages.help),
        requiresUser: true,
      },
      // : todo :
      // {
      //   onClick: onOpenHotkeys,
      //   text: intl.formatMessage(messages.hotkeys),
      //   requiresUser: true,
      // },
      {
        href: '/auth/edit',
        text: intl.formatMessage(messages.security),
        requiresUser: true,
      },
      {
        to: '/about',
        text: intl.formatMessage(messages.about),
      },
      {
        href: '/settings/applications',
        text: intl.formatMessage(messages.developers),
      },
      {
        to: '/about/tos',
        text: intl.formatMessage(messages.terms),
      },
      {
        to: '/about/copyright',
        text: intl.formatMessage(messages.dmca),
      },
      {
        to: '/about/sales',
        text: intl.formatMessage(messages.salesTerms),
      },
      {
        to: '/about/privacy',
        text: intl.formatMessage(messages.privacy),
      },
      {
        href: '/auth/sign_out',
        text: intl.formatMessage(messages.logout),
        requiresUser: true,
        logout: true,
      },
    ]

    return (
      <div className={[_s.default, _s.px10, _s.mb15].join(' ')}>
        <nav aria-label='Footer' role='navigation' className={[_s.default, _s.flexWrap, _s.flexRow].join(' ')}>
          {
            linkFooterItems.map((linkFooterItem, i) => {
              if (linkFooterItem.requiresUser && !me) return null

              return (
                <Button
                  isText
                  underlineOnHover
                  color='none'
                  backgroundColor='none'
                  key={`link-footer-item-${i}`}
                  to={linkFooterItem.to}
                  href={linkFooterItem.href}
                  data-method={linkFooterItem.logout ? 'delete' : null}
                  onClick={linkFooterItem.onClick || null}
                  className={[_s.mt5, _s.mb5, _s.pr15].join(' ')}
                >
                  <Text size='small' color='tertiary'>
                    {linkFooterItem.text}
                  </Text>
                </Button>
              )
            })
          }
        </nav>

        <Text size='small' color='tertiary' className={_s.mt10}>
          © {currentYear} Vegeterians Network Inc.
        </Text>

        <Text size='small' color='tertiary' tagName='p' className={_s.mt10}>
          <FormattedMessage
            id='getting_started.open_source_notice'
            defaultMessage='Vegeterians.live is open source software. You can contribute or report issues on our self-hosted GitLab at {gitlab}.'
            values={{
              gitlab: (
                <a href={source_url} className={_s.inherit} rel={DEFAULT_REL} target='_blank'>
                  {repository}
                </a>
              )
            }}
          />
        </Text>
      </div>
    )
  }

}
