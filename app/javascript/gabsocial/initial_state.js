'use strict';

const element = document.getElementById('initial-state');
const initialState = element && JSON.parse(element.textContent);

const getMeta = (prop) => initialState && initialState.meta && initialState.meta[prop];

export const autoPlayGif = getMeta('auto_play_gif');
export const displayMedia = getMeta('display_media');
export const expandSpoilers = getMeta('expand_spoilers');
export const unfollowModal = getMeta('unfollow_modal');
export const boostModal = getMeta('boost_modal');
export const deleteModal = getMeta('delete_modal');
export const me = getMeta('me');
export const meUsername = getMeta('username');
export const searchEnabled = getMeta('search_enabled');
export const invitesEnabled = getMeta('invites_enabled');
export const repository = getMeta('repository');
export const source_url = getMeta('source_url');
export const version = getMeta('version');
export const profile_directory = getMeta('profile_directory');
export const isStaff = getMeta('is_staff');
export const promotions = initialState && initialState.promotions;
export const unreadCount = getMeta('unread_count');
export const lastReadNotificationId = getMeta('last_read_notification_id');
export const monthlyExpensesComplete = getMeta('monthly_expenses_complete');
export const favouritesCount = getMeta('favourites_count');
export const isFirstSession = getMeta('is_first_session');

export default initialState;
