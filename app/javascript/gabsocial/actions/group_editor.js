import api from '../api'
import { me } from '../initial_state'

export const GROUP_CREATE_REQUEST = 'GROUP_CREATE_REQUEST'
export const GROUP_CREATE_SUCCESS = 'GROUP_CREATE_SUCCESS'
export const GROUP_CREATE_FAIL = 'GROUP_CREATE_FAIL'

export const GROUP_UPDATE_REQUEST = 'GROUP_UPDATE_REQUEST'
export const GROUP_UPDATE_SUCCESS = 'GROUP_UPDATE_SUCCESS'
export const GROUP_UPDATE_FAIL = 'GROUP_UPDATE_FAIL'

export const GROUP_EDITOR_TITLE_CHANGE = 'GROUP_EDITOR_TITLE_CHANGE'
export const GROUP_EDITOR_DESCRIPTION_CHANGE = 'GROUP_EDITOR_DESCRIPTION_CHANGE'
export const GROUP_EDITOR_COVER_IMAGE_CHANGE = 'GROUP_EDITOR_COVER_IMAGE_CHANGE'
export const GROUP_EDITOR_PRIVATED_CHANGE = 'GROUP_EDITOR_PRIVATED_CHANGE'

export const GROUP_EDITOR_RESET = 'GROUP_EDITOR_RESET'
export const GROUP_EDITOR_SETUP = 'GROUP_EDITOR_SETUP'

export const submit = (routerHistory) => (dispatch, getState) => {
	if (!me) return

	const groupId = getState().getIn(['group_editor', 'groupId'])
	const title = getState().getIn(['group_editor', 'title'])
	const description = getState().getIn(['group_editor', 'description'])
	const coverImage = getState().getIn(['group_editor', 'coverImage'])
	const privated = getState().getIn(['group_editor', 'privated'])

	if (groupId === null) {
		dispatch(create(title, description, coverImage, privated, routerHistory))
	} else {
		dispatch(update(groupId, title, description, coverImage, privated, routerHistory))
	}
};


const create = (title, description, coverImage, privated, routerHistory) => (dispatch, getState) => {
	if (!me) return

	dispatch(createRequest())

	const formData = new FormData()
	formData.append('title', title)
	formData.append('description', description)
	formData.append('is_privated', privated)

	if (coverImage !== null) {
		formData.append('cover_image', coverImage)
	}

	api(getState).post('/api/v1/groups', formData, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	}).then(({ data }) => {
		dispatch(createSuccess(data))
		routerHistory.push(`/groups/${data.id}/${data.title.split(" ").join("-")}`)
	}).catch(err => dispatch(createFail(err)))
};


export const createRequest = (id) => ({
	type: GROUP_CREATE_REQUEST,
	id,
})

export const createSuccess = (group) => ({
	type: GROUP_CREATE_SUCCESS,
	group,
})

export const createFail = (error) => ({
	type: GROUP_CREATE_FAIL,
	error,
})

const update = (groupId, title, description, coverImage, privated, routerHistory) => (dispatch, getState) => {
	if (!me) return

	dispatch(updateRequest())

	const formData = new FormData()
	formData.append('title', title)
	formData.append('description', description);
	formData.append('privated', privated);

	if (coverImage !== null) {
		formData.append('cover_image', coverImage);
	}

	api(getState).put(`/api/v1/groups/${groupId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(({ data }) => {
		dispatch(updateSuccess(data));
		routerHistory.push(`/groups/${data.id}/${data.title.split(" ").join("-")}`)
	}).catch(err => dispatch(updateFail(err)));
};


export const updateRequest = (id) => ({
	type: GROUP_UPDATE_REQUEST,
	id,
});

export const updateSuccess = (group) => ({
	type: GROUP_UPDATE_SUCCESS,
	group,
});

export const updateFail = (error) => ({
	type: GROUP_UPDATE_FAIL,
	error,
})

export const resetEditor = () => ({
	type: GROUP_EDITOR_RESET
});

export const setGroup = (group) => ({
	type: GROUP_EDITOR_SETUP,
	group,
});

export const changeGroupTitle = (title) => ({
	type: GROUP_EDITOR_TITLE_CHANGE,
	title,
})

export const changeGroupDescription = (description) => ({
	type: GROUP_EDITOR_DESCRIPTION_CHANGE,
	description,
})

export const changeGroupCoverImage = (imageData) => ({
	type: GROUP_EDITOR_COVER_IMAGE_CHANGE,
	value: imageData,
})

export const changeGroupPrivated = (privated) => ({
	type: GROUP_EDITOR_PRIVATED_CHANGE,
	privated,
})
