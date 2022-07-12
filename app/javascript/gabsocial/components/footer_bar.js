import { withRouter } from 'react-router-dom'
import { me } from '../initial_state'
import { CX } from '../constants'
import Button from './button'

const mapStateToProps = (state) => ({
  notificationCount: !!me ? state.getIn(['notifications', 'unread']) : 0,
  homeItemsQueueCount: !!me ? state.getIn(['timelines', 'home', 'totalQueuedItemsCount']) : 0,
})

export default
@withRouter
@connect(mapStateToProps)
class FooterBar extends PureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    notificationCount: PropTypes.number.isRequired,
    homeItemsQueueCount: PropTypes.number.isRequired,
  }

  render() {
    const {
      notificationCount,
      homeItemsQueueCount,
    } = this.props

    const noRouter = !this.context.router
    const currentPathname = noRouter ? '' : this.context.router.route.location.pathname

    const buttons = [
      {
        to: '/home',
        icon: 'home',
        title: 'Home',
        active: currentPathname === '/home',
      },
      {
        to: '/notifications',
        icon: 'notifications',
        title: 'Notifications',
        isHidden: !me,
        active: currentPathname === '/notifications',
      },
      {
        to: '/groups',
        icon: 'group',
        title: 'Groups',
        active: currentPathname === '/groups',
      },
    ]

    return (
      <div className={[_s.default, _s.z4, _s.heightMin58PX, _s.width100PC].join(' ')}>
        <div className={[_s.default, _s.posFixed, _s.left0, _s.right0, _s.bottom0, _s.heightMin58PX, _s.width100PC, _s.bgPrimary, _s.borderTop1PX, _s.borderColorSecondary].join(' ')}>
          <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.height100PC, _s.heightMin58PX, _s.saveAreaInsetPB, _s.justifyContentSpaceAround].join(' ')}>
            {
              buttons.map((props) => {
                if (props.isHidden) return null

                const classes = CX({
                  borderTop2PX: 1,
                  borderColorTransparent: !props.active,
                  borderColorBrand: props.active,
                  height100PC: 1,
                  heightMin58PX: 1,
                  px15: 1,
                  flexGrow1: 1,
                  alignItemsCenter: 1,
                  justifyContentCenter: 1,
                })

                const color = props.active ? 'brand' : 'secondary'
                let childIcon;
                if (props.to === '/notifications' && notificationCount > 0) {
                  childIcon = (
                    <div className={[_s.posAbs, _s.ml5, _s.top0, _s.pt5, _s.pl20].join(' ')}>
                      <span className={[_s.bgRed, _s.colorWhite, _s.circle, _s.py2, _s.px2, _s.minWidth14PX, _s.displayBlock].join(' ')} style={{fontSize: '12px'}}>
                        {notificationCount}
                      </span>
                    </div>
                  )
                } else if (props.to === '/home' && homeItemsQueueCount > 0) {
                  childIcon = (
                    <div className={[_s.posAbs, _s.ml5, _s.top0, _s.pt2, _s.pl20].join(' ')}>
                      <span className={[_s.colorBrand, _s.circle, _s.py2, _s.px2, _s.minWidth14PX, _s.displayBlock].join(' ')} style={{fontSize: '18px'}}>
                        •
                      </span>
                    </div>
                  )
                }

                return (
                  <Button
                    isText
                    backgroundColor='none'
                    iconSize='20px'
                    color={color}
                    to={props.to}
                    icon={props.icon}
                    href={props.href}
                    title={props.title}
                    className={classes}
                  >
                    {childIcon}
                  </Button>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }

}
