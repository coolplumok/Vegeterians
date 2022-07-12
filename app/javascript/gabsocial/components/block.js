/**
 * Renders a block component
 */
export default class Block extends PureComponent {

  static propTypes = {
    children: PropTypes.any,
  }

  render() {
    const { children } = this.props

    return (
      <div className={[_s.default, _s.boxShadowBlock, _s.bgPrimary, _s.overflowHidden, _s.radiusSmall].join(' ')}>
        {children}
      </div>
    )
  }

}