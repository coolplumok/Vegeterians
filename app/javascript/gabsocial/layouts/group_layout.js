import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Sticky from 'react-stickynode'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import Layout from './layout'
import GroupInfoPanel from '../components/panel/group_info_panel'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import GroupSidebarPanel from '../components/panel/groups_panel'
import SignupPanel from '../components/panel/sign_up_panel'
import LinkFooter from '../components/link_footer'
import GroupHeader from '../components/group_header'
import SidebarPanelGroup from '../components/sidebar_panel_group'
import Responsive from '../features/ui/util/responsive_component';

export default class GroupLayout extends ImmutablePureComponent {

  static propTypes = {
    actions: PropTypes.array,
    children: PropTypes.node,
    group: ImmutablePropTypes.map,
    groupId: PropTypes.string,
    layout: PropTypes.object,
    relationships: ImmutablePropTypes.map,
    showBackBtn: PropTypes.bool,
    title: PropTypes.string,
  }

  render() {
    const {
      actions,
      children,
      group,
      groupId,
      layout,
      relationships,
      showBackBtn,
      title,
      noComposeButton,
    } = this.props

    return (
      <Layout
        noRightSidebar
        actions={actions}
        showBackBtn={showBackBtn}
        title={title}
        page='group'
      >
        <Responsive max={BREAKPOINT_EXTRA_SMALL}>
          <div className={[_s.default, _s.width100PC].join(' ')}>

            <GroupHeader group={group} relationships={relationships}>
              <GroupInfoPanel group={group} noPanel />
            </GroupHeader>

            <div className={[_s.default, _s.width100PC, _s.z1].join(' ')}>
              {children}
            </div>

          </div>
        </Responsive>

        <Responsive min={BREAKPOINT_EXTRA_SMALL}>
          <div className={[_s.default, _s.width100PC, _s.pl15].join(' ')}>

            <GroupHeader group={group} relationships={relationships} />

            <div className={[_s.default, _s.flexRow, _s.width100PC, _s.justifyContentEnd].join(' ')}>
              <div className={[_s.default, _s.width645PX, _s.z1].join(' ')}>
                <div className={_s.default}>
                  {children}
                </div>
              </div>

              <div className={[_s.default, _s.ml15, _s.width340PX].join(' ')}>
                <Sticky top={73} enabled>
                  <div className={[_s.default, _s.width340PX].join(' ')}>
                    <SidebarPanelGroup
                      page={`group.${groupId}`}
                      layout={[
                        <GroupInfoPanel group={group} relationships={relationships} key='group-page-info-panel' />,
                        <SignupPanel key='group-page-signup-panel' />,
                        <WhoToFollowPanel key='group-page-wtf-panel' />,
                        <GroupSidebarPanel isSlim key='group-page-group-panel' />,
                        <LinkFooter key='group-page-link-footer' />,
                      ]}
                    />
                  </div>
                </Sticky>
              </div>
            </div>
          </div>
        </Responsive>
      </Layout>
    )
  }

}
