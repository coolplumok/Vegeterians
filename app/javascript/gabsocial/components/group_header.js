import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import { openPopover, closePopover } from '../actions/popover'
import { openModal } from '../actions/modal'
import { joinGroup, leaveGroup } from '../actions/groups'
import {
  PLACEHOLDER_MISSING_HEADER_SRC,
  BREAKPOINT_EXTRA_SMALL,
  MODAL_GROUP_INVITE_FOLLOWERS,
} from '../constants'
import { me } from '../initial_state'
import Responsive from '../features/ui/util/responsive_component'
import Button from './button'
import Block from './block'
import Image from './image'
import TabBar from './tab_bar'
import Text from './text'

const messages = defineMessages({
  join: { id: 'groups.join', defaultMessage: 'Join group' },
  leave: { id: 'groups.leave', defaultMessage: 'Leave group' },
  invite: { id: 'groups.invite', defaultMessage: 'Invite to group' },
  removed_accounts: { id: 'groups.removed_accounts', defaultMessage: 'Removed Accounts' },
  group_archived: { id: 'group.detail.archived_group', defaultMessage: 'Archived group' },
  group_admin: { id: 'groups.detail.role_admin', defaultMessage: 'You\'re an admin' }
})

const mapDispatchToProps = (dispatch, { intl }) => ({

  onToggleMembership(group, relationships) {
    if (relationships.get('member')) {
      dispatch(leaveGroup(group.get('id')));
    } else {
      dispatch(joinGroup(group.get('id')));
    }
  },

  onOpenGroupOptions(targetRef, group, isAdmin) {
    dispatch(openPopover('GROUP_OPTIONS', {
      targetRef,
      group,
      isAdmin,
      position: 'left',
    }))
  },

  onOpenInviteFollowers(group) {
    const groupId = group.get('id')
    dispatch(openModal(MODAL_GROUP_INVITE_FOLLOWERS, { groupId } ));
  },

});

export default
@connect(null, mapDispatchToProps)
@injectIntl
class GroupHeader extends ImmutablePureComponent {

  static propTypes = {
    group: ImmutablePropTypes.map,
    children: PropTypes.any,
    intl: PropTypes.object.isRequired,
    onToggleMembership: PropTypes.func.isRequired,
    onOpenGroupOptions: PropTypes.func.isRequired,
    onOpenInviteFollowers: PropTypes.func.isRequired,
    relationships: ImmutablePropTypes.map,
  }

  handleOnToggleMembership = () => {
    const { group, relationships } = this.props
    this.props.onToggleMembership(group, relationships);
  }
  
  handleOpenInviteFollowers = () => {
    const { group } = this.props
    this.props.onOpenInviteFollowers(group);
  }

  handleOnTogglePrivate = () => {
    const { group, relationships } = this.props
    this.props.onTogglePrivate(group, relationships);
  }

  handleOnOpenGroupOptions = () => {
    const { relationships } = this.props
    const isAdmin = relationships ? relationships.get('admin') : false
    this.props.onOpenGroupOptions(this.infoBtn, this.props.group, isAdmin)
  }

  setInfoBtn = (c) => {
    this.infoBtn = c;
  }

