import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import isObject from 'lodash.isobject'
import {
	changeGroupTitle,
	changeGroupDescription,
	changeGroupCoverImage,
	changeGroupPrivated,
	submit,
	setGroup,
	resetEditor,
} from '../actions/group_editor'
import { closeModal } from '../actions/modal'
import ColumnIndicator from '../components/column_indicator'
import Button from '../components/button'
import Divider from '../components/divider'
import Input from '../components/input'
import Text from '../components/text'
import Form from '../components/form'
import Textarea from '../components/textarea'
import FileInput from '../components/file_input'
import Switch from '../components/switch'

const messages = defineMessages({
	title: { id: 'groups.form.title', defaultMessage: 'Enter a new group title' },
	description: { id: 'groups.form.description', defaultMessage: 'Enter the group description' },
	coverImage: { id: 'groups.form.coverImage', defaultMessage: 'Upload a banner image' },
	privated: { id: 'groups.form.privated', defaultMessage: 'Private' },
	coverImageChange: { id: 'groups.form.coverImageChange', defaultMessage: 'Banner image selected' },
	create: { id: 'groups.form.create', defaultMessage: 'Create group' },
	update: { id: 'groups.form.update', defaultMessage: 'Update group' },
	titlePlaceholder: { id: 'groups.form.title_placeholder', defaultMessage: 'New group title...' },
	descriptionPlaceholder: { id: 'groups.form.description_placeholder', defaultMessage: 'Some group description...' },
})

const mapStateToProps = (state, { params }) => {
	const groupId = isObject(params) ? params['id'] : null
	const group = state.getIn(['groups', groupId])

	return {
		group,
		error: groupId && !group,
		titleValue: state.getIn(['group_editor', 'title']),
		descriptionValue: state.getIn(['group_editor', 'description']),
		coverImage: state.getIn(['group_editor', 'coverImage']),
		privatedValue: state.getIn(['group_editor', 'privated']),
		isSubmitting: state.getIn(['group_editor', 'isSubmitting']),
	}
}

const mapDispatchToProps = (dispatch) => ({
	onTitleChange: (value) => {
		dispatch(changeGroupTitle(value))
	},
	onDescriptionChange: (value) => {
		dispatch(changeGroupDescription(value))
	},
	onCoverImageChange: (imageData) => {
		dispatch(changeGroupCoverImage(imageData))
	},
	onResetEditor: () => {
		dispatch(resetEditor())
	},
	onSetGroup: (group) => {
		dispatch(setGroup(group))
	},
	onPrivatedChange: ({ target }) => {
		dispatch(changeGroupPrivated(target.checked))
	},
	onSubmit: (routerHistory) => {
		dispatch(submit(routerHistory))
		dispatch(closeModal())
	},
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class GroupCreate extends ImmutablePureComponent {

	static contextTypes = {
		router: PropTypes.object
	}

	static propTypes = {
		group: ImmutablePropTypes.map,
		titleValue: PropTypes.string.isRequired,
		descriptionValue: PropTypes.string.isRequired,
		coverImage: PropTypes.object,
		privatedValue: PropTypes.bool.isRequired,
		intl: PropTypes.object.isRequired,
		onTitleChange: PropTypes.func.isRequired,
		onDescriptionChange: PropTypes.func.isRequired,
		onPrivatedChange: PropTypes.func.isRequired,
		onResetEditor: PropTypes.func.isRequired,
		onSetGroup: PropTypes.func.isRequired,
		onSubmit: PropTypes.func.isRequired,
		isSubmitting: PropTypes.bool,
		onClose: PropTypes.func,
	}

	updateOnProps = [
		'group',
		'titleValue',
		'descriptionValue',
		'privatedValue',
		'coverImage',
		'isSubmitting',
	]

	componentDidMount() {
		if (!this.props.group) {
			this.props.onResetEditor()
		} else {
			this.props.onSetGroup(this.props.group)
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.group !== nextProps.group && !!nextProps.group) {
			this.props.onSetGroup(nextProps.group)
		}
	}

	handleCoverImageChange = (e) => {
		try {
      this.props.onCoverImageChange(e.target.files[0])
    } catch (error) {
     // 
    }
	}
	
	handleSubmit = (e) => {
		e.preventDefault()
		if (this.props.onClose) this.props.onClose()
		this.props.onSubmit(this.context.router.history)
	}

	render() {
		const {
			group,
			error,
			titleValue,
			descriptionValue,
			coverImage,
			privatedValue,
			intl,
			onTitleChange,
			onDescriptionChange,
			onPrivatedChange,
			isSubmitting,
			onSubmit,
		} = this.props

		if (!group && error) {
			return <ColumnIndicator type='missing' />
		}

		return (
			<Form onSubmit={onSubmit}>
				<Input
					title={intl.formatMessage(messages.title)}
					value={titleValue}
					onChange={onTitleChange}
					disabled={isSubmitting}
					placeholder={intl.formatMessage(messages.titlePlaceholder)}
				/>

				<Divider isInvisible />

				<Textarea
					title={intl.formatMessage(messages.description)}
					value={descriptionValue}
					onChange={onDescriptionChange}
					placeholder={intl.formatMessage(messages.descriptionPlaceholder)}
					disabled={isSubmitting}
				/>

				<Divider isInvisible />

				<FileInput
					disabled={isSubmitting}
					id='group-cover-photo'
					title={intl.formatMessage(coverImage === null ? messages.coverImage : messages.coverImageChange)}
					onChange={this.handleCoverImageChange}
					file={group ? group.get('cover_image_url') : undefined}
					width='340px'
					height='145px'
					isBordered
				/>

				<Divider isInvisible />

				<Switch
					label={intl.formatMessage(messages.privated)}
					checked={privatedValue}
					onChange={onPrivatedChange}
				/>

				<Divider isInvisible />

				<Button
					isDisabled={!titleValue || !descriptionValue && !isSubmitting}
					onClick={this.handleSubmit}
				>
					<Text color='inherit' align='center'>
						{intl.formatMessage(!!group ? messages.update : messages.create)}
					</Text>
				</Button>

			</Form>
		)
	}

}
