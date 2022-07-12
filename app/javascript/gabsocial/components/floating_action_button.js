import { defineMessages, injectIntl } from 'react-intl'
import { me } from '../initial_state'
import { CX } from '../constants'
import { openModal } from '../actions/modal'
import Button from './button'

const messages = defineMessages({
  post: { id: 'post', defaultMessage: 'Post' },
})

const mapDispatchToProps = (dispatch) => ({
  onOpenCompose: () => dispatch(openModal('COMPOSE')),
})

export default
@injectIntl
@connect(null, mapDispatchToProps)
class FloatingActionButton extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onOpenCompose: PropTypes.func.isRequired,
    isDesktop: PropTypes.bool,
  }

  render() {
    const {
      intl,
      onOpenCompose,
      isDesktop,
    } = this.props

    if (!me) return null

    const message = intl.formatMessage(messages.post)

    const containerClasses = CX({
      posFixed: 1,
      z3: 1,
      mb15: 1,
      mr15: 1,
      right0: 1,
      bottom55PX: !isDesktop,
      bottom0: isDesktop,
      pb15: isDesktop,
      pr15: isDesktop,
    })

    return (
      <div
        className={containerClasses}
      >
        <Button
          to={isDesktop ? undefined : '/compose'}
          onClick={isDesktop ? onOpenCompose : undefined}
          className={[_s.py15, _s.height60PX, _s.saveAreaInsetMR, _s.saveAreaInsetMB, _s.width60PX, _s.justifyContentCenter, _s.alignItemsCenter].join(' ')}
          title={message}
          aria-label={message}
          icon='pencil'
          iconSize='20px'
        />
      </div>
    )
  }

}
