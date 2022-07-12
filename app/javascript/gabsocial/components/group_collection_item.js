import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { defineMessages, injectIntl } from 'react-intl'
import classNames from 'classnames/bind'
import { PLACEHOLDER_MISSING_HEADER_SRC } from '../constants'
import { shortNumberFormat } from '../utils/numbers'
import Image from './image'
import Text from './text'

const messages = defineMessages({
  members: { id: 'groups.card.members', defaultMessage: 'Members' },
  viewGroup: { id: 'view_group', defaultMessage: 'View Group' },
  member: { id: 'member', defaultMessage: 'Member' },
  admin: { id: 'admin', defaultMessage: 'Admin' },
  moderator: { id: 'moderator', defaultMessage: 'Moderator' },
})

const mapStateToProps = (state, { id }) => ({
  group: state.getIn(['groups', id]),
  relationships: state.getIn(['group_relationships', id]),
})

const cx = classNames.bind(_s)

export default
@connect(mapStateToProps)
@injectIntl
class GroupCollectionItem extends ImmutablePureComponent {

  static propTypes = {
    group: ImmutablePropTypes.map,
    relationships: ImmutablePropTypes.map,
    isHidden: PropTypes.bool,
  }

  render() {
    const {
      intl,
      group,
      relationships,
      isHidden,
    } = this.props

    if (!relationships) return null

    const isMember = relationships.get('member')
    const isAdmin = relationships.get('admin')
    const isModerator = relationships.get('moderator')
    const coverSrc = group.get('cover_image_url') || ''
    const coverMissing = coverSrc.indexOf(PLACEHOLDER_MISSING_HEADER_SRC) > -1 || !coverSrc


    if (isHidden) {
      return (
        <Fragment>
          {group.get('title')}
          {isMember && intl.formatMessage(messages.member)}
          {isAdmin && intl.formatMessage(messages.admin)}
          {isModerator && intl.formatMessage(messages.isModerator)}
        </Fragment>
      )
    }

    const navLinkClasses = cx({
      default: 1,
      noUnderline: 1,
      overflowHidden: 1,
      borderColorSecondary: 1,
      boxShadowBlock: 1,
      radiusSmall: 1,
      borderTop1PX: 1,
      mb10: 1,
      ml5: 1,
      mr5: 1,
      bgPrimary: 1,
      bgSubtle_onHover: isMember,
    })

    return (
      <div className={_s.default}>
        <NavLink
          to={`/groups/${group.get('id')}/${group.get('title').split(" ").join("-")}`}
          className={navLinkClasses}
        >
          {
            !!coverSrc && !coverMissing &&
            <Image
              src={coverSrc}
              alt={group.get('title')}
              className={_s.height158PX}
            />
          }

          {
            (!coverSrc || coverMissing) && (isMember || isAdmin || isModerator) &&
            <div className={[_s.default, _s.height40PX, _s.bgSubtle, _s.borderColorSecondary, _s.borderBottom1PX].join(' ')} />
          }

          {
            (isMember || isAdmin || isModerator) &&
            <div className={[_s.default, _s.flexRow, _s.posAbs, _s.top0, _s.right0, _s.pt10, _s.mr10].join(' ')}>
              {
                isMember &&
                <Text
                  isBadge
                  className={_s.bgWhite}
                  size='extraSmall'
                  color='brand'
                >
                  {intl.formatMessage(messages.member)}
                </Text>
              }
              {
                isAdmin &&
                <Text
                  isBadge
                  className={[_s.bgBlack, _s.ml5].join(' ')}
                  size='extraSmall'
                  color='white'
                >
                  {intl.formatMessage(messages.admin)}
                </Text>
              }
              {
                isModerator &&
                <Text
                  isBadge
                  className={[_s.bgBlack, _s.ml5].join(' ')}
                  size='extraSmall'
                  color='white'
                >
                  {intl.formatMessage(messages.moderator)}
                </Text>
              }
            </div>
          }

          <div className={[_s.default, _s.px10, _s.my10].join(' ')}>
            <Text color='primary' size='medium' weight='bold'>
              {group.get('title')}
            </Text>

            <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.mt5, _s.mb5].join(' ')}>
              <Text color='secondary' size='small'>
                {shortNumberFormat(group.get('member_count'))}
                &nbsp;
                {intl.formatMessage(messages.members)}
              </Text>
            </div>
          </div>

        </NavLink>
      </div>
    )
  }

}