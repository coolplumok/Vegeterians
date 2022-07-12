import { defineMessages, injectIntl, FormattedMessage } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import moment from 'moment-mini'
import PanelLayout from './panel_layout'
import ColumnIndicator from '../column_indicator'
import Divider from '../divider'
import Icon from '../icon'
import Text from '../text'

const messages = defineMessages({
  title: { id: 'lists_information', defaultMessage: 'List Information' },
  edit: { id: 'edit', defaultMessage: 'Edit' },
})

export default
@injectIntl
class ListDetailsPanel extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    list: ImmutablePropTypes.map,
    onEdit: PropTypes.func.isRequired,
  }

  updateOnProps = [
    'list',
  ]

  render() {
    const {
      intl,
      list,
      onEdit,
    } = this.props

    const title = !!list ? list.get('title') : ''
    const createdAt = !!list ? list.get('created_at') : ''

    return (
      <PanelLayout
        title={intl.formatMessage(messages.title)}
        headerButtonTitle={intl.formatMessage(messages.edit)}
        headerButtonAction={onEdit}
      >
        {
          (!title || !createdAt) &&
          <ColumnIndicator type='loading' />
        }
        {
          title && createdAt &&
          <div className={_s.default}>

            <div className={_s.default}>
              <Text weight='medium'>
                {title}
              </Text>
            </div>

            <Divider isSmall />

            <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
              <Icon id='calendar' size='12px' className={_s.fillSecondary} />
              <Text
                size='small'
                color='secondary'
                className={_s.ml5}
              >
                {
                  <FormattedMessage id='lists.panel_created' defaultMessage='Created: {date}' values={{
                    date: moment(createdAt).format('lll'),
                  }} />
                }
              </Text>
            </div>

          </div>
        }
      </PanelLayout>
    )
  }
}