import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import Responsive from '../features/ui//util/responsive_component'
import Icon from './icon'
import Text from './text'

export default class PullToRefresher extends PureComponent {

  render() {
    return (
      <Responsive max={BREAKPOINT_EXTRA_SMALL}>
        <div className={[_s.default, _s.height53PX, _s.width100PC, _s.alignItemsCenter, _s.posAbs, _s.left0, _s.right0, _s.topNeg50PX].join(' ')}>
          <div className={[_s.default, _s.width100PC, _s.alignItemsCenter].join(' ')}>
            <Icon id='loading' size='24px' />
          </div>
        </div>
      </Responsive>
    )
  }

}