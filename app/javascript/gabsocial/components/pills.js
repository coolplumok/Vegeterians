import ResponsiveClassesComponent from '../features/ui/util/responsive_classes_component'
import PillItem from './pill_item'

/**
 * Renders pills components
 * @param {array} [props.pills] - tab bar data for creating `TabBarItem`
 */
export default class Pills extends PureComponent {

  static propTypes = {
    pills: PropTypes.array,
  }

  render() {
    const { pills } = this.props

    return (
      <ResponsiveClassesComponent
        classNames={[_s.default, _s.flexWrap, _s.px5, _s.flexRow].join(' ')}
        classNamesXS={[_s.default, _s.overflowYHidden, _s.overflowXScroll, _s.noScrollbar, _s.pl10, _s.pr15, _s.flexRow].join(' ')}
      >
        {
          !!pills &&
          pills.map((tab, i) => (
            <PillItem
              key={`pill-item-${i}`}
              title={tab.title}
              onClick={tab.onClick}
              to={tab.to}
              isActive={tab.active}
            />
          ))
        }
      </ResponsiveClassesComponent>
    )
  }

}