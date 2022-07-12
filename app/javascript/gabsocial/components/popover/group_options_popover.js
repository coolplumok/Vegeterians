import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { defineMessages, injectIntl } from 'react-intl'
import {
  MODAL_GROUP_CREATE,
  MODAL_GROUP_MEMBERS,
  MODAL_GROUP_REMOVED_ACCOUNTS,
} from '../../constants'
import {
  addShortcut,
  removeShortcut,
} from '../../actions/shortcuts'
import {
  makePrivateGroup,
  makePublicGroup
} from '../../actions/groups'
import { openModal } from '../../actions/modal'
import { closePopover } from '../../actions/popover'
import PopoverLayout from './popover_layout'
import List from '../list'

const messages = defineMessages({
  makePublic: { id: 'make_public', defaultMessage: 'Make Public' },
  makePrivate: { id: 'make_private', defaultMessage: 'Make Private' },
  groupMembers: { id: 'group_members', defaultMessage: 'Group members' },
  removedMembers: { id: 'group_removed_members', defaultMessage: 'Removed accounts' },
  editGroup: { id: 'edit_group', defaultMessage: 'Edit group' },
  add_to_shortcuts: { id: 'account.add_to_shortcuts', defaultMessage: 'Add to shortcuts' },
  remove_from_shortcuts: { id: 'account.remove_from_shortcuts', defaultMessage: 'Remove from shortcuts' },
})

const mapStateToProps = (state, { group }) => {
  const groupId = group ? group.get('id') : null
  const shortcuts = state.getIn(['shortcuts', 'items'])
  const isShortcut = !!shortcuts.find((s) => {
    return s.get('shortcut_id') == groupId && s.get('shortcut_type') === 'group'
  })
  return {
    isShortcut,
    isPrivated: group.get('is_privated')
  }
}

const mapDispatchToProps = (dispatch) => ({
  onOpenEditGroup(groupId) {
    dispatch(closePopover())
    dispatch(openModal(MODAL_GROUP_CREATE, { groupId }))
  },
  onOpenRemovedMembers(groupId) {
    dispatch(closePopover())
    dispatch(openModal(MODAL_GROUP_REMOVED_ACCOUNTS, { groupId }))
  },
  onOpenGroupMembers(groupId) {
    dispatch(closePopover())
    dispatch(openModal(MODAL_GROUP_MEMBERS, { groupId }))
  },
  onClosePopover: () => dispatch(closePopover()),
  onAddShortcut(groupId) {
    dispatch(addShortcut('group', groupId))
  },
  onRemoveShortcut(groupId) {
    dispatch(removeShortcut(null, 'group', groupId))
  },
  onMakePrivate(groupId) {
    dispatch(closePopover())
    dispatch(makePrivateGroup(groupId));
  },
  onMakePublic(groupId) {
    dispatch(closePopover())
    dispatch(makePublicGroup(groupId));
  },
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class GroupOptionsPopover extends ImmutablePureComponent {

  static defaultProps = {
    group: ImmutablePropTypes.map.isRequired,
    isAdmin: PropTypes.bool,
    isPrivated: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    isXS: PropTypes.bool,
    isShortcut: PropTypes.bool,
    onAddShortcut: PropTypes.func.isRequired,
    onRemoveShortcut: PropTypes.func.isRequired,
    onClosePopover: PropTypes.func.isRequired,
    onOpenEditGroup: PropTypes.func.isRequired,
    onOpenGroupMembers: PropTypes.func.isRequired,
    onOpenRemovedMembers: PropTypes.func.isRequired,
    onMakePrivate: PropTypes.func.isRequired,
    onMakePublic: PropTypes.func.isRequired,
  }

  handleEditGroup = () => {
    this.props.onOpenEditGroup(this.props.group.get('id'))
  }

  handleOnOpenRemovedMembers = () => {
    this.props.onOpenRemovedMembers(this.props.group.get('id'))
  }

  handleOnOpenGroupMembers = () => {
    this.props.onOpenGroupMembers(this.props.group.get('id'))
  }

  handleOnClosePopover = () => {
    this.props.onClosePopover()
  }

  handleOnToggleShortcut = () => {
    this.handleOnClosePopover()
    if (this.props.isShortcut) {
      this.props.onRemoveShortcut(this.props.group.get('id'))
    } else {
      this.props.onAddShortcut(this.props.group.get('id'))
    }
  }

  handleOnMakePrivate = () => {
    this.props.onMakePrivate(this.props.group.get('id'))
  }

  handleOnMakePublic = () => {
    this.props.onMakePublic(this.props.group.get('id'))
  }

  render() {
    const {
      intl,
      isAdmin,
      isPrivated,
      isShortcut,
      isXS,
    } = this.props

    let listItems = []
    if (isAdmin && !isPrivated) {
      listItems.push({
        hideArrow: true,
        icon: 'group',
        title: intl.formatMessage(messages.makePrivate),
        onClick: this.handleOnMakePrivate,
        isHidden: false,
      })
    }
    if (isAdmin && isPrivated) {
      listItems.push({
        hideArrow: true,
        icon: 'group',
        title: intl.formatMessage(messages.makePublic),
        onClick: this.handleOnMakePublic,
        isHidden: false,
      })
    }
    listItems = listItems.concat([
      {
        hideArrow: true,
        icon: 'group',
        title: intl.formatMessage(messages.groupMembers),
        onClick: this.handleOnOpenGroupMembers,
        isHidden: !isAdmin,
      },
      {
        hideArrow: true,
        icon: 'block',
        title: intl.formatMessage(messages.removedMembers),
        onClick: this.handleOnOpenRemovedMembers,
        isHidden: !isAdmin,
      },
      {
        hideArrow: true,
        icon: 'pencil',
        title: intl.formatMessage(messages.editGroup),
        onClick: this.handleEditGroup,
        isHidden: !isAdmin,
      },
      {
        hideArrow: true,
        icon: 'star',
        title: intl.formatMessage(isShortcut ? messages.remove_from_shortcuts : messages.add_to_shortcuts),
        onClick: this.handleOnToggleShortcut,
      },
    ])

    return (
      <PopoverLayout
        width={240}
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