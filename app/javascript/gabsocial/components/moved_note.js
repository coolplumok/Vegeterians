import ImmutablePropTypes from 'react-immutable-proptypes'
import { FormattedMessage } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { NavLink } from 'react-router-dom'
import DisplayName from './display_name'
import Icon from './icon'

// : todo :
export default class MovedNote extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    fromAcct: ImmutablePropTypes.map.isRequired,
    to: ImmutablePropTypes.map.isRequired,
  }

  render () {
    const { fromAcct, toAcct } = this.props;
    const displayNameHtml = { __html: fromAcct.get('display_name_html') }

    return (
      <div className='moved-note'>
        <div className='moved-note__message'>
          <div className='moved-note__icon-wrapper'>
            <Icon id='suitcase' className='moved-note__icon' fixedWidth />
          </div>
          <FormattedMessage
            id='account.moved_to'
            defaultMessage='{name} has moved to:'
            values={{
              name: <bdi><strong dangerouslySetInnerHTML={displayNameHtml} /></bdi>
            }}
          />
        </div>

        <NavLink to={`/${toAcct.get('acct')}`} className='moved-note__display-name'>
          <div className='moved-note__display-avatar'>
            <Avatar account={toAcct} />
          </div>
          <DisplayName account={toAcct} />
        </NavLink>
      </div>
    );
  }

}
