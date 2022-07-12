import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { me, favouritesCount } from '../../initial_state'
import { shortNumberFormat } from '../../utils/numbers'
import PanelLayout from './panel_layout'
import UserStat from '../user_stat'
import Dummy from '../dummy'
import ResponsiveClassesComponent from '../../features/ui/util/responsive_classes_component'

const messages = defineMessages({
  posts: { id: 'account.posts', defaultMessage: 'Posts' },
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Following' },
  likes: { id: 'likes', defaultMessage: 'Likes' },
})

export default
@injectIntl
class ProfileStatsPanel extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
    noPanel: PropTypes.bool,
  }

  render() {
    const {
      intl,
      account,
      noPanel
    } = this.props

    if (!account) return null

    const Wrapper = noPanel ? Dummy : PanelLayout

    return (
      <Wrapper>
        {
          !!account &&
          <ResponsiveClassesComponent
            classNames={[_s.default, _s.flexRow].join(' ')}
            classNamesXS={[_s.default, _s.flexRow, _s.mt15, _s.pt10].join(' ')}
          >
            <UserStat
              title={intl.formatMessage(messages.posts)}
              value={shortNumberFormat(account.get('statuses_count'))}
              to={`/${account.get('acct')}`}
              isCentered={noPanel}
            />
            <UserStat
              title={intl.formatMessage(messages.followers)}
              value={shortNumberFormat(account.get('followers_count'))}
              to={`/${account.get('acct')}/followers`}
              isCentered={noPanel}
            />
            <UserStat
              title={intl.formatMessage(messages.follows)}
              value={shortNumberFormat(account.get('following_count'))}
              to={`/${account.get('acct')}/following`}
              isCentered={noPanel}
            />
            {
              account.get('id') === me &&
              <UserStat
                title={intl.formatMessage(messages.likes)}
                value={shortNumberFormat(favouritesCount)}
                to={`/${account.get('acct')}/likes`}
                isCentered={noPanel}
              />
            }
          </ResponsiveClassesComponent>
        }
      </Wrapper>
    )
  }
}
