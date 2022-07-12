import { createSelector } from 'reselect'
import { List as ImmutableList } from 'immutable'
import { me } from '../initial_state'

const getAccountBase = (state, id) => state.getIn(['accounts', id], null)
const getAccountCounters = (state, id) => state.getIn(['accounts_counters', id], null)
const getAccountRelationship = (state, id) => state.getIn(['relationships', id], null)
const getAccountMoved = (state, id) => state.getIn(['accounts', state.getIn(['accounts', id, 'moved'])])

export const makeGetAccount = () => {
  return createSelector([getAccountBase, getAccountCounters, getAccountRelationship, getAccountMoved], (base, counters, relationship, moved) => {
    if (base === null) {
      return null
    }

    return base.merge(counters).withMutations(map => {
      map.set('relationship', relationship)
      map.set('moved', moved)
    });
  });
};

const toServerSideType = columnType => {
  switch (columnType) {
    case 'home':
    case 'notifications':
    case 'public':
    case 'thread':
      return columnType
    default:
      if (columnType.indexOf('list:') > -1) {
        return 'home'
      } else {
        return 'public' // community, account, hashtag
      }
  }
};

export const getFilters = (state, { contextType }) => state.get('filters', ImmutableList()).filter(filter => contextType && filter.get('context').includes(toServerSideType(contextType)) && (filter.get('expires_at') === null || Date.parse(filter.get('expires_at')) > (new Date())));

const escapeRegExp = string =>
  string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string

export const regexFromFilters = filters => {
  if (filters.size === 0) {
    return null;
  }

  return new RegExp(filters.map(filter => {
    let expr = escapeRegExp(filter.get('phrase'));

    if (filter.get('whole_word')) {
      if (/^[\w]/.test(expr)) {
        expr = `\\b${expr}`;
      }

      if (/[\w]$/.test(expr)) {
        expr = `${expr}\\b`;
      }
    }

    return expr;
  }).join('|'), 'i');
};

export const makeGetStatus = () => {
  return createSelector(
    [
      (state) => state,
      (state, { id }) => state.getIn(['statuses', id]),
      (state, { id }) => state.getIn(['statuses', state.getIn(['statuses', id, 'quote_of_id'])]),
      (state, { id }) => state.getIn(['statuses', state.getIn(['statuses', id, 'reblog'])]),
      (state, { id }) => state.getIn(['accounts', state.getIn(['statuses', id, 'account'])]),
      (state, { id }) => state.getIn(['accounts', state.getIn(['statuses', state.getIn(['statuses', id, 'quote_of_id']), 'account'])]),
      (state, { id }) => state.getIn(['accounts', state.getIn(['statuses', state.getIn(['statuses', id, 'reblog']), 'account'])]),
      (state, { username }) => username,
      getFilters,
    ],

    (state, statusBase, quotedStatus, statusRepost, accountBase, accountQuoted, accountRepost, username, filters) => {
      if (!statusBase) {
        return null
      }

      const accountUsername = accountBase.get('acct');
      //Must be owner of status if username exists
      if (accountUsername !== username && username !== undefined) {
        return null
      }

      if (statusRepost) {
        statusRepost = statusRepost.set('account', accountRepost)

        //Check if theres a quoted post that
        const statusRepostQuoteId = statusRepost.get('quote_of_id')
        if (!!statusRepostQuoteId) {
          //Get repost's quoted post
          let repostedQuotedStatus = state.getIn(['statuses', statusRepostQuoteId])
          if (repostedQuotedStatus) {
            //Get/set account and set quoted_status
            const repostedQuotedStatusAccount = state.getIn(['accounts', repostedQuotedStatus.get('account')])
            repostedQuotedStatus = repostedQuotedStatus.set('account', repostedQuotedStatusAccount)

            statusRepost = statusRepost.set('quoted_status', repostedQuotedStatus)
          }
        }
      } else {
        statusRepost = null;
      }

      if (quotedStatus) {
        quotedStatus = quotedStatus.set('account', accountQuoted);
      }

      //Find ancestor status

      const regex = (accountRepost || accountBase).get('id') !== me && regexFromFilters(filters);
      const filtered = regex && regex.test(statusBase.get('reblog') ? statusRepost.get('search_index') : statusBase.get('search_index'));

      return statusBase.withMutations(map => {
        map.set('quoted_status', quotedStatus);
        map.set('reblog', statusRepost);
        map.set('account', accountBase);
        map.set('filtered', filtered);
      });
    }
  );
};

export const makeGetNotification = () => {
  return createSelector([
    (_, base) => base,
    (state, _, accountId) => state.getIn(['accounts', accountId]),
  ], (base, account) => {
    return base.set('account', account);
  });
};

export const getAccountGallery = createSelector([
  (state, id) => state.getIn(['timelines', `account:${id}:media`, 'items'], ImmutableList()),
  state => state.get('statuses'),
  (state, id, mediaType) => mediaType,
], (statusIds, statuses, mediaType) => {
  let medias = ImmutableList()

  statusIds.forEach((statusId) => {
    const status = statuses.get(statusId)
    medias = medias.concat(
      status.get('media_attachments')
        .filter((media) => {
          if (mediaType === 'video') {
            return media.get('type') === 'video'
          }
          
          return media.get('type') !== 'video'
        })
        .map((media) => media.set('status', status))
    )
  })

  return medias
})

export const getOrderedLists = createSelector([state => state.get('lists')], lists => {
  if (!lists) return lists

  return lists.toList().filter(item => !!item).sort((a, b) => a.get('title').localeCompare(b.get('title')))
})