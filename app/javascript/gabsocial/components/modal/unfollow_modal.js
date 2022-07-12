import { FormattedMessage } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { unfollowAccount } from '../../actions/accounts'
import ConfirmationModal from './confirmation_modal'

const mapDispatchToProps = (dispatch) => ({
  onConfirm(accountId) {
    dispatch(unfollowAccount(accountId))
  },
})

export default
@connect(null, mapDispatchToProps)
class UnfollowModal extends ImmutablePureComponent {

  static propTypes = {
    isSubmitting: PropTypes.bool.isRequired,
    account: ImmutablePropTypes.map.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  handleClick = () => {
    this.props.onClose()
    this.props.onConfirm(this.props.account.get('id'))
  }

  handleCancel = () => {
    this.props.onClose()
  }

  render() {
    const { account } = this.props

    return (
      <ConfirmationModal
        title={`Unfollow @${account.get('acct')}`}
        message={<FormattedMessage id='confirmations.unfollow.message' defaultMessage='Are you sure you want to unfollow {name}?' values={{ name: <strong>@{account.get('acct')}</strong> }} />}
        confirm={<FormattedMessage id='confirmations.unfollow.confirm' defaultMessage='Unfollow' />}
        onClose={this.handleCancel}
        onConfirm={this.handleClick}
      />
    )
  }

}
