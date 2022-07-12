import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import classNames from 'classnames/bind'
import { loadStatusRevisions } from '../../actions/status_revisions'
import ModalLayout from './modal_layout'
import RelativeTimestamp from '../relative_timestamp'
import Text from '../text'

const cx = classNames.bind(_s)

const messages = defineMessages({
  title: { id: 'status_revisions.heading', defaultMessage: 'Revision History' },
})

const mapStateToProps = (state) => ({
  loading: state.getIn(['status_revisions', 'loading']),
  error: state.getIn(['status_revisions', 'error']),
  revisions: state.getIn(['status_revisions', 'revisions']),
})

const mapDispatchToProps = (dispatch) => ({
  onLoadStatusRevisions(statusId) {
    dispatch(loadStatusRevisions(statusId))
  },
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class StatusRevisionsModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    status: ImmutablePropTypes.map.isRequired,
    onLoadStatusRevisions: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool,
    revisions: ImmutablePropTypes.list.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.onLoadStatusRevisions(this.props.status.get('id'))
  }

  render() {
    const {
      intl,
      status,
      revisions,
      onClose
    } = this.props

    return (
      <ModalLayout
        title={intl.formatMessage(messages.title)}
        width={480}
        onClose={onClose}
      >
        <div className={[_s.default]}>
          {
            revisions.map((revision, i) => {
              const isFirst = i === 0
              const isLast = i === revisions.size - 1

              const containerClasses = cx({
                default: 1,
                pt5: 1,
                pb10: 1,
                mt5: !isFirst,
                borderColorSecondary: !isLast,
                borderBottom1PX: !isLast,
              })

              return (
                <div key={`status-revision-${i}`} className={containerClasses}>
                  <div className={[_s.default, _s.pb5].join(' ')}>
                    <Text size='medium'>
                      {revision.get('text')}
                    </Text>
                  </div>
                  <div className={[_s.default]}>
                    <Text size='small' color='secondary'>
                      Edited on <RelativeTimestamp timestamp={revision.get('created_at')} />
                    </Text>
                  </div>
                </div>
              )
            })
          }
        </div>
      </ModalLayout>
    )
  }
}