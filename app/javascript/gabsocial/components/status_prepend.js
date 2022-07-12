import { NavLink } from 'react-router-dom'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Icon from './icon'
import Text from './text'

const messages = defineMessages({
  filtered: { id: 'status.filtered', defaultMessage: 'Filtered' },
  promoted: { id: 'status.promoted', defaultMessage: 'Promoted post' },
  pinned: { id: 'status.pinned', defaultMessage: 'Pinned post' },
  reposted: { id: 'status.reposted_by', defaultMessage: '{name} reposted' },
})

export default
@injectIntl
class StatusPrepend extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    status: ImmutablePropTypes.map,
    isComment: PropTypes.bool,
    isFeatured: PropTypes.bool,
    isPromoted: PropTypes.bool,
  }

  render() {
    const {
      intl,
      status,
      isFeatured,
      isPromoted,
      isComment,
    } = this.props

    if (!status) return null

    const isRepost = (status.get('reblog', null) !== null && typeof status.get('reblog') === 'object')

    if (!isFeatured && !isPromoted && !isRepost && !isComment) return null

    let iconId
    if (isFeatured) iconId = 'pin'
    else if (isPromoted) iconId = 'star'
    else if (isRepost) iconId = 'repost'
    else if (isComment) iconId = 'comment'

    return (
      <div className={[_s.default, _s.width100PC, _s.alignItemsStart, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
        <div className={[_s.default, _s.width100PC, _s.flexRow, _s.alignItemsCenter, _s.py5, _s.px15].join(' ')}>
          <Icon id={iconId} size='12px' className={[_s.fillSecondary, _s.mr5].join(' ')} />
          {
            isRepost && !isComment &&
            <div className={[_s.default, _s.flexRow].join(' ')}>
              <Text size='small' color='secondary'>
                <FormattedMessage
                  id='status.reposted_by'
                  defaultMessage='{name} reposted'
                  values={{
                    name: (
                      <NavLink
                        className={[_s.noUnderline, _s.underline_onHover].join(' ')}
                        to={`/${status.getIn(['account', 'acct'])}`}
                      >
                        <Text size='small' color='secondary'>
                          <bdi>
                            <span dangerouslySetInnerHTML={{ __html: status.getIn(['account', 'display_name_html']) }} />
                          </bdi>
                        </Text>
                      </NavLink>
                    )
                  }}
                />
              </Text>
            </div>
          }
          {
            !isRepost && !isComment &&
            <Text color='secondary' size='small'>
              {intl.formatMessage(isFeatured ? messages.pinned : messages.promoted)}
            </Text>
          }
          {
            isComment &&
            <Text color='secondary' size='small'>
              <FormattedMessage
                id='status.commented_on_this'
                defaultMessage='{name} commented on this post'
                values={{
                  name: (
                    <NavLink
                      className={[_s.noUnderline, _s.underline_onHover].join(' ')}
                      to={`/${status.getIn(['account', 'acct'])}`}
                    >
                      <Text size='small' color='secondary'>
                        <bdi>
                          <span dangerouslySetInnerHTML={{ __html: status.getIn(['account', 'display_name_html']) }} />
                        </bdi>
                      </Text>
                    </NavLink>
                  )
                }}
              />
            </Text>
          }
        </div>
      </div>
    )
  }

}
