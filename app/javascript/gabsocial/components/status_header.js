import { Fragment } from 'react'
import { injectIntl, defineMessages } from 'react-intl'
import { NavLink } from 'react-router-dom'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import classNames from 'classnames/bind'
import moment from 'moment-mini'
import { openPopover } from '../actions/popover'
import { openModal } from '../actions/modal'
import { me } from '../initial_state'
import RelativeTimestamp from './relative_timestamp'
import DisplayName from './display_name'
import Text from './text'
import DotTextSeperator from './dot_text_seperator'
import Icon from './icon'
import Button from './button'
import Avatar from './avatar'

const messages = defineMessages({
  edited: { id: 'status.edited', defaultMessage: 'Edited' },
  expirationMessage: { id: 'status.expiration_message', defaultMessage: 'This status expires {time}' },
  public_short: { id: 'privacy.public.short', defaultMessage: 'Public' },
  public_long: { id: 'privacy.public.long', defaultMessage: 'Visible for anyone on or off Vegeterians.live' },
  unlisted_short: { id: 'privacy.unlisted.short', defaultMessage: 'Unlisted' },
  unlisted_long: { id: 'privacy.unlisted.long', defaultMessage: 'Do not show in public timelines' },
  private_long: { id: 'privacy.private.long', defaultMessage: 'Visible for your followers only' },
})

const cx = classNames.bind(_s)

const mapDispatchToProps = (dispatch) => ({
  onOpenStatusRevisionsPopover(status) {
    dispatch(openModal('STATUS_REVISIONS', {
      status,
    }))
  },

  onOpenStatusOptionsPopover(targetRef, status) {
    dispatch(openPopover('STATUS_OPTIONS', {
      targetRef,
      status,
      position: 'left-start',
    }))
  },
})

export default
@injectIntl
@connect(null, mapDispatchToProps)
class StatusHeader extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    status: ImmutablePropTypes.map,
    onOpenStatusRevisionsPopover: PropTypes.func.isRequired,
    onOpenStatusOptionsPopover: PropTypes.func.isRequired,
    reduced: PropTypes.bool,
  }

  handleOpenStatusOptionsPopover = () => {
    this.props.onOpenStatusOptionsPopover(this.statusOptionsButton, this.props.status)
  }

  handleOpenStatusEdits = () => {
    this.props.onOpenStatusRevisionsPopover(this.props.status)
  }

  setStatusOptionsButton = n => {
    this.statusOptionsButton = n
  }

  render() {
    const {
      intl,
      reduced,
      status,
    } = this.props

    const statusUrl = `/${status.getIn(['account', 'acct'])}/posts/${status.get('id')}`

    const containerClasses = cx({
      default: 1,
      px15: 1,
      py10: !reduced,
      pb10: reduced,
    })

    const avatarSize = reduced ? 20 : 46

    const visibility = status.get('visibility')

    let visibilityIcon
    let visibilityText

    if (visibility === 'private') {
      visibilityIcon = 'lock-filled'
      visibilityText = intl.formatMessage(messages.private_long)
    } else if (visibility === 'unlisted') {
      visibilityIcon = 'unlock-filled'
      visibilityText = `${intl.formatMessage(messages.unlisted_short)} - ${intl.formatMessage(messages.unlisted_long)}`
    } else {
      visibilityIcon = 'globe'
      visibilityText = `${intl.formatMessage(messages.public_short)} - ${intl.formatMessage(messages.public_long)}`
    }

    const expirationDate = status.get('expires_at')
    let timeUntilExpiration
    if (!!expirationDate) {
      timeUntilExpiration = moment(expirationDate).fromNow()
    }

    return (
      <div className={containerClasses}>
        <div className={[_s.default, _s.flexRow, _s.mt5].join(' ')}>

          {
            !reduced &&
            <NavLink
              to={`/${status.getIn(['account', 'acct'])}`}
              title={status.getIn(['account', 'acct'])}
              className={[_s.default, _s.mr10].join(' ')}
            >
              <Avatar account={status.get('account')} size={avatarSize} />
            </NavLink>
          }

          <div className={[_s.default, _s.alignItemsStart, _s.flexGrow1, _s.mt5].join(' ')}>

            <div className={[_s.default, _s.flexRow, _s.width100PC, _s.alignItemsStart].join(' ')}>
              <NavLink
                className={[_s.default, _s.flexRow, _s.alignItemsStart, _s.noUnderline].join(' ')}
                to={`/${status.getIn(['account', 'acct'])}`}
                title={status.getIn(['account', 'acct'])}
              >
                <DisplayName account={status.get('account')} noRelationship />
              </NavLink>

              {
                !reduced && !!me &&
                <Button
                  isText
                  backgroundColor='none'
                  color='none'
                  icon='ellipsis'
                  iconSize='20px'
                  iconClassName={_s.fillSecondary}
                  className={_s.mlAuto}
                  onClick={this.handleOpenStatusOptionsPopover}
                  buttonRef={this.setStatusOptionsButton}
                />
              }
            </div>

            <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.lineHeight15].join(' ')}>
              <Button
                isText
                underlineOnHover
                backgroundColor='none'
                color='none'
                to={statusUrl}
              >
                <Text size='small' color='secondary'>
                  <RelativeTimestamp timestamp={status.get('created_at')} />
                </Text>
              </Button>

              <DotTextSeperator />

              <span title={visibilityText} className={[_s.default, _s.displayInline, _s.ml5].join(' ')}>
                <Icon id={visibilityIcon} size='12px' className={[_s.default, _s.fillSecondary].join(' ')} />
              </span>

              {
                !!status.get('expires_at') &&
                <Fragment>
                  <DotTextSeperator />
                  <span title={intl.formatMessage(messages.expirationMessage, {
                    time: timeUntilExpiration,
                  })} className={[_s.default, _s.displayInline, _s.ml5].join(' ')}>
                    <Icon id='stopwatch' size='13px' className={[_s.default, _s.fillSecondary].join(' ')} />
                  </span>
                </Fragment>
              }

              {
                !!status.get('group') &&
                <Fragment>
                  <DotTextSeperator />
                  <Button
                    isText
                    underlineOnHover
                    backgroundColor='none'
                    color='none'
                    to={`/groups/${status.getIn(['group', 'id'])}/${status.getIn(['group', 'title']).split(" ").join("-")}`}
                    className={_s.ml5}
                  >
                    <Text size='small' color='secondary'>
                      {status.getIn(['group', 'title'])}
                    </Text>
                  </Button>
                </Fragment>
              }

              {
                status.get('revised_at') !== null &&
                <Fragment>
                  <DotTextSeperator />
                  <Button
                    isText
                    underlineOnHover
                    backgroundColor='none'
                    color='none'
                    onClick={this.handleOpenStatusEdits}
                    className={_s.ml5}
                  >
                    <Text size='small' color='secondary'>
                      {intl.formatMessage(messages.edited)}
                    </Text>
                  </Button>
                </Fragment>
              }

            </div>
          </div>
        </div>
      </div>
    )
  }

}
