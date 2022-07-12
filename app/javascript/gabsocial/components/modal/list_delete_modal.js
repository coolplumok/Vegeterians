import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { injectIntl, defineMessages } from 'react-intl'
import { deleteList } from '../../actions/lists'
import ConfirmationModal from './confirmation_modal'

const messages = defineMessages({
  title: { id: 'list_delete_title', defaultMessage: 'Delete "{list}"' },
  listMessage: { id: 'confirmations.list_delete.message', defaultMessage: 'Are you sure you want to delete "{list}"?' },
  delete: { id: 'delete', defaultMessage: 'Delete' },
})

const mapDispatchToProps = (dispatch) => ({
  onConfirm: (listId) => dispatch(deleteList(listId)),
})

export default
@injectIntl
@connect(null, mapDispatchToProps)
class ListDeleteModal extends ImmutablePureComponent {

  static propTypes = {
    list: ImmutablePropTypes.map.isRequired,
    intl: PropTypes.object.isRequired,
    onConfirm: PropTypes.func.isRequired,
  }

  handleClick = () => {
    this.props.onConfirm(this.props.list.get('id'))
    // : todo :
    // redirect back to /lists
  }

  render() {
    const { list, intl, onClose } = this.props

    const title = intl.formatMessage(messages.title, {
      list: !!list ? list.get('title') : '',
    })
    const message = intl.formatMessage(messages.listMessage, {
      list: !!list ? list.get('title') : '',
    })

    return (
      <ConfirmationModal
        title={title}
        message={message}
        confirm={intl.formatMessage(messages.delete)}
        onConfirm={this.handleClick}
        onClose={onClose}
      />
    )
  }

}
