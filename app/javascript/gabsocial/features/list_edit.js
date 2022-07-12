import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { injectIntl, defineMessages } from 'react-intl'
import isObject from 'lodash.isobject'
import {
  setupListEditor,
  resetListEditor,
  removeFromListEditor,
  addToListEditor,
  fetchListSuggestions,
  clearListSuggestions,
  changeListSuggestions,
} from '../actions/lists'
import { openModal } from '../actions/modal'
import {
  MODAL_LIST_EDITOR,
  MODAL_LIST_DELETE,
} from '../constants'
import Account from '../components/account'
import Button from '../components/button'
import Divider from '../components/divider'
import Input from '../components/input'
import TabBar from '../components/tab_bar'
import Text from '../components/text'

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  save: { id: 'lists.new.save_title', defaultMessage: 'Save Title' },
  changeTitle: { id: 'lists.edit.submit', defaultMessage: 'Change title' },
  addToList: { id: 'lists.account.add', defaultMessage: 'Add to list' },
  removeFromList: { id: 'lists.account.remove', defaultMessage: 'Remove from list' },
  editList: { id: 'lists.edit', defaultMessage: 'Edit list' },
  editListTitle: { id: 'lists.new.edit_title_placeholder', defaultMessage: 'Edit list title' },
  remove: { id: 'lists.account.remove', defaultMessage: 'Remove from list' },
  add: { id: 'lists.account.add', defaultMessage: 'Add to list' },
  search: { id: 'lists.search', defaultMessage: 'Search people...' },
  searchMembers: { id: 'lists.search_members', defaultMessage: 'Search members...' },
  searchTitle: { id: 'tabs_bar.search', defaultMessage: 'Search' },
})

const mapStateToProps = (state, { params, id }) => {
  const listId = isObject(params) ? params['id'] : id

	return {
    listId,
    list: state.getIn(['lists', listId]),
    title: state.getIn(['listEditor', 'title']),
    disabled: !state.getIn(['listEditor', 'isChanged']),
    accountIds: state.getIn(['listEditor', 'accounts', 'items']),
    searchAccountIds: state.getIn(['listEditor', 'suggestions', 'items']),
    searchSuggestionsValue: state.getIn(['listEditor', 'suggestions', 'value']),
  }
}

