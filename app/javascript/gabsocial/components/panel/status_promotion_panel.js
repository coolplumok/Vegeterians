import { NavLink } from 'react-router-dom'
import { injectIntl, defineMessages } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { fetchStatus } from '../../actions/statuses'
import { makeGetStatus } from '../../selectors'
import { me } from '../../initial_state'
import {
  CX,
} from '../../constants'
import PanelLayout from './panel_layout'
import Avatar from '../avatar'
import Button from '../button'
import DisplayName from '../display_name'
import ColumnIndicator from '../column_indicator'
import StatusContent from '../status_content'
import StatusMedia from '../status_media'

const messages = defineMessages({
  posts: { id: 'account.posts', defaultMessage: 'Posts' },
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
  follows: { id: 'account.follows', defaultMessage: 'Following' },
  edit_profile: { id: 'account.edit_profile', defaultMessage: 'Edit profile' },
  headerPhoto: { id: 'header_photo', defaultMessage: 'Header photo' },
})

const mapStateToProps = (state, { statusId }) => ({
  status: makeGetStatus()(state, { id: statusId }),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchStatus: (id) => dispatch(fetchStatus(id)),
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class StatusPromotionPanel extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    statusId: PropTypes.string.isRequired,
    onFetchStatus: PropTypes.func.isRequired,
  }

  componentDidMount() {
    if (!this.props.status) {
      this.props.onFetchStatus(this.props.statusId)
    }
  }

  render() {
    const { status } = this.props

    const containerClasses = CX({
      default: 1,
      pb10: !!status ? status.get('media_attachments').size === 0 : false,
    })

    return (
      <PanelLayout noPadding>
        {
          !status && <ColumnIndicator type='loading' />
        }
        {
          !!status &&
          <div className={_s.default}>
            <div className={[_s.default, _s.px15, _s.py10].join(' ')}>
              <div className={[_s.default, _s.flexRow, _s.mt5].join(' ')}>

                <NavLink
                  to={`/${status.getIn(['account', 'acct'])}`}
                  title={status.getIn(['account', 'acct'])}
                  className={[_s.default, _s.mr10].join(' ')}
                >
                  <Avatar account={status.get('account')} size={28} />
                </NavLink>

                <div className={[_s.default, _s.alignItemsStart, _s.flexGrow1, _s.mt5].join(' ')}>

                  <div className={[_s.default, _s.flexRow, _s.width100PC, _s.alignItemsStart].join(' ')}>
                    <NavLink
                      className={[_s.default, _s.flexRow, _s.alignItemsStart, _s.noUnderline].join(' ')}
                      to={`/${status.getIn(['account', 'acct'])}`}
                      title={status.getIn(['account', 'acct'])}
                    >
                      <DisplayName account={status.get('account')} noRelationship />
                    </NavLink>

                    <Button
                      isText
                      backgroundColor='none'
                      color='none'
                      icon='ellipsis'
                      iconSize='20px'
                      iconClassName={_s.fillSecondary}
                      className={_s.mlAuto}
                      onClick={() => {}}
                      // buttonRef={this.setStatusOptionsButton}
                    />
                  </div>

                </div>
              </div>
            </div>

            <div className={containerClasses}>
              <StatusContent
                status={status}
                expanded={!status.get('hidden')}
                collapsable
                onClick={() => { }}
                onExpandedToggle={() => { }}
              />
            </div>

            <StatusMedia
              status={status}
              onOpenMedia={() => { }}
              onToggleVisibility={() => { }}
              onOpenVideo={() => { }}
              // width={this.props.cachedMediaWidth}
              // cacheWidth={this.props.cacheMediaWidth}
              // defaultWidth={this.props.cachedMediaWidth}
              // visible={this.state.showMedia}
            />

          </div>
        }
      </PanelLayout>
    )
  }

}
