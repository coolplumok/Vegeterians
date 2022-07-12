import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { defineMessages, injectIntl } from 'react-intl'
import isObject from 'lodash.isobject'
import {
	joinPrivateGroup,
} from '../actions/groups'
import { closeModal } from '../actions/modal'
import ColumnIndicator from '../components/column_indicator'
import Button from '../components/button'
import Divider from '../components/divider'
import Text from '../components/text'
import Form from '../components/form'
import Textarea from '../components/textarea'

const messages = defineMessages({
	description: { id: 'groups.form.description', defaultMessage: 'This group is a private group and requires approval by a group admin. Please let us know why you would like to join this group. By joining you agree to abide by the Group policies as listed in our About section (as changed from time to time) and understand that I may be removed by the group admin for failing to do so' },
	apply: { id: 'groups.form.join', defaultMessage: 'Apply' },
})

const mapStateToProps = (state, { params }) => {
	const groupId = isObject(params) ? params['id'] : null
	const group = state.getIn(['groups', groupId])

	return {
		group,
		error: groupId && !group,
	}
}

const mapDispatchToProps = (dispatch) => ({
	onSubmit: (groupId, description) => {
		dispatch(joinPrivateGroup(groupId, description))
		dispatch(closeModal())
	},
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class GroupJoinPrivate extends ImmutablePureComponent {

	static contextTypes = {
		router: PropTypes.object
	}

	static propTypes = {
		group: ImmutablePropTypes.map,
		intl: PropTypes.object.isRequired,
		onSubmit: PropTypes.func.isRequired,
		onClose: PropTypes.func,
	}

	state = {
		isSubmitting: false,
		description: '',
	}

	updateOnProps = [
		'group',
	]

	handleDescriptionChange = (description) => {
		this.setState({
			description: description
		})
	}
	
	handleSubmit = (e) => {
		e.preventDefault()
		if (this.props.onClose) this.props.onClose()
		this.props.onSubmit(this.props.group.get('id'), this.state.description)
	}

	render() {
		const {
			group,
			error,
			intl,
			onSubmit,
		} = this.props

		const { isSubmitting, description } = this.state

		if (!group && error) {
			return <ColumnIndicator type='missing' />
		}

		return (
			<Form onSubmit={onSubmit}>
				<Textarea
					title={intl.formatMessage(messages.description)}
					value={description}
					onChange={this.handleDescriptionChange}
					disabled={isSubmitting}
				/>

				<Divider isInvisible />

				<Button
					isDisabled={!description || isSubmitting}
					onClick={this.handleSubmit}
				>
					<Text color='inherit' align='center'>
						{intl.formatMessage(messages.apply)}
					</Text>
				</Button>

			</Form>
		)
	}

}