const mapDispatchToProps = (dispatch) => ({

  onDeleteList(list) {
    dispatch(openModal(MODAL_LIST_DELETE, { list }))
  },

  onChangeTitle(value) {
    dispatch(changeListEditorTitle(value))
  },

  onUpdateList() {
    dispatch(submitListEditor(false))
  },

  onInitialize(listId) {
    dispatch(setupListEditor(listId))
  },

  onReset() {
    dispatch(resetListEditor())
  },
  
  onRemoveAccountFromList(accountId) {
    dispatch(removeFromListEditor(accountId))
  },
  
  onAddAccountToList(accountId) {
    dispatch(addToListEditor(accountId))
  },

  onSubmitSearchSuggestions(value) {
    dispatch(fetchListSuggestions(value))
  },

  onClearSearchSuggestions() {
    dispatch(clearListSuggestions())
  },

  onChangeSuggestions(value) {
    dispatch(changeListSuggestions(value))
  },

})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class ListEdit extends ImmutablePureComponent {

  static propTypes = {
    list: ImmutablePropTypes.map,
    title: PropTypes.string,
    listId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    onInitialize: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    searchSuggestionsValue: PropTypes.string.isRequired,
    accountIds: ImmutablePropTypes.list.isRequired,
    searchAccountIds: ImmutablePropTypes.list.isRequired,
    onRemoveAccountFromList: PropTypes.func.isRequired,
    onAddAccountToList: PropTypes.func.isRequired,
    onChangeSuggestions: PropTypes.func.isRequired,
    onClearSearchSuggestions: PropTypes.func.isRequired,
    onSubmitSearchSuggestions: PropTypes.func.isRequired,
    onDeleteList: PropTypes.func.isRequired,
    tab: PropTypes.string,
  }

  state = {
    activeTab: this.props.tab || 'members'
  }

  componentDidMount() {
    const { onInitialize, listId } = this.props
    if (listId) {
      onInitialize(listId)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.listId !== prevProps.listId) {
      this.props.onInitialize(this.props.listId)
    }
  }

  componentWillUnmount() {
    this.props.onReset()
  }

  handleChangeTab = (tab) => {
    this.setState({ activeTab: tab })
  }

  onClickClose = () => {
    this.props.onClose(MODAL_LIST_EDITOR)
  }

  handleOnDeleteList = () => {
    this.props.onDeleteList(this.props.list)
  }

  handleAddOrRemoveFromList = (accountId) => {
    if (this.props.accountIds.includes(accountId)) {
      this.props.onRemoveAccountFromList(accountId)
    } else {
      this.props.onAddAccountToList(accountId)
    }
  }

  handleSearchSuggestionsChange = (value) => {
    this.props.onChangeSuggestions(value)
  }

  handleSearchSuggestionsKeyUp = (e) => {
    if (e.keyCode === 13) {
      this.props.onSubmitSearchSuggestions(this.props.searchSuggestionsValue)
    }
  }

  handleSearchSuggestionsSubmit = () => {
    this.props.onSubmitSearchSuggestions(this.props.searchSuggestionsValue)
  }

  render() {
    const {
      title,
      accountIds,
      searchAccountIds,
      intl,
      searchSuggestionsValue,
    } = this.props
    const { activeTab } = this.state

    // : todo : save new list title

    return (
      <div>
        <div className={[_s.default, _s.borderTop1PX, _s.borderColorSecondary].join(' ')}>
          <div className={[_s.default, _s.z4, _s.bgPrimary, _s.px15, _s.top0, _s.posSticky, _s.borderBottom1PX, _s.borderColorSecondary,].join(' ')}>
            <TabBar
              tabs={[
                {
                  title: 'Members list',
                  onClick: () => this.handleChangeTab('members'),
                  active: activeTab === 'members',
                },
                {
                  title: 'Add new',
                  onClick: () => this.handleChangeTab('add-new'),
                  active: activeTab === 'add-new',
                },
                {
                  title: 'Settings',
                  onClick: () => this.handleChangeTab('settings'),
                  active: activeTab === 'settings',
                },
              ]}
            />
          </div>

          {
            activeTab === 'members' &&
            <div className={[_s.default, _s.mb10, _s.py10].join(' ')}>
              <div className={[_s.default, _s.pb10, _s.pt5].join(' ')}>
                <div className={[_s.default].join(' ')}>
                  <Text weight='bold' size='small' color='secondary' className={[_s.default, _s.px15, _s.mt5, _s.mb15].join(' ')}>
                    Total members ({accountIds.size})
                  </Text>
                  {
                    accountIds &&
                    accountIds.map((accountId) => (
                      <Account
                        compact
                        key={`remove-from-list-${accountId}`}
                        id={accountId}
                        onActionClick={() => this.handleAddOrRemoveFromList(accountId)}
                        actionIcon='subtract'
                      />
                    ))
                  }
                </div>
              </div>
            </div>
          }

          {
            activeTab === 'settings' &&
            <div className={[_s.default, _s.mb10, _s.pb10, _s.px15].join(' ')}>
              <div className={[_s.default, _s.py15].join(' ')}>
                <Input
                  title={intl.formatMessage(messages.editListTitle)}
                  placeholder='My new list title...'
                  value={title}
                // onChange={onChange}
                // onSubmit={onSubmit}
                // disabled={disabled}
                />
              </div>
              <Divider />
              <div className={_s.mb10}>
                <Button
                  onClick={this.handleOnDeleteList}
                  backgroundColor='danger'
                >
                  Delete List
                </Button>
              </div>
              <Text size='extraSmall' color='secondary'>
                Once you delete a list you cannot retrieve it.
              </Text>
            </div>
          }

          {
            activeTab === 'add-new' &&
            <div className={[_s.default, _s.mb10, _s.py10].join(' ')}>
              <div className={[_s.default, _s.px15].join(' ')}>
                <Input
                  placeholder={intl.formatMessage(messages.search)}
                  value={searchSuggestionsValue}
                  onChange={this.handleSearchSuggestionsChange}
                  onKeyUp={this.handleSearchSuggestionsKeyUp}
                  handleSubmit={this.handleSearchSuggestionsSubmit}
                  title={intl.formatMessage(messages.searchTitle)}
                  prependIcon='search'
                  hideLabel
                />
              </div>

              <div className={[_s.default, _s.pt10].join(' ')}>
                <div className={[_s.default].join(' ')}>
                  <Text weight='bold' size='small' color='secondary' className={[_s.default, _s.px15, _s.mt5, _s.mb15].join(' ')}>
                    Search results ({searchAccountIds.size})
                  </Text>
                  {
                    searchAccountIds &&
                    searchAccountIds.map((accountId) => {
                      if (accountIds.includes(accountId)) return null
                      return (
                        <Account
                          key={`add-to-list-${accountId}`}
                          id={accountId}
                          compact
                          onActionClick={() => this.handleAddOrRemoveFromList(accountId)}
                          actionIcon='add'
                        />
                      )
                      })
                  }
                </div>
              </div>
            </div>
          }

        </div>
      </div>
    )

  }

}
