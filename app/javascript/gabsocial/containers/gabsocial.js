'use strict'

import { Provider } from 'react-redux'
import configureStore from '../store/configureStore'
import { BrowserRouter, Route } from 'react-router-dom'
import moment from 'moment-mini'
import { ScrollContext } from 'react-router-scroll-4'
import { IntlProvider, addLocaleData } from 'react-intl'
import { fetchCustomEmojis } from '../actions/custom_emojis'
import { hydrateStore } from '../actions/store'
import { openModal } from '../actions/modal'
import { MIN_ACCOUNT_CREATED_AT_ONBOARDING, MODAL_NOTIFY_EDIT_PROFILE } from '../constants'
import {
  connectUserStream,
  connectStatusUpdateStream,
} from '../actions/streaming'
import { getLocale } from '../locales'
import initialState from '../initial_state'
import { me, isFirstSession } from '../initial_state'
import UI from '../features/ui'
import IntroductionPage from '../pages/introduction_page'
import ErrorBoundary from '../components/error_boundary'
import Display from './display'

const { localeData, messages } = getLocale()
addLocaleData(localeData)

export const store = configureStore()
const hydrateAction = hydrateStore(initialState)

store.dispatch(hydrateAction)
store.dispatch(fetchCustomEmojis())

const mapStateToProps = (state) => {
  const avatar_static = state.getIn(['accounts', me, 'avatar_static'])
  const header_static = state.getIn(['accounts', me, 'header_static'])
  const note_plain = state.getIn(['accounts', me, 'note_plain'])
  let profileEmpty = false
  if (!avatar_static) {
    profileEmpty = true
  } else {
    if (avatar_static.slice(-20) == 'original/missing.png') {
      profileEmpty = true
    }
  }
  if (!header_static) {
    profileEmpty = true
  } else {
    if (header_static.slice(-20) == 'original/missing.png') {
      profileEmpty = true
    }
  }
  if (!note_plain) {
    profileEmpty = true
  }
  

  return {
    accountCreatedAt: !!me ? state.getIn(['accounts', me, 'created_at']) : undefined,
    shownOnboarding: state.getIn(['settings', 'shownOnboarding']),
    profileEmpty: profileEmpty,
  }
}

const mapDispatchToProps = (dispatch) => ({
  onOpenNotifyEditProfileModal() {
    setTimeout(function() {
      dispatch(openModal(MODAL_NOTIFY_EDIT_PROFILE))
    }, 100)
  },
})

@connect(mapStateToProps, mapDispatchToProps)
class GabSocialMount extends PureComponent {

  static propTypes = {
    shownOnboarding: PropTypes.bool.isRequired,
    accountCreatedAt: PropTypes.string,
    onOpenNotifyEditProfileModal: PropTypes.func.isRequired,
    profileEmpty: PropTypes.bool,
  }

  state = {
    shownOnboarding: this.props.shownOnboarding,
    shouldShow: false,
  }

  componentDidMount() {
    if (!!me && this.props.accountCreatedAt) {
      //If first time opening app, and is new user, show onboarding
      const accountCreatedAtValue = moment(this.props.accountCreatedAt).valueOf()
      const shouldShow = isFirstSession && !this.state.shownOnboarding && accountCreatedAtValue > MIN_ACCOUNT_CREATED_AT_ONBOARDING

      if (shouldShow) this.setState({ shouldShow })

      let d = new Date()
      d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000))
      let expires = "expires="+ d.toUTCString()
      let cookieSetValue = ''
      if (!this.state.shownOnboarding && shouldShow) {
        cookieSetValue = 'no'
      } else {
        if (this.props.profileEmpty) {
          let cookieValue = ''
          let name = "_gabsocial_profilenotify=";
          let decodedCookie = decodeURIComponent(document.cookie);
          let ca = decodedCookie.split(';')
          for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
              c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
              cookieValue = c.substring(name.length, c.length)
            }
          }

          if (cookieValue != 'yes') {
            cookieSetValue = 'yes'
          }
        }
      }

      if (cookieSetValue) {
        document.cookie = '_gabsocial_profilenotify=' + cookieSetValue + ';' + expires + ';path=/'

        if (cookieSetValue == 'yes') {
          setTimeout(() => this.props.onOpenNotifyEditProfileModal(), 60000)
        }
      }
    }
  }

  render () {
    const { shownOnboarding, shouldShow } = this.state

    if (!shownOnboarding && shouldShow) {
      return (
        <BrowserRouter>
          <Route path='/' component={IntroductionPage} />
        </BrowserRouter>
      )
    }

    return (
      <BrowserRouter>
        <ScrollContext>
          <Route path='/' component={UI} />
        </ScrollContext>
      </BrowserRouter>
    )
  }

}

export default class GabSocial extends PureComponent {

  static propTypes = {
    locale: PropTypes.string.isRequired,
  }

  componentDidMount() {
    if (!!me) {
      this.disconnect = store.dispatch(connectUserStream())
      store.dispatch(connectStatusUpdateStream())
    }

    console.log('%c Vegeterians Social ', [
      , 'color: #30CE7D'
      , 'display: block'
      , 'line-height: 80px'
      , 'font-family: system-ui, -apple-system, BlinkMacSystemFont, Roboto, Ubuntu, "Helvetica Neue", sans-serif'
      , 'font-size: 36px'
      , 'text-align: center'
      , 'font-weight: bold'
    ].join(';'))
  }

  componentWillUnmount () {
    if (this.disconnect) {
      this.disconnect()
      this.disconnect = null
    }
  }

  render () {
    const { locale } = this.props

    return (
      <IntlProvider locale={locale} messages={messages}>
        <Provider store={store}>
          <Display>
            <ErrorBoundary>
              <GabSocialMount />
            </ErrorBoundary>
          </Display>
        </Provider>
      </IntlProvider>
    )
  }

}