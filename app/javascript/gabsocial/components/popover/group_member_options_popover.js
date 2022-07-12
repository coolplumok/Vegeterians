import ImmutablePropTypes from 'react-immutable-proptypes'
import { closePopover } from '../../actions/popover'
import {
	updateRole,
	createRemovedAccount,
} from '../../actions/groups'
import { makeGetAccount } from '../../selectors'
import { me } from '../../initial_state';
import PopoverLayout from './popover_layout'
import List from '../list'

const makeMapStateToProps = (state, props) => ({
  account: makeGetAccount()(state, props.accountId),
})

const mapDispatchToProps = (dispatch) => ({
  onUpdateRole(groupId, accountId, type) {
    dispatch(closePopover())
    dispatch(updateRole(groupId, accountId, type))
  },
  onCreateRemovedAccount(groupId, accountId) {
    dispatch(closePopover())
    dispatch(createRemovedAccount(groupId, accountId))
  },
  onClosePopover:() => dispatch(closePopover()),
})

export default
@connect(makeMapStateToProps, mapDispatchToProps)
class GroupMemberOptionsPopover extends PureComponent {

  static defaultProps = {
    account: ImmutablePropTypes.map.isRequired,
    accountId: PropTypes.string.isRequired,
    groupId: PropTypes.string.isRequired,
    isXS: PropTypes.bool,
    onClosePopover: PropTypes.func.isRequired,
    onCreateRemovedAccount: PropTypes.func.isRequired,
    onUpdateRole: PropTypes.func.isRequired,
    isModerator: PropTypes.bool,
  }

  handleOnRemoveFromGroup = () => {
	  this.props.onCreateRemovedAccount(this.props.groupId, this.props.accountId)
  }

  handleOnUpdateRole = (role) => {
    this.props.onUpdateRole(this.props.groupId, this.props.accountId, role)
  }

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  render() {
    const { account, accountId, isModerator, isXS } = this.props

    const group_admin = account.get('group_admin')
    const group_moderator = account.get('group_moderator')
    let removeable = true
    if (me === accountId) {
      removeable = false
    } else {
      if (isModerator) {
        if (group_admin || group_moderator) {
          removeable = false
        }
      }
    }

    const listItems = []
    if (removeable) {
      listItems.push({
        hideArrow: true,
        icon: 'block',
        title: 'Remove from group',
        onClick: this.handleOnRemoveFromGroup,
      })
    }

    if (!group_moderator && !isModerator) {
      listItems.push({
        hideArrow: true,
        icon: 'group',
        title: 'Make group moderator',
        onClick: () => this.handleOnUpdateRole('moderator'),
      })
    }

    if (!isModerator) {
      if (!group_admin) {
        listItems.push({
          hideArrow: true,
          icon: 'group',
          title: 'Make group admin',
          onClick: () => this.handleOnUpdateRole('admin'),
        })
      }
    }

    if (group_admin || group_moderator) {
      listItems.push({
        hideArrow: true,
        icon: 'group',
        title: 'Make group user',
        onClick: () => this.handleOnUpdateRole(''),
      })
    }

    return (
      <PopoverLayout
        width={210}
        isXS={isXS}
        onClose={this.handleOnClosePopover}
      >
        <List
          scrollKey='group_options'
          items={listItems}
          size={isXS ? 'large' : 'small'}
        />
      </PopoverLayout>
    )
  }

}