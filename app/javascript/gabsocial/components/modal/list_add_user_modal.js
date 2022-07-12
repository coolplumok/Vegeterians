import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import { getOrderedLists } from '../../selectors'
import {
  fetchLists,
  addToList,
} from '../../actions/lists'
import ModalLayout from './modal_layout'
import Button from '../button'
import Text from '../text'

const messages = defineMessages({
  add: { id: 'lists.account.add', defaultMessage: 'Add to list' },
})

const mapStateToProps = (state) => ({
  lists: getOrderedLists(state),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchLists: () => dispatch(fetchLists()),

  onAddToList(listId, accountId) {
    dispatch(addToList(listId, accountId))
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class ListAddUserModal extends ImmutablePureComponent {

  static propTypes = {
    accountId: PropTypes.string.isRequired,
    lists: ImmutablePropTypes.list,
    intl: PropTypes.object.isRequired,
    onAddToList: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onFetchLists: PropTypes.func.isRequired,
  }

  updateOnProps = [
    'lists',
  ]

  componentDidMount() {
    this.props.onFetchLists()
  }

  handleOnAddToList = (listId) => {
    this.props.onAddToList(listId, this.props.accountId)
  }

  render() {
    const {
      intl,
      lists,
      onClose,
    } = this.props

    const title = intl.formatMessage(messages.add)

    return (
      <ModalLayout
        noPadding
        title={title}
        onClose={onClose}
      >
        <div className={[_s.default, _s.boxShadowNone].join(' ')}>
          <div>
            {
              lists && lists.map((list) => {
                return (
                  <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.py10, _s.px15, _s.borderColorSecondary, _s.borderBottom1PX].join(' ')}>
                    <Text color='primary' size='large' className={[_s.overflowHidden, _s.flexNormal, _s.pr5, _s.textOverflowEllipsis].join(' ')}>
                      {list.get('title')}
                    </Text>
                    <Button
                      isOutline
                      backgroundColor='none'
                      color='brand'
                      onClick={() => this.handleOnAddToList(list.get('id'))}
                    >
                      {title}
                    </Button>
                  </div>
                )
              })
            }
          </div>
        </div>
      </ModalLayout>
    )
  }

}