  render() {
    const {
      children,
      group,
      intl,
      relationships,
    } = this.props

    const tabs = !group ? null : [
      {
        to: `/groups/${group.get('id')}/${group.get('title').split(" ").join("-")}`,
        title: 'Latest',
      },
    ]

    const coverSrc = !!group ? group.get('cover_image_url') : ''
    const coverSrcMissing = coverSrc.indexOf(PLACEHOLDER_MISSING_HEADER_SRC) > -1 || !coverSrc
    const title = !!group ? group.get('title') : undefined
    
    let isAdmin = false
    let actionButtonTitle
    let actionButtonOptions = {}
    let inviteButtonTitle
    if (relationships) {
      isAdmin = relationships.get('admin')
      const isMember = relationships.get('member')
      actionButtonTitle = intl.formatMessage(!isMember ? messages.join : messages.leave)
      inviteButtonTitle = isMember && intl.formatMessage(messages.invite)
      if (isMember) {
        actionButtonOptions = {
          backgroundColor: 'danger',
          color: 'white',
        }
      }
    }

    // : todo :
    // {group.get('archived') && <Icon id='lock' title={intl.formatMessage(messages.group_archived)} />}

    return (
      <div className={[_s.default, _s.z1, _s.width100PC, _s.mb15].join(' ')}>
        <Responsive max={BREAKPOINT_EXTRA_SMALL}>
          <div className={[_s.default, _s.boxShadowBlock, _s.bgPrimary].join(' ')}>
            <div className={[_s.default, _s.width100PC].join(' ')}>

              {
                coverSrc && !coverSrcMissing &&
                <Image className={_s.height200PX} src={coverSrc} alt={title} />
              }

              <div className={[_s.default, _s.width100PC].join(' ')}>

                <div className={[_s.default, _s.width100PC, _s.px15, _s.mt10, _s.py10].join(' ')}>
                  {children}
                </div>

                <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.borderTop1PX, _s.borderColorSecondary, _s.mt5, _s.pt15, _s.height100PC, _s.px15].join(' ')}>
                  {
                    !!actionButtonTitle &&
                    <Button
                      radiusSmall
                      className={_s.mr5}
                      onClick={this.handleOnToggleMembership}
                      {...actionButtonOptions}
                    >
                      <Text color='inherit' size='small' className={_s.px10}>
                        {actionButtonTitle}
                      </Text>
                    </Button>
                  }

                  {
                    !!inviteButtonTitle &&
                    <Button
                      radiusSmall
                      color='white'
                      backgroundColor='brand'
                      className={_s.mr5}
                      onClick={this.handleOpenInviteFollowers}
                    >
                      <Text color='inherit' size='small' className={_s.px10}>
                        {inviteButtonTitle}
                      </Text>
                    </Button>
                  }

                  {
                    isAdmin &&
                    <Button
                      radiusSmall
                      color='primary'
                      backgroundColor='tertiary'
                      className={_s.mr5}
                      icon='ellipsis'
                      onClick={this.handleOnOpenGroupOptions}
                      buttonRef={this.setInfoBtn}
                    />
                  }
                </div>

                <div className={[_s.default, _s.flexRow, _s.height100PC, _s.mt15, _s.pt10, _s.px10].join(' ')}>

                  <TabBar tabs={tabs} />

                </div>
              </div>
            </div>
          </div>
        </Responsive>

        { /** desktop */}
        <Responsive min={BREAKPOINT_EXTRA_SMALL}>
          <Block>
            <div className={[_s.default, _s.width100PC].join(' ')}>

              {
                coverSrc && !coverSrcMissing &&
                <Image className={_s.height350PX} src={coverSrc} alt={title} />
              }

              <div className={[_s.default, _s.height53PX, _s.width100PC].join(' ')}>
                <div className={[_s.default, _s.flexRow, _s.height100PC, _s.px10].join(' ')}>
                  <TabBar tabs={tabs} />
                  <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.height100PC, _s.mlAuto].join(' ')}>
                    {
                      !!actionButtonTitle &&
                      <Button
                        radiusSmall
                        className={_s.mr5}
                        onClick={this.handleOnToggleMembership}
                        {...actionButtonOptions}
                      >
                        <Text color='inherit' size='small' className={_s.px10}>
                          {actionButtonTitle}
                        </Text>
                      </Button>
                    }

                    {
                      !!inviteButtonTitle &&
                      <Button
                        radiusSmall
                        color='white'
                        backgroundColor='brand'
                        className={_s.mr5}
                        onClick={this.handleOpenInviteFollowers}
                      >
                        <Text color='inherit' size='small' className={_s.px10}>
                          {inviteButtonTitle}
                        </Text>
                      </Button>
                    }

                    {
                      !!me &&
                      <Button
                        radiusSmall
                        color='primary'
                        backgroundColor='tertiary'
                        className={_s.mr5}
                        icon='ellipsis'
                        onClick={this.handleOnOpenGroupOptions}
                        buttonRef={this.setInfoBtn}
                      />
                    }
                  </div>
                </div>
              </div>
            </div>
          </Block>
        </Responsive>
      </div>
    )
  }

}