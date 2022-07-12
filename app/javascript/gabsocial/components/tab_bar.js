import ResponsiveClassesComponent from '../features/ui/util/responsive_classes_component';
import TabBarItem from './tab_bar_item'

/**
 * Renders a tab bar component
 * @param {array} [props.tabs] - tab bar data for creating `TabBarItem`
 * @param {bool} [props.isLarge] - to style the tab bar larger
 */
export default class TabBar extends PureComponent {

  static propTypes = {
    tabs: PropTypes.array,
    isLarge: PropTypes.bool,
  }

  render() {
    const { tabs, isLarge } = this.props

    return (
      <ResponsiveClassesComponent
        classNames={[_s.default, _s.height53PX, _s.px5, _s.flexRow, _s.overflowXScroll, _s.noScrollbar].join(' ')}
        classNamesXS={[_s.default, _s.height40PX, _s.px5, _s.flexRow].join(' ')}
      >
        {
          // Check for if tabs exist or not.
          // We don't `return null` because it maintains 53px height if no tabs.
          !!tabs &&
          tabs.map((tab, i) => (
            <TabBarItem
              key={`tab-bar-item-${i}`}
              title={tab.title}
              onClick={tab.onClick}
              to={tab.to}
              isActive={tab.active}
              isLarge={isLarge}
            />
          ))
        }
      </ResponsiveClassesComponent>
    )
  }

}