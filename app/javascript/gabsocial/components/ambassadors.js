const mapStateToProps = (state) => ({
  access_token: state.getIn(['meta', 'access_token']),
})

export default
@connect(mapStateToProps)
class Ambassadors extends PureComponent {

  static propTypes = {
    access_token: PropTypes.string.isRequired,
  }

  state = {
    auth_token: null,
    src: 'https://rewards.Vegeterians.live',
  }

  componentDidMount() {
    const auth_token = document.getElementById('promoter_auth_token').getAttribute('content')
    if (auth_token) this.setState({ auth_token, src: `${this.state.src}/iframe?at=${auth_token}` })
  }

  render() {
    const { src } = this.state

    return (
      <iframe
        title='ambassadors'
        height='850px'
        width='100%'
        frameBorder='0'
        src={src}
      />
    )
  }

}
