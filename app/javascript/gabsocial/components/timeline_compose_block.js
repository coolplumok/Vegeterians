import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { injectIntl, defineMessages } from 'react-intl'
import { me } from '../initial_state'
import { BREAKPOINT_EXTRA_SMALL } from '../constants'
import ComposeFormContainer from '../features/compose/containers/compose_form_container'
import ResponsiveClassesComponent from '../features/ui/util/responsive_classes_component'
import Responsive from '../features/ui/util/responsive_component'
import Avatar from './avatar'
import Heading from './heading'

const messages = defineMessages({
  createPost: { id: 'column_header.create_post', defaultMessage: 'Create Post' },
})

const mapStateToProps = (state) => ({
  account: state.getIn(['accounts', me]),
})

export default
@connect(mapStateToProps)
@injectIntl
class TimelineComposeBlock extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    account: ImmutablePropTypes.map.isRequired,
    size: PropTypes.number,
    modal: PropTypes.bool,
  }

  static defaultProps = {
    size: 32,
  }

  render() {
    const {
      account,
      size,
      intl,
      modal,
      ...rest
    } = this.props

    if (modal) {
      return (
        <section className={_s.default}>
          <div className={[_s.default, _s.flexRow].join(' ')}>
            <ComposeFormContainer {...rest} modal={modal} />
          </div>
        </section>
      )
    }

    return (
      <section className={[_s.default, _s.mb15].join(' ')}>
        <ResponsiveClassesComponent
          classNames={[_s.default, _s.boxShadowBlock, _s.bgPrimary, _s.overflowHidden, _s.radiusSmall].join(' ')}
          classNamesXS={[_s.default, _s.boxShadowBlock, _s.bgPrimary, _s.overflowHidden].join(' ')}
        >
          <Responsive min={BREAKPOINT_EXTRA_SMALL}>
            <div className={[_s.default, _s.bgSubtle, _s.borderTop1PX, _s.borderBottom1PX, _s.borderColorSecondary, _s.px15, _s.py2, _s.alignItemsCenter, _s.flexRow].join(' ')}>
              <div className={_s.mr10}>
                <Avatar account={account} size={20} noHover />
              </div>
              <Heading size='h5'>
                {intl.formatMessage(messages.createPost)}
              </Heading>
            </div>
          </Responsive>
          <ComposeFormContainer {...rest} />
        </ResponsiveClassesComponent>
      </section>
    )
  }

}