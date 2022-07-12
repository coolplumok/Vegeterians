import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { injectIntl, defineMessages } from 'react-intl'
import { CX } from '../constants'
import Avatar from './avatar'
import DisplayName from './display_name'
import Button from './button'
import Heading from './heading'
import Text from './text'
import List from './list'
import { closeSidebar } from '../actions/sidebar'
import { openModal } from '../actions/modal'
import { shortNumberFormat } from '../utils/numbers'
import { me } from '../initial_state'
import { makeGetAccount } from '../selectors'
import ProgressPanel from './panel/progress_panel'

const messages = defineMessages({
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Following' },
  profile: { id: 'account.profile', defaultMessage: 'Profile' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  follow_requests: { id: 'navigation_bar.follow_requests', defaultMessage: 'Follow requests' },
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Muted users' },
  filters: { id: 'navigation_bar.filters', defaultMessage: 'Muted words' },
  logout: { id: 'navigation_bar.logout', defaultMessage: 'Logout' },
  lists: { id: 'column.lists', defaultMessage: 'Lists', },
  apps: { id: 'tabs_bar.apps', defaultMessage: 'Apps' },
  more: { id: 'sidebar.more', defaultMessage: 'More' },
  pro: { id: 'promo.Vegeterians_pro', defaultMessage: 'Upgrade to VegeteriansPRO' },
  proplus: { id: 'promo.Vegeterians_proplus', defaultMessage: 'Upgrade to VegeteriansProPlus' },
  trends: { id: 'promo.trends', defaultMessage: 'Vegeterians.News' },
  search: { id: 'tabs_bar.search', defaultMessage: 'Search' },
  shop: { id: 'tabs_bar.shop', defaultMessage: 'Store - Buy Merch' },
  chat: { id: 'tabs_bar.chat', defaultMessage: 'Chat' },
  help: { id: 'getting_started.help', defaultMessage: 'Help' },
  display: { id: 'display_options', defaultMessage: 'Display Options' },
  expertFeed: { id: 'expert_feed', defaultMessage: 'Expert Feed' },
  shortcuts: { id: 'shortcuts', defaultMessage: 'Shortcuts' },
})

const mapStateToProps = (state) => ({
  account: makeGetAccount()(state, me),
  sidebarOpen: state.get('sidebar').open,
})

const mapDispatchToProps = (dispatch) => ({
  onCloseSidebar: () => dispatch(closeSidebar()),
  onOpenDisplayModel() {
    dispatch(closeSidebar())
    dispatch(openModal('DISPLAY_OPTIONS'))
  }
})

export default @connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class SidebarXS extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map,
    sidebarOpen: PropTypes.bool,
    onCloseSidebar: PropTypes.func.isRequired,
    onOpenDisplayModel: PropTypes.func.isRequired,
  }

  componentDidUpdate () {
    if (!me) return

    if (this.props.sidebarOpen) {
      document.body.classList.add(_s.overflowYHidden)
    } else {
      document.body.classList.remove(_s.overflowYHidden)
    }
  }

  handleSidebarClose = () => {
    this.props.onCloseSidebar()
  }

  render () {
    const { sidebarOpen, intl, account } = this.props

    if (!me || !account) return null

    const acct = account.get('acct')
    const isPro = account.get('is_pro')

    const mainItems = [
      {
        to: `/${acct}`,
        onClick: this.handleSidebarClose,
        title: intl.formatMessage(messages.profile),
      },
      {
        icon: 'list',
        to: '/lists',
        onClick: this.handleSidebarClose,
        title: intl.formatMessage(messages.lists),
      },
      {
        icon: 'star',
        to: '/shortcuts',
        onClick: this.handleSidebarClose,
        title: intl.formatMessage(messages.shortcuts),
      },
      {
        icon: 'pro',
        href: 'https://Vegeterians.network',
        onClick: this.handleSidebarClose,
        title: intl.formatMessage(messages.pro),
      },
      {
        icon: 'search',
        to: '/search',
        onClick: this.handleSidebarClose,
        title: intl.formatMessage(messages.search),
      },
      {
        icon: 'circle',
        to: '/timeline/expert',
        onClick: this.handleSidebarClose,
        title: intl.formatMessage(messages.expertFeed),
      },
      {
        icon: 'cog',
        href: '/settings/preferences',
        onClick: this.handleSidebarClose,
        title: intl.formatMessage(messages.preferences),
      },
      // {
      //   icon: 'group',
      //   to: '/follow_requests',
      //   onClick: this.handleSidebarClose,
      //   title: intl.formatMessage(messages.follow_requests),
      // },
      {
        icon: 'block',
        to: '/settings/blocks',
        onClick: this.handleSidebarClose,
        title: intl.formatMessage(messages.blocks),
      },
      {
        icon: 'audio-mute',
        to: '/settings/mutes',
        onClick: this.handleSidebarClose,
        title: intl.formatMessage(messages.mutes),
      },
      // {
      //   icon: 'report',
      //   to: '/filters',
      //   onClick: this.handleSidebarClose,
      //   title: intl.formatMessage(messages.filters),
      // },
      {
        onClick: this.props.onOpenDisplayModel, //on open display model
        title: intl.formatMessage(messages.display),
      },
      {
        href: 'https://Vegeterians.network/help',
        onClick: this.handleSidebarClose,
        title: intl.formatMessage(messages.help),
      },
      {
        href: '/auth/sign_out',
        title: intl.formatMessage(messages.logout),
      },
    ]

    const containerClasses = CX({
      default: 1,
      posFixed: 1,
      top0: 1,
      left0: 1,
      right0: 1,
      bottom0: 1,
      z5: 1,
      displayNone: !sidebarOpen,
    })

    return (
      <div className={containerClasses}>
        <div className={[_s.default, _s.posFixed, _s.top0, _s.left0, _s.right0, _s.bgBlackOpaque, _s.bottom0].join(' ')} role='button' onClick={this.handleSidebarClose} />
        <div className={[_s.defaut, _s.posFixed, _s.left0, _s.top0, _s.bottom0, _s.bgPrimary, _s.saveAreaInsetPT, _s.saveAreaInsetPB, _s.saveAreaInsetPL, _s.minWidth330PX, _s.borderRight1PX, _s.borderColorSecondary, _s.maxWidth80PC].join(' ')}>

          <div className={[_s.default, _s.flexRow, _s.px15, _s.height53PX, _s.width100PC, _s.borderBottom1PX, _s.borderColorSecondary, _s.alignItemsCenter, _s.justifyContentCenter].join(' ')}>
            <Heading size='h2'>Account Info</Heading>
            <Button
              title='close'
              color='secondary'
              backgroundColor='none'
              onClick={this.handleSidebarClose}
              icon='close'
              iconSize='12px'
              className={_s.mlAuto}
            />
          </div>

          <div className={[_s.default, _s.width100PC, _s.overflowYScroll, _s.heightCalc53PX].join(' ')}>

            <div className={[_s.default, _s.width100PC, _s.px15, _s.py10].join(' ')}>
              <div className={[_s.default, _s.mt5].join(' ')}>
                <Link
                  to={`/${acct}`}
                  title={acct}
                  onClick={this.handleSidebarClose}
                >
                  <Avatar account={account} size={60} />
                </Link>
              </div>
              <div className={[_s.default, _s.my10, _s.width100PC].join(' ')}>
                <DisplayName account={account} isMultiline />
              </div>

              <div className={[_s.default, _s.flexRow, _s.flexWrap].join(' ')}>
                <NavLink
                  to={`/${acct}/followers`}
                  onClick={this.handleSidebarClose}
                  title={intl.formatNumber(account.get('followers_count'))}
                  className={[_s.text, _s.noUnderline, _s.underline_onHover, _s.mr15].join(' ')}
                >
                  <Text weight='bold'>{shortNumberFormat(account.get('followers_count'))}&nbsp;</Text>
                  <Text>{intl.formatMessage(messages.followers)}</Text>
                </NavLink>
                <NavLink
                  to={`/${acct}/following`}
                  onClick={this.handleSidebarClose}
                  title={intl.formatNumber(account.get('following_count'))}
                  className={[_s.text, _s.noUnderline, _s.underline_onHover].join(' ')}
                >
                  <Text weight='bold'>{shortNumberFormat(account.get('following_count'))}&nbsp;</Text>
                  <Text>{intl.formatMessage(messages.follows)}</Text>
                </NavLink>
              </div>

            </div>

            <div className={[_s.default, _s.my10, _s.px15].join(' ')}>
              <ProgressPanel />
            </div>

            <div className={[_s.default, _s.mb15, _s.boxShadowNone].join(' ')}>
              <List
                items={mainItems}
                size='large'
              />
            </div>

          </div>
        </div>
      </div>
    )
  }

}
