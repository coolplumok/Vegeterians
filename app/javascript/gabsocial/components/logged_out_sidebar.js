import { injectIntl, defineMessages } from 'react-intl'
import { me } from '../initial_state'
import SidebarSectionTitle from './sidebar_section_title'
import SidebarSectionItem from './sidebar_section_item'
import Heading from './heading'
import BackButton from './back_button'

const messages = defineMessages({
  explore: { id: 'explore', defaultMessage: 'Explore' },
  menu: { id: 'menu', defaultMessage: 'Menu' },
})

export default
@injectIntl
class Sidebar extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    title: PropTypes.string,
  }

  render() {
    const { intl, title } = this.props

    if (!!me) return null

    const menuItems = [
      {
        title: 'Home',
        icon: 'home',
        to: '/home',
      },
      {
        title: 'Search',
        icon: 'search-alt',
        to: '/search',
      },
      {
        title: 'Groups',
        icon: 'group',
        to: '/groups',
      },
    ]

    const exploreItems = [
      {
        title: 'Vegeterians.News',
        icon: 'trends',
        href: 'https://Vegeterians.news',
      },
    ]

    return (
      <header role='banner' className={[_s.default, _s.flexGrow1, _s.z3, _s.alignItemsEnd].join(' ')}>
        <div className={[_s.default, _s.width240PX].join(' ')}>
          <div className={[_s.default, _s.posFixed, _s.heightCalc53PX, _s.bottom0].join(' ')}>
            <div className={[_s.default, _s.height100PC, _s.alignItemsStart, _s.width240PX, _s.pr15, _s.py10, _s.noScrollbar, _s.overflowYScroll].join(' ')}>
              <div className={[_s.default, _s.width100PC].join(' ')}>
                {
                  !!title &&
                  <div className={[_s.default, _s.flexRow, _s.px5, _s.pt10].join(' ')}>
                    <Heading size='h1'>
                      {title}
                    </Heading>
                  </div>
                }
              </div>
              <nav aria-label='Primary' role='navigation' className={[_s.default, _s.width100PC, _s.mb15].join(' ')}>
                <SidebarSectionTitle>{intl.formatMessage(messages.menu)}</SidebarSectionTitle>
                {
                  menuItems.map((menuItem, i) => {
                    if (menuItem.hidden) return null

                    return (
                      <SidebarSectionItem {...menuItem} key={`sidebar-item-menu-${i}`} />
                    )
                  })
                }
                <SidebarSectionTitle>{intl.formatMessage(messages.explore)}</SidebarSectionTitle>
                {
                  exploreItems.map((exploreItem, i) => (
                    <SidebarSectionItem {...exploreItem} key={`sidebar-item-explore-${i}`} />
                  ))
                }
              </nav>

            </div>
          </div>
        </div>
      </header>
    )
  }

}
