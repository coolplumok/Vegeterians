import { Fragment } from 'react'
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { openModal } from '../../actions/modal'
import { MODAL_GROUP_MEMBERS, MODAL_GROUP_PENDING_APPLICATIONS } from '../../constants'
import { me } from '../../initial_state'
import { shortNumberFormat } from '../../utils/numbers'
import PanelLayout from './panel_layout'
import Button from '../button'
import Divider from '../divider'
import Dummy from '../dummy'
import Icon from '../icon'
import Text from '../text'
import RelativeTimestamp from '../relative_timestamp'

const messages = defineMessages({
  title: { id: 'about', defaultMessage: 'About' },
  members: { id: 'members', defaultMessage: 'Members' },
  applications: { id: 'applications', defaultMessage: 'Applications' },
  pending: { id: 'pending', defaultMessage: 'pending' },
})

const mapDispatchToProps = (dispatch) => ({
  onOpenGroupMembersModal(groupId) {
    dispatch(openModal(MODAL_GROUP_MEMBERS, { groupId }))
  },

  onOpenGroupApplicationPendingModal(groupId) {
    dispatch(openModal(MODAL_GROUP_PENDING_APPLICATIONS, { groupId }))
  },
})

export default
@injectIntl
@connect(null, mapDispatchToProps)
class GroupInfoPanel extends ImmutablePureComponent {

  static propTypes = {
    group: ImmutablePropTypes.map.isRequired,
    intl: PropTypes.object.isRequired,
    onOpenGroupMembersModal: PropTypes.func.isRequired,
    noPanel: PropTypes.bool,
		relationships: ImmutablePropTypes.map,
  }

  handleOnOpenGroupMembersModal = () => {
    this.props.onOpenGroupMembersModal(this.props.group.get('id'))
  }

  handleOnOpenGroupApplicationPendingModal = () => {
    this.props.onOpenGroupApplicationPendingModal(this.props.group.get('id'))
  }  

  render() {
    const { intl, group, noPanel, relationships } = this.props

    const Wrapper = noPanel ? Dummy : PanelLayout
    
    const isPrivated = !!group ? group.get('is_privated') : false

    return (
      <Wrapper title={intl.formatMessage(messages.title)}>
        {
          !!group &&
          <Fragment>

            <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
              <Text weight='medium'>
                {group.get('title')}
              </Text>
            </div>

            <Divider isSmall />

            <Fragment>
              <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
                { 
                  !!isPrivated &&
                  <div className={[_s.mr5, _s.radiusSmall, _s.bgGreen, _s.py2, _s.px5].join(' ')}>
                    <Text weight='bold' size='small' className={_s.colorBGPrimary} isBadge>Private</Text>
                  </div>
                }
                {
                  !isPrivated &&
                  <div className={[_s.mr5, _s.radiusSmall, _s.bgGreenLight, _s.py2, _s.px5].join(' ')}>
                    <Text weight='bold' size='small' className={_s.colorBGPrimary} isBadge>Public</Text>
                  </div>
                }
              </div>
            </Fragment>

            <Divider isSmall />

            {
              !!me &&
              <Fragment>
                <div className={[_s.default, _s.flexRow, _s.justifyContentCenter].join(' ')}>
                  <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
                    <Icon id='group' size='14px' className={_s.fillPrimary} />
                    <Text size='small' className={_s.ml5}>
                      {intl.formatMessage(messages.members)}
                    </Text>
                  </div>
                  <Button
                    isText
                    color='brand'
                    backgroundColor='none'
                    className={_s.mlAuto}
                    onClick={this.handleOnOpenGroupMembersModal}
                  >
                    <Text color='inherit' weight='medium' size='normal' className={_s.underline_onHover}>
                      {shortNumberFormat(group.get('member_count'))}
                      &nbsp;
                      {intl.formatMessage(messages.members)}
                    </Text>
                  </Button>
                </div>

                <Divider isSmall />
              </Fragment>
            }

            {
              relationships && relationships.get('admin') &&              
              <Fragment>
                <div className={[_s.default, _s.flexRow, _s.justifyContentCenter].join(' ')}>
                  <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
                    <Icon id='group' size='14px' className={_s.fillPrimary} />
                    <Text size='small' className={_s.ml5}>
                      {intl.formatMessage(messages.applications)}
                    </Text>
                  </div>
                  <Button
                    isText
                    color='brand'
                    backgroundColor='none'
                    className={_s.mlAuto}
                    onClick={this.handleOnOpenGroupApplicationPendingModal}
                  >
                    <Text color='inherit' weight='medium' size='normal' className={_s.underline_onHover}>
                      {shortNumberFormat(group.get('pending_application_count'))}
                      &nbsp;
                      {intl.formatMessage(messages.pending)}
                    </Text>
                  </Button>
                </div>

                <Divider isSmall />
              </Fragment>
            }

            <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
              <Icon id='calendar' size='12px' className={_s.fillSecondary} />
              <Text
                size='small'
                color='secondary'
                className={_s.ml5}
              >
                {
                  <FormattedMessage id='lists.panel_created' defaultMessage='Created: {date}' values={{
                    date: <RelativeTimestamp timestamp={group.get('created_at')} />,
                  }} />
                }
              </Text>
            </div>

            <Divider isSmall />

            <Text>
              {group.get('description')}
            </Text>
          </Fragment>
        }
      </Wrapper>
    )
  }
}