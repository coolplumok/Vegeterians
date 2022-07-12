import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import Button from './button'
import NavigationBarButton from './navigation_bar_button'
import Search from './search'
import Text from './text'
import ResponsiveComponent from '../features/ui/util/responsive_component'
import ResponsiveClassesComponent from '../features/ui/util/responsive_classes_component'

export default class LoggedOutNavigationBar extends PureComponent {

  static propTypes = {
    isProfile: PropTypes.bool,
    title: PropTypes.string,
    showBackBtn: PropTypes.bool,
  }

  render() {
    const { isProfile } = this.props

    return (
      <ResponsiveClassesComponent
        classNames={[_s.default, _s.z4, _s.heightMin53PX, _s.width100PC].join(' ')}
        classNamesXS={[_s.default, _s.z4, _s.heightMin98PX, _s.width100PC].join(' ')}
      >
        <ResponsiveClassesComponent
          classNames={[_s.default, _s.heightMin53PX, _s.bgNavigation, _s.alignItemsCenter, _s.z3, _s.top0, _s.right0, _s.left0, _s.posFixed].join(' ')}
          classNamesXS={[_s.default, _s.heightMin98PX, _s.bgNavigation, _s.alignItemsCenter, _s.z3, _s.top0, _s.right0, _s.left0, _s.posFixed].join(' ')}
        >

          <div className={[_s.default, _s.width1255PX, _s.flexRow, _s.flexWrap, _s.height100PC].join(' ')}>

            <ResponsiveClassesComponent
              classNames={[_s.default, _s.alignItemsCenter, _s.justifyContentCenter, _s.flexRow, _s.flexGrow1, _s.saveAreaInsetPT, _s.saveAreaInsetPL, _s.saveAreaInsetPR].join(' ')}
              classNamesXS={[_s.default, _s.flexRow, _s.saveAreaInsetPT, _s.saveAreaInsetPL, _s.saveAreaInsetPR, _s.width100PC].join(' ')}
            >

              <Button
                href='/'
                color='none'
                backgroundColor='none'
                icon='logo'
                iconClassName={[_s.mr5, _s.fillNavigation].join(' ')}
              />

              {
                isProfile &&
                <ResponsiveComponent min={BREAKPOINT_EXTRA_SMALL}>
                  <div className={[_s.default, _s.flexRow, _s.mr15].join(' ')}>
                    <NavigationBarButton title='Home' icon='home' href='/home' />
                    <NavigationBarButton title='Groups' icon='group' to='/groups' />
                  </div>
                </ResponsiveComponent>
              }

              <div className={[_s.default, _s.flexGrow1, _s.mr10].join(' ')}>
                <Search isInNav />
              </div>

            </ResponsiveClassesComponent>

            <ResponsiveClassesComponent
              classNames={[_s.default, _s.flexRow, _s.py5, _s.px10, _s.width330PX, _s.mlAuto].join(' ')}
              classNamesXS={[_s.default, _s.flexRow, _s.pb5, _s.px10, _s.width100PC].join(' ')}
            >

              <Button
                isNarrow
                isOutline
                color='white'
                backgroundColor='none'
                href='/auth/sign_in'
                className={[_s.borderColorWhite, _s.mr5, _s.flexGrow1, _s.alignItemsCenter, _s.justifyContentCenter, _s.py7].join(' ')}
              >
                <Text color='inherit' weight='medium' align='center'>
                  Log in
                </Text>
              </Button>

              <Button
                isNarrow
                color='brand'
                backgroundColor='white'
                href='/auth/sign_up'
                className={[_s.justifyContentCenter, _s.alignItemsCenter, _s.ml5, _s.flexGrow1, _s.py7].join(' ')}
              >
                <Text color='inherit' weight='bold' align='center'>
                  Sign up
                </Text>
              </Button>

            </ResponsiveClassesComponent>
          </div>

        </ResponsiveClassesComponent>
      </ResponsiveClassesComponent>
    )
  }

}
