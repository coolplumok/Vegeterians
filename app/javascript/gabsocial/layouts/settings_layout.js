import {
  CX,
  BREAKPOINT_EXTRA_SMALL,
} from '../constants'
import { me } from '../initial_state'
import SidebarXS from '../components/sidebar_xs'
import NavigationBar from '../components/navigation_bar'
import FooterBar from '../components/footer_bar'
import Responsive from '../features/ui/util/responsive_component'
import ResponsiveClassesComponent from '../features/ui/util/responsive_classes_component'
import SettingsSidebar from '../components/settings_sidebar'

export default class SettingsLayout extends PureComponent {

  static propTypes = {
    title: PropTypes.string,
  }

  render() {
    const { children, title } = this.props

    const mainBlockClasses = CX({
      default: 1,
      width1015PX: 1,
      flexRow: 1,
      justifyContentEnd: 1,
      py15: 1,
      mlAuto: !me,
      mrAuto: !me,
    })

    return (
      <div className={[_s.default, _s.width100PC, _s.heightMin100VH, _s.bgTertiary].join(' ')}>

        <Responsive max={BREAKPOINT_EXTRA_SMALL}>
          <SidebarXS />
        </Responsive>

        <NavigationBar
          title={title}
          noSearch
        />

        <div className={[_s.default, _s.flexRow, _s.width100PC].join(' ')}>

          <Responsive min={BREAKPOINT_EXTRA_SMALL}>
            <SettingsSidebar title='Settings' />
          </Responsive>

          <ResponsiveClassesComponent
            classNames={[_s.default, _s.flexShrink1, _s.flexGrow1].join(' ')}
            classNamesSmall={[_s.default, _s.flexShrink1, _s.flexGrow1].join(' ')}
            classNamesXS={[_s.default, _s.width100PC].join(' ')}
          >
            <main role='main'>

              <ResponsiveClassesComponent
                classNames={mainBlockClasses}
                classNamesXS={[_s.default, _s.width1015PX, _s.justifyContentEnd, _s.pb15].join(' ')}
              >

                <div className={[_s.default, _s.width1015PX, _s.z1].join(' ')}>

                  <div className={_s.default}>
                    {children}
                  </div>
                </div>

              </ResponsiveClassesComponent>

            </main>
          </ResponsiveClassesComponent>
        </div>

        <Responsive max={BREAKPOINT_EXTRA_SMALL}>
          <FooterBar />
        </Responsive>
      </div>
    )
  }

}
