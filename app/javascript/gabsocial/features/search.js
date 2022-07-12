import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { withRouter } from 'react-router-dom'
import { me } from '../initial_state'
import ResponsiveClassesComponent from '../features/ui/util/responsive_classes_component'
import HashtagItem from '../components/hashtag_item'
import GroupListItem from '../components/group_list_item'
import Text from '../components/text'
import Account from '../components/account'
import PanelLayout from '../components/panel/panel_layout'
import ColumnIndicator from '../components/column_indicator'
import Block from '../components/block'

const mapStateToProps = (state) => ({
  isError: state.getIn(['search', 'isError']),
  isLoading: state.getIn(['search', 'isLoading']),
  results: state.getIn(['search', 'results']),
  submitted: state.getIn(['search', 'submitted']),
});

export default
@withRouter
@connect(mapStateToProps)
class Search extends ImmutablePureComponent {

  static propTypes = {
    isError: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object,
    results: ImmutablePropTypes.map.isRequired,
    submitted: PropTypes.bool.isRequired,
  }

  state = {
    isSmallScreen: (window.innerWidth <= 895),
  }

  render() {
    const {
      isError,
      isLoading,
      location,
      results,
      submitted,
    } = this.props
    const { isSmallScreen } = this.state

    if (isLoading) {
      return <ColumnIndicator type='loading' />
    }

    if (isError) {
      return (
        <ResponsiveClassesComponent classNamesXS={_s.px10}>
          <Block>
            <ColumnIndicator type='error' message='Error fetching search results.' />
          </Block>
        </ResponsiveClassesComponent>
      )
    }

    if ((results.isEmpty() && isSmallScreen) || (!submitted && results.isEmpty())) {
      return (
        <ResponsiveClassesComponent classNamesXS={_s.px10}>
          <Block>
            <div className={[_s.default, _s.py15, _s.px15].join(' ')}>
              <Text>Type in the box above and submit to perform a search.</Text>
            </div>
          </Block>
        </ResponsiveClassesComponent>
      )
    }

    const pathname = location.pathname || ''
    const showPeople = pathname === '/search/people'
    const showHashtags = pathname === '/search/hashtags'
    const showGroups = pathname === '/search/groups'
    const isTop = !showPeople && !showHashtags && !showGroups
    const theLimit = 4

    let accounts, statuses, hashtags, groups

    // : todo : statuses

    if (results.get('accounts') && results.get('accounts').size > 0 && (isTop || showPeople)) {
      const size = isTop ? Math.min(results.get('accounts').size, theLimit) : results.get('accounts').size;
      const isMax = size === results.get('accounts').size
      accounts = (
        <PanelLayout
          title='People'
          headerButtonTo={isMax ? undefined : '/search/people'}
          headerButtonTitle={isMax ? undefined : 'See more'}
          footerButtonTo={isMax ? undefined : '/search/people'}
          footerButtonTitle={isMax ? undefined : 'See more'}
          noPadding
        >
          <div className={[_s.default, _s.pb10, _s.px15, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
            <Text color='tertiary' size='small'>
              Showing {size} of {results.get('accounts').size} results
            </Text>
          </div>
          {
            results.get('accounts').slice(0, size).map(accountId => (
              <Account
                compact
                withBio
                key={accountId}
                id={accountId}
              />
            ))
          }
        </PanelLayout>
      )
    }

    if (results.get('groups') && results.get('groups').size > 0 && (isTop || showGroups)) {
      const size = isTop ? Math.min(results.get('groups').size, theLimit) : results.get('groups').size;
      const isMax = size === results.get('groups').size

      groups = (
        <PanelLayout
          title='Groups'
          headerButtonTo={isMax ? undefined : '/search/groups'}
          headerButtonTitle={isMax ? undefined : 'See more'}
          footerButtonTo={isMax ? undefined : '/search/groups'}
          footerButtonTitle={isMax ? undefined : 'See more'}
          noPadding
        >
          <div className={[_s.default, _s.pb10, _s.px15, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
            <Text color='tertiary' size='small'>
              Showing {size} of {results.get('groups').size} results
            </Text>
          </div>
          <div className={_s.default}>
            {
              results.get('groups').slice(0, size).map((group, i) => (
                <GroupListItem
                  key={`search-${group.get('name')}`}
                  id={group.get('id')}
                  isLast={size - 1 === i}
                />
              ))
            }
          </div>
        </PanelLayout>
      )
    }

    if (results.get('hashtags') && results.get('hashtags').size > 0 && me && (isTop || showHashtags)) {
      const size = isTop ? Math.min(results.get('hashtags').size, theLimit) : results.get('hashtags').size;
      const isMax = size === results.get('hashtags').size

      hashtags = (
        <PanelLayout
          title='Hashtags'
          headerButtonTo={isMax ? undefined : '/search/hashtags'}
          headerButtonTitle={isMax ? undefined : 'See more'}
          footerButtonTo={isMax ? undefined : '/search/hashtags'}
          footerButtonTitle={isMax ? undefined : 'See more'}
          noPadding
        >
          <div className={[_s.default, _s.pb10, _s.px15, _s.borderBottom1PX, _s.borderColorSecondary].join(' ')}>
            <Text color='tertiary' size='small'>
              Showing {size} of {results.get('hashtags').size} results
            </Text>
          </div>
          {results.get('hashtags').slice(0, size).map(hashtag => <HashtagItem isCompact key={hashtag.get('name')} hashtag={hashtag} />)}
        </PanelLayout>
      )
    }

    if (!accounts && !statuses && !hashtags && !groups) {
      return (
        <ResponsiveClassesComponent classNamesXS={_s.px10}>
          <Block>
            <ColumnIndicator type='missing' message='No search results.' />
          </Block>
        </ResponsiveClassesComponent>
      )
    }

    return (
      <div>
        {accounts}
        {groups}
        {statuses}
        {hashtags}
      </div>
    )
  }

}
