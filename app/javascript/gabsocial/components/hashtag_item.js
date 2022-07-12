import { FormattedMessage } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { NavLink } from 'react-router-dom'
import Button from './button'
import Text from './text'

export default class HashtagItem extends ImmutablePureComponent {

  static propTypes = {
    hashtag: ImmutablePropTypes.map.isRequired,
    isCompact: PropTypes.bool,
  }

  updateOnProps = ['hashtag']

  render() {
    const { hashtag, isCompact } = this.props

    const count = hashtag.get('history').map((block) => {
      return parseInt(block.get('uses'))
    }).reduce((a, c) => a + c)

    return (
      <NavLink
        to={`/tags/${hashtag.get('name')}`}
        className={[_s.default, _s.noUnderline, _s.bgSubtle_onHover, _s.px15, _s.py5].join(' ')}
      >
        <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
          <div>
            <Text color='brand' size='medium' weight='bold' className={[_s.py2, _s.lineHeight15].join(' ')}>
              #{hashtag.get('name')}
            </Text>
          </div>
          {
            !isCompact &&
            <Button
              isText
              backgroundColor='none'
              color='none'
              title='Remove'
              icon='close'
              iconSize='8px'
              iconClassName={_s.fillSecondary}
              className={_s.mlAuto}
            />
          }
        </div>
        {
          !isCompact &&
          <Text color='secondary' size='small' className={_s.py2}>
            <FormattedMessage id='number_of_gabs' defaultMessage='{count} Posts' values={{
              count,
            }} />
          </Text>
        }
      </NavLink>
    )
  }

}
