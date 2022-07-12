import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { injectIntl, defineMessages } from 'react-intl'
import { me } from '../initial_state'
import SidebarSectionTitle from './sidebar_section_title'
import SidebarSectionItem from './sidebar_section_item'
import Heading from './heading'
import BackButton from './back_button'
import ResponsiveClassesComponent from '../features/ui/util/responsive_classes_component'

const messages = defineMessages({
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Muted users' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  menu: { id: 'menu', defaultMessage: 'Menu' },
})

export default
@injectIntl
class AboutSidebar extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map,
    title: PropTypes.string,
    items: PropTypes.array.isRequired,
  }

  render() {
    const {
      intl,
      title,
      items,
    } = this.props

    return (
      <header role='banner' className={[_s.default, _s.flexGrow1, _s.z3, _s.alignItemsEnd].join(' ')}>
        <ResponsiveClassesComponent
          classNames={[_s.default, _s.width240PX].join(' ')}
          classNamesXS={[_s.default, _s.width100PC].join(' ')}
        >
          <ResponsiveClassesComponent
            classNames={[_s.default, _s.posFixed, _s.heightCalc53PX, _s.bottom0].join(' ')}
            classNamesXS={[_s.default, _s.px15].join(' ')}
          >
            <ResponsiveClassesComponent
              classNames={[_s.default, _s.height100PC, _s.alignItemsStart, _s.width240PX, _s.pr15, _s.py10, _s.noScrollbar, _s.overflowYScroll].join(' ')}
              classNamesXS={[_s.default,  _s.alignItemsStart, _s.width100PC, _s.py10, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}
            >
              <div className={[_s.default, _s.width100PC].join(' ')}>
                <div className={[_s.default, _s.flexRow, _s.px5, _s.pt10].join(' ')}>
                  {
                    me && <BackButton icon='arrow-left' toHome />
                  }
                  <Heading size='h1'>
                    {title}
                  </Heading>
                </div>

              </div>
              <nav aria-label='Primary' role='navigation' className={[_s.default, _s.width100PC, _s.mb15].join(' ')}>
                <SidebarSectionTitle>{intl.formatMessage(messages.menu)}</SidebarSectionTitle>
                {
                  items.map((menuItem, i) => (
                    <SidebarSectionItem {...menuItem} key={`about-sidebar-item-menu-${i}`} />
                  ))
                }
              </nav>

            </ResponsiveClassesComponent>
          </ResponsiveClassesComponent>
        </ResponsiveClassesComponent>
      </header>
    )
  }

}