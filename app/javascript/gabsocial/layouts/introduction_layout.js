import Block from '../components/block'
import Icon from '../components/icon'
import BundleColumnError from '../components/bundle_column_error'
import Bundle from '../features/ui/util/bundle'
import { Introduction } from '../features/ui/util/async_components'

export default class IntroductionLayout extends PureComponent {

  renderError = (props) => {
    return <BundleColumnError {...props} />
  }

  render() {
    return (
      <div className={[_s.default, _s.width100PC, _s.heightMin100VH, _s.bgTertiary].join(' ')}>

        <div className={[_s.default, _s.z4, _s.heightMin53PX, _s.width100PC].join(' ')}>
          <div className={[_s.default, _s.heightMin53PX, _s.bgNavigation, _s.alignItemsCenter, _s.z3, _s.top0, _s.right0, _s.left0, _s.posFixed].join(' ')} >
            <div className={[_s.default, _s.saveAreaInsetPT, _s.saveAreaInsetPL, _s.saveAreaInsetPR, _s.flexRow, _s.width1255PX].join(' ')}>
              <div className={[_s.default, _s.flexRow].join(' ')}>

                <h1 className={[_s.default, _s.mr15].join(' ')}>
                  <div className={[_s.default, _s.justifyContentCenter, _s.noSelect, _s.noUnderline, _s.height53PX, _s.px10, _s.mr15].join(' ')}>
                    <Icon id='logo' className={_s.fillNavigationBrand} />
                  </div>
                </h1>

              </div>
            </div>
          </div>
        </div>

        <div className={[_s.default, _s.flexRow, _s.width100PC].join(' ')}>
          <div className={[_s.default, _s.width100PC].join(' ')}>
            <main role='main'>
              <div className={[_s.default, _s.alignItemsCenter, _s.py15, _s.px15, _s.mlAuto, _s.mrAuto].join(' ')}>

                <div className={[_s.default, _s.width645PX, _s.maxWidth100PC42PX].join(' ')}>
                  <Block>
                    <Bundle fetchComponent={Introduction} error={this.renderError}>
                      {Component => (<Component />)}
                    </Bundle>
                  </Block>
                </div>

              </div>
            </main>
          </div>
        </div>

      </div>
    )
  }

}
