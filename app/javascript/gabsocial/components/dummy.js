export default class Dummy extends PureComponent {

  render() {
    return (
      <div className={this.props.className}>
        {this.props.children}
      </div>
    )
  }

}