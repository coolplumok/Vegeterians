import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { NavLink } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { makeGetAccount } from '../../selectors'
import { shortNumberFormat } from '../../utils/numbers'
import { me } from '../../initial_state'
import PopoverLayout from './popover_layout'
import AccountActionButton from '../account_action_button'
import Avatar from '../avatar'
import DisplayName from '../display_name'
import Text from '../text'

const mapStateToProps = (state, props) => ({
  account: makeGetAccount()(state, props.accountId),
})

export default
@connect(mapStateToProps)
class UserInfoPopover extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    accountId: PropTypes.string.isRequired,
    isXS: PropTypes.bool,
  }

  render() {
    const { account, isXS } = this.props

    if (isXS || !me) return null
    
    const content = !account ? null : { __html: account.get('note_emojified') }
    const to = !account ? '' : `/${account.get('acct')}`

    return (
      <PopoverLayout width={280}>
        <div className={[_s.default, _s.width100PC, _s.px15, _s.py15].join(' ')} id='user-info-popover'>
          
          <div className={[_s.default, _s.flexRow].join(' ')}>
            <NavLink
              to={to}
              className={[_s.default, _s.noUnderline, _s.flexGrow1].join(' ')}
            >
              <Avatar account={account} size={42} noHover />
              <DisplayName account={account} isMultiline noHover />
            </NavLink>

            <div className={[_s.default, _s.mlAuto, _s.right0, _s.posAbs, _s.mt5].join(' ')}>
              <AccountActionButton account={account} />
            </div>
          </div>

          <div className={[_s.default, _s.mt10].join(' ')}>
            <div className={_s.dangerousContent} dangerouslySetInnerHTML={content} />
          </div>

          <div className={[_s.default, _s.flexRow, _s.mt10].join(' ')}>
            <NavLink
              to={`${to}/followers`}
              className={[_s.default, _s.flexRow, _s.mr10, _s.noUnderline, _s.colorPrimary, _s.underline_onHover].join(' ')}
            >
              <Text weight='extraBold' color='primary'>
                {shortNumberFormat(account.get('followers_count'))}&nbsp;
              </Text>
              <Text color='secondary'>
                <FormattedMessage id='account.followers' defaultMessage='Followers' />
              </Text>
            </NavLink>
            <NavLink
              to={`${to}/following`}
              className={[_s.default, _s.flexRow, _s.noUnderline, _s.colorPrimary, _s.underline_onHover].join(' ')}
            >
              <Text weight='extraBold' color='primary'>
                {shortNumberFormat(account.get('following_count'))}&nbsp;
              </Text>
              <Text color='secondary'>
                <FormattedMessage id='account.follows' defaultMessage='Following' />
              </Text>
            </NavLink>
          </div>

        </div>
      </PopoverLayout>
    )
  }
}