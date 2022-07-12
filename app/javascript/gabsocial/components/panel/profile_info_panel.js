import { Fragment } from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { List as ImmutableList } from 'immutable'
import { DEFAULT_REL } from '../../constants'
import PanelLayout from './panel_layout'
import Divider from '../divider'
import Icon from '../icon'
import Text from '../text'
import Dummy from '../dummy'
import Button from '../button'

const messages = defineMessages({
  title: { id: 'about', defaultMessage: 'About' },
  linkVerifiedOn: { id: 'account.link_verified_on', defaultMessage: 'Ownership of this link was checked on {date}' },
  account_locked: { id: 'account.locked_info', defaultMessage: 'This account privacy status is set to locked. The owner manually reviews who can follow them.' },
  bot: { id: 'account.badges.bot', defaultMessage: 'Bot' },
  memberSince: { id: 'account.member_since', defaultMessage: 'Member since {date}' },
  add_bio: { id: 'account.add_bio', defaultMessage: 'Add bio here' },
  more: { id: 'account.more', defaultMessage: '...' },
  moreDetail: { id: 'account.more_detail', defaultMessage: 'More Detail' },
  less: { id: 'account.less', defaultMessage: 'Less' },
})

export default
@injectIntl
class ProfileInfoPanel extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    noPanel: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  }

  state = {
    showFull: false,
  }

  handleShowFull = () => {
    this.setState({showFull: true})
  }

  handleShowLess = () => {
    this.setState({showFull: false})
  }

  render() {
    const {
      intl,
      account,
      noPanel
    } = this.props

    const { showFull } = this.state

    if (!account) return null

    const fields = account.get('fields')
    const note_emojified = account.get('note_emojified')
    const limited_note_emojified = account.get('limited_note_emojified')
    const content = { __html: note_emojified }
    let small_content = { __html: limited_note_emojified }
    const memberSinceDate = intl.formatDate(account.get('created_at'), { month: 'long', year: 'numeric' })
    const hasNote = !!content ? (account.get('note').length > 0 && account.get('note') !== '<p></p>') : false
    const loadMore = (!!note_emojified && !!limited_note_emojified) ? ((note_emojified != limited_note_emojified) ? true : false) : false    
    const isPro = account.get('is_pro')
    const isProPlus = account.get('is_proplus')
    const isExpert = account.get('is_expert')
    const hasBadges = isPro || isProPlus || isExpert

    if (!hasNote) small_content = { __html: intl.formatMessage(messages.add_bio) }

    const Wrapper = noPanel ? Dummy : PanelLayout

    return (
      <Wrapper title={intl.formatMessage(messages.title)}>
        <div className={[_s.default].join(' ')}>
          <Fragment>
            { !!showFull &&
              <div className={[_s.default, _s.mt5].join(' ')}>
                <div className={_s.dangerousContent} dangerouslySetInnerHTML={content} />
                { !!loadMore &&
                  <div className={[_s.default, _s.flexRow].join(' ')}>
                    <Button
                      isBlock
                      radiusSmall
                      backgroundColor='tertiary'
                      color='primary'
                      noClasses
                      className={_s.ml10}
                      onClick={this.handleShowLess}
                    >
                      <Text
                        size='small'
                        color='secondary'
                      >{intl.formatMessage(messages.less)}</Text>
                    </Button>
                  </div>
                }
              </div>
            }
            { !showFull &&
              <div className={[_s.default, _s.mt5].join(' ')}>
                <div className={_s.dangerousContent} dangerouslySetInnerHTML={small_content} />
                { !!loadMore &&
                  <div className={[_s.default, _s.flexRow].join(' ')}>
                    <Text
                      size='small'
                      color='secondary'
                      className={_s.ml5}
                    >{intl.formatMessage(messages.more)}</Text>
                    <Button
                      isBlock
                      radiusSmall
                      noClasses
                      backgroundColor='tertiary'
                      color='primary'
                      className={_s.ml10}
                      onClick={this.handleShowFull}
                    >
                      <Text
                        size='small'
                        color='secondary'
                      >{intl.formatMessage(messages.moreDetail)}</Text>
                    </Button>
                  </div>
                }
              </div>
            }
            <Divider isSmall />
          </Fragment>

          <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
            <Icon id='calendar' size='12px' className={_s.fillSecondary} />
            <Text
              size='small'
              color='secondary'
              className={_s.ml5}
            >
              {
                intl.formatMessage(messages.memberSince, {
                  date: memberSinceDate
                })
              }
            </Text>
          </div>
            
          {
            hasBadges &&
            <Fragment>
              <Divider isSmall />
              <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
                { 
                  isPro &&
                  <div className={[_s.mr5, _s.radiusSmall, _s.bgPro, _s.py2, _s.px5].join(' ')}>
                    <Text weight='bold' size='small' className={_s.colorBGPrimary} isBadge>PRO</Text>
                  </div>
                }
                {
                  isExpert && 
                  <div className={[_s.mr5, _s.radiusSmall, _s.bgInvestor, _s.py2, _s.px5].join(' ')}>
                    <Text weight='bold' size='small' className={_s.colorBGPrimary} isBadge>EXPERT</Text>
                  </div>
                }
                {
                  isProPlus &&
                  <div className={[_s.mr5, _s.radiusSmall, _s.bgDonor, _s.py2, _s.px5].join(' ')}>
                    <Text weight='bold' size='small' className={_s.colorBGPrimary} isBadge>ProPlus</Text>
                  </div>
                }
              </div>
            </Fragment>
          }

          {
            fields.size > 0 && 
            <div className={[_s.default]}>
              {
                fields.map((pair, i) => (
                  <Fragment>
                    <Divider isSmall />
                    <dl className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')} key={`profile-field-${i}`}>
                      <dt
                        className={[_s.text, _s.dangerousContent].join(' ')}
                        dangerouslySetInnerHTML={{ __html: pair.get('name_emojified') }}
                        title={pair.get('name')}
                      />
                      <dd
                        className={[_s.dangerousContent, _s.mlAuto].join(' ')}
                        title={pair.get('value_plain')}
                        dangerouslySetInnerHTML={{ __html: pair.get('value_emojified') }}
                      />
                    </dl>
                  </Fragment>
                ))
              }
            </div>
          }

        </div>
      </Wrapper>
    )
  }
}