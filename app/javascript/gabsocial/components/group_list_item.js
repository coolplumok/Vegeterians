import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { defineMessages, injectIntl } from 'react-intl'
import { openModal } from '../actions/modal'
import { joinGroup, leaveGroup } from '../actions/groups'
import {
  CX,
  MODAL_GROUP_JOIN_PRIVATE
} from '../constants'
import { PLACEHOLDER_MISSING_HEADER_SRC } from '../constants'
import { shortNumberFormat } from '../utils/numbers'
import Button from './button'
import Image from './image'
import Text from './text'
import Dummy from './dummy'

const messages = defineMessages({
  members: { id: 'groups.card.members', defaultMessage: 'Members' },
})

const mapStateToProps = (state, { id }) => ({
  group: state.getIn(['groups', id]),
  relationships: state.getIn(['group_relationships', id]),
})

const mapDispatchToProps = (dispatch) => ({
  onToggleMembership(group, relationships) {
    const groupId = group.get('id')
    if (relationships.get('member')) {
      dispatch(leaveGroup(groupId))
    } else {
      if (group.get('is_privated')) {
        dispatch(openModal(MODAL_GROUP_JOIN_PRIVATE, { groupId } ));
      } else {
        dispatch(joinGroup(groupId))
      }
    }
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class GroupListItem extends ImmutablePureComponent {

  static propTypes = {
    group: ImmutablePropTypes.map,
    isAddable: PropTypes.bool,
    isHidden: PropTypes.bool,
    isLast: PropTypes.bool,
    isStatic: PropTypes.bool,
    onToggleMembership: PropTypes.func.isRequired,
    relationships: ImmutablePropTypes.map,
  }

  static defaultProps = {
    isLast: false,
  }

  state = {
    hovering: false,
  }

  handleOnToggleMembership = () => {
    const { group, relationships } = this.props
    this.props.onToggleMembership(group, relationships)
  }

  handleOnMouseEnter = () => {
    this.setState({ hovering: true })
  }

  handleOnMouseLeave = () => {
    this.setState({ hovering: false })
  }

  render() {
    const {
      group,
      intl,
      isAddable,
      isLast,
      isHidden,
      isStatic,
      relationships,
    } = this.props
    const { hovering } = this.state

    if (!group) return null
    
    if (isHidden) {
      return (
        <Fragment>
          {group.get('title')}
        </Fragment>
      )
    }
    
    const containerClasses = CX({
      default: 1,
      overflowHidden: 1,
      bgSubtle_onHover: 1,
      borderColorSecondary: 1,
      borderBottom1PX: !isLast,
      flexRow: 1,
      py5: 1,
      width100PC: 1,
    })

    const containerLinkClasses = CX({
      default: 1,
      flexRow: 1,
      noUnderline: 1,
      width100PC: 1,
      maxWidth100PC86PX: isAddable,
    })

    const coverSrc = group.get('cover_image_url') || ''
    const coverMissing = coverSrc.indexOf(PLACEHOLDER_MISSING_HEADER_SRC) > -1 || !coverSrc
    const isMember = !!relationships && relationships.get('member')
    const isJoinSent = !!relationships && relationships.get('join_sent')
    const addButtonColor = isMember ? hovering ? 'danger' : 'tertiary' : 'brand'
    const addButtonTitle = isJoinSent ? 'Sent Join' : isMember ? hovering ? 'Leave' : 'Member' : 'Join'

    const Wrapper = !isStatic ? NavLink : Dummy

    return (
      <div className={containerClasses}>
        <Wrapper
          to={`/groups/${group.get('id')}/${group.get('title').split(" ").join("-")}`}
          className={containerLinkClasses}
        >

          {
            !coverMissing &&
            <Image
              src={coverSrc}
              alt={group.get('title')}
              className={[_s.radiusSmall, _s.height53PX, _s.width84PX, _s.ml15].join(' ')}
            />
          }

          <div className={[_s.default, _s.px10, _s.mt5, _s.flexShrink1].join(' ')}>
            <Text color='brand' weight='bold'>
              {group.get('title')}
            </Text>

            <Text color='secondary' size='small' className={_s.mt5}>
              {shortNumberFormat(group.get('member_count'))}
              &nbsp;
              {intl.formatMessage(messages.members)}
            </Text>

          </div>
        </Wrapper>
        {
          isAddable &&
          <div className={[_s.default, _s.justifyContentCenter, _s.flexGrow1].join(' ')}>
            {
              relationships &&
              <Button
                isNarrow
                color='white'
                isDisabled={isJoinSent}
                className={[_s.px10, _s.width76PX].join(' ')}
                backgroundColor={addButtonColor}
                onClick={this.handleOnToggleMembership}
                onMouseEnter={this.handleOnMouseEnter}
                onMouseLeave={this.handleOnMouseLeave}
              >
                <Text size='small' color='inherit' align='center'>{addButtonTitle}</Text>
              </Button>
            }
          </div>
        }
      </div>
    )
  }

}