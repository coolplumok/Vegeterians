import { defineMessages, injectIntl } from 'react-intl'
import { OrderedSet } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { changeReportComment, submitReport } from '../../actions/reports'
import { expandAccountTimeline } from '../../actions/timelines'
import { makeGetAccount } from '../../selectors'
import ModalLayout from './modal_layout'
import ResponsiveClassesComponent from '../../features/ui/util/responsive_classes_component'
import Button from '../button'
import StatusCheckBox from '../status_check_box'
import Text from '../text'
import Textarea from '../textarea'

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  placeholder: { id: 'report.placeholder', defaultMessage: 'Additional comments' },
  submit: { id: 'report.submit', defaultMessage: 'Submit' },
  hint: { id: 'report.hint', defaultMessage: 'The report will be sent to your server moderators. You can provide an explanation of why you are reporting this account below:' },
  target: { id: 'report.target', defaultMessage: 'Report {target}' },
})

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount()

  const mapStateToProps = (state) => {
    const accountId = state.getIn(['reports', 'new', 'account_id'])

    return {
      isSubmitting: state.getIn(['reports', 'new', 'isSubmitting']),
      account: getAccount(state, accountId),
      comment: state.getIn(['reports', 'new', 'comment']),
      statusIds: OrderedSet(state.getIn(['timelines', `account:${accountId}:with_replies`, 'items'])).union(state.getIn(['reports', 'new', 'status_ids'])),
    }
  }

  return mapStateToProps
}

export default
@connect(makeMapStateToProps)
@injectIntl
class ReportModal extends ImmutablePureComponent {

  static propTypes = {
    isSubmitting: PropTypes.bool,
    account: ImmutablePropTypes.map,
    statusIds: ImmutablePropTypes.orderedSet.isRequired,
    comment: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  handleCommentChange = (value) => {
    this.props.dispatch(changeReportComment(value))
  }

  handleSubmit = () => {
    this.props.dispatch(submitReport())
  }

  handleKeyDown = e => {
    if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
      this.handleSubmit()
    }
  }

  componentDidMount () {
    this.props.dispatch(expandAccountTimeline(this.props.account.get('id'), { withReplies: true }))
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.account !== nextProps.account && nextProps.account) {
      this.props.dispatch(expandAccountTimeline(nextProps.account.get('id'), { withReplies: true }))
    }
  }

  render () {
    const {
      account, 
      comment,
      intl,
      statusIds,
      isSubmitting,
      onClose
    } = this.props

    if (!account) return null

    return (
      <ModalLayout
        noPadding
        title={intl.formatMessage(messages.target, {
          target: account.get('acct')
        })}
        onClose={onClose}
      >

        <ResponsiveClassesComponent
          classNames={[_s.default, _s.flexRow].join(' ')}
          classNamesSmall={[_s.default, _s.flexColumnReverse].join(' ')}
        >
          <ResponsiveClassesComponent
            classNames={[_s.default, _s.width50PC, _s.py10, _s.px15, _s.borderRight1PX, _s.borderColorSecondary].join(' ')}
            classNamesSmall={[_s.default, _s.width100PC, _s.py10, _s.px15, _s.borderTop1PX, _s.borderColorSecondary].join(' ')}
          >
            <Text color='secondary' size='small'>
              {intl.formatMessage(messages.hint)}
            </Text>

            <div className={_s.my10}>
              <Textarea
                placeholder={intl.formatMessage(messages.placeholder)}
                value={comment}
                onChange={this.handleCommentChange}
                onKeyDown={this.handleKeyDown}
                disabled={isSubmitting}
                autoFocus
              />
            </div>
            
            <Button
              isDisabled={isSubmitting}
              onClick={this.handleSubmit}
              className={_s.mtAuto}
            >
              {intl.formatMessage(messages.submit)}
            </Button>
          </ResponsiveClassesComponent>

          <ResponsiveClassesComponent
            classNames={[_s.default, _s.width50PC, _s.heightMax80VH].join(' ')}
            classNamesSmall={[_s.default, _s.width100PC, _s.height260PX].join(' ')}
          >
            <div className={[_s.default, _s.height100PC, _s.overflowYScroll, _s.pr15, _s.py10].join(' ')}>
              {
                statusIds.map(statusId => (
                  <StatusCheckBox id={statusId} key={statusId} disabled={isSubmitting} />
                ))
              }
            </div>
          </ResponsiveClassesComponent>
        </ResponsiveClassesComponent>

      </ModalLayout>
    )
  }

}
