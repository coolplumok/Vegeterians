import ComposeFormContainer from './containers/compose_form_container'

export default class Compose extends PureComponent {

  render () {
    return (
      <div className={[_s.default, _s.bgPrimary, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
        <ComposeFormContainer isStandalone />
      </div>
    )
  }

}
