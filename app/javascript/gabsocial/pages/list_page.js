import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import { openModal } from '../actions/modal'
import {
  MODAL_LIST_EDITOR,
  // MODAL_LIST_TIMELINE_SETTINGS,
} from '../constants'
import PageTitle from '../features/ui/util/page_title'
import LinkFooter from '../components/link_footer'
import DefaultLayout from '../layouts/default_layout'
import ListDetailsPanel from '../components/panel/list_details_panel'
import WhoToFollowPanel from '../components/panel/who_to_follow_panel'
import TrendsPanel from '../components/panel/trends_panel'

const messages = defineMessages({
  list: { id: 'list', defaultMessage: 'List' },
})

const mapStateToProps = (state, props) => ({
  list: state.getIn(['lists', props.params.id]),
})

const mapDispatchToProps = (dispatch) => ({
  onOpenListEditModal(list) {
    if (!list) return
    const listId = list.get('id')
    dispatch(openModal(MODAL_LIST_EDITOR, { id: listId }))
  },
  // : todo :
  // onOpenListTimelineSettingsModal() {
  //   dispatch(openModal(MODAL_LIST_TIMELINE_SETTINGS))
  // },
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class ListPage extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    list: ImmutablePropTypes.map,
    children: PropTypes.node.isRequired,
    onOpenListEditModal: PropTypes.func.isRequired,
    // onOpenListTimelineSettingsModal: PropTypes.func.isRequired,
  }
  
  handleOnOpenListEditModal = () => {
    this.props.onOpenListEditModal(this.props.list)
  }

  render() {
    const {
      intl,
      children,
      list,
      onOpenListEditModal,
      // onOpenListTimelineSettingsModal
    } = this.props

    const title = !!list ? list.get('title') : ''

    return (
      <DefaultLayout
        showBackBtn
        title={intl.formatMessage(messages.list)}
        page='list'
        actions={[
          {
            icon: 'cog',
            onClick: this.handleOnOpenListEditModal,
          },
          // {
          //   icon: 'ellipsis',
          //   onClick: onOpenListTimelineSettingsModal,
          // },
        ]}
        layout={[
          <ListDetailsPanel list={list} onEdit={this.handleOnOpenListEditModal} key='list-page-list-panel' />,
          <TrendsPanel key='list-page-trends-panel' />,
          <WhoToFollowPanel key='list-page-wtf-panel' />,
          <LinkFooter key='list-page-link-footer' />,
        ]}
      >
        <PageTitle path={[title, intl.formatMessage(messages.list)]} />
        { children }
      </DefaultLayout>
    )
  }
}