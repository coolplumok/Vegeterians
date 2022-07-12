import Text from './text'

export default class Form extends PureComponent {

  static propTypes = {
    children: PropTypes.any,
    errorMessage: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
  }

  componentDidUpdate (prevProps) {
    
  }

  render() {
    const {
      children,
      errorMessage,
      onSubmit,
    } = this.props

    return (
      <form onSubmit={onSubmit} className={_s.default}>
        {
          !!errorMessage &&
          <Text color='danger' className={_s.my10}>
            {errorMessage}
          </Text>
        }
        <div className={_s.default}>
          {children}
        </div>
      </form>
    )
  }

}
