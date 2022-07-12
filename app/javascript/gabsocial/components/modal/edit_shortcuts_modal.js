import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { removeShortcut } from '../../actions/shortcuts'
import ModalLayout from './modal_layout'
import List from '../list'

const messages = defineMessages({
  title: { id: 'shortcuts.edit', defaultMessage: 'Edit Shortcuts' },
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
})

const mapStateToProps = (state) => ({
  shortcuts: state.getIn(['shortcuts', 'items']),
})

const mapDispatchToProps = (dispatch) => ({
  onRemoveShortcut(shortcutId) {
    dispatch(removeShortcut(shortcutId))
  },
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class EditShortcutsModal extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onRemoveShortcut: PropTypes.func.isRequired,
    shortcuts: ImmutablePropTypes.list,
  }

  handleOnRemoveShortcut = (shortcutId) => {
    this.props.onRemoveShortcut(shortcutId)
  }

  render() {
    const {
      intl,
      onClose,
      shortcuts,
    } = this.props

    const listItems = shortcuts.map((s) => ({
      title: s.get('title'),
      image: s.get('image'),
      actionIcon: 'subtract',
      onClick: () => this.handleOnRemoveShortcut(s.get('id')),
    }))

    return (
      <ModalLayout
        title={intl.formatMessage(messages.title)}
        onClose={onClose}
        width={460}
        noPadding
      >
        <div className={_s.boxShadowNone}>
          <List
            scrollKey='shortcuts'
            emptyMessage='You have no shortcuts'
            items={listItems}
          />
        </div>
      </ModalLayout>
    )
  }

}
