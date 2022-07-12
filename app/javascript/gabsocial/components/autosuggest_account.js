import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { makeGetAccount } from '../selectors'
import Avatar from './avatar'
import DisplayName from './display_name'

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount()

  const mapStateToProps = (state, { id }) => ({
    account: getAccount(state, id),
  })

  return mapStateToProps
}

export default
@connect(makeMapStateToProps)
class AutosuggestAccount extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
  }

  render () {
    const { account } = this.props

    return (
      <div
        className={[_s.default, _s.cursorPointer, _s.bgSubtle_onHover, _s.flexRow, _s.py10, _s.alignItemsCenter, _s.px10, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}
        title={account.get('acct')}
      >
        <Avatar account={account} size={26} />
        <div className={_s.ml10}>
          <DisplayName account={account} noRelationship noHover />
        </div>
      </div>
    )
  }

}
