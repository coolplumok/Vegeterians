import { Fragment } from 'react'
import { injectIntl, defineMessages } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { me } from '../../initial_state'
import { makeGetAccount } from '../../selectors'
import { openModal } from '../../actions/modal'
import {
  MODAL_EDIT_BIO,
} from '../../constants'
import PanelLayout from './panel_layout'
import Divider from '../divider'
import Icon from '../icon'
import Text from '../text'
import Button from '../button'

const markdownOptions = {
  escapeMarkdownCharacters: false,
  preserveNewlines: true,
  remarkablePreset: 'commonmark',
  remarkableOptions: {
    disable: {
      inline: ['links'],
      block: ['table', 'heading'],
    },
    enable: {
      inline: ['del', 'ins'],
    }
  }
}

const messages = defineMessages({
  title: { id: 'account.title', defaultMessage: 'About' },
  memberSince: { id: 'account.member_since', defaultMessage: 'Member since {date}' },
  add_bio: { id: 'account.add_bio', defaultMessage: 'Add bio here' },
  more: { id: 'account.more', defaultMessage: '...' },
  moreDetail: { id: 'account.more_detail', defaultMessage: 'More Detail' },
  less: { id: 'account.less', defaultMessage: 'Less' },
})

const mapStateToProps = (state) => ({
  account: makeGetAccount()(state, me),
})

const mapDispatchToProps = (dispatch) => ({
  onOpenEditBio() {
    dispatch(openModal(MODAL_EDIT_BIO))
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class AboutMePanel extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    intl: PropTypes.object.isRequired,
    onOpenEditBio: PropTypes.func.isRequired,
  }

  updateOnProps = [
    'account'
  ]

  state = {
    showFull: false,
  }

  handleOnEditBio = () => {
    this.props.onOpenEditBio()
  }

  handleShowFull = () => {
    this.setState({showFull: true})
  }

  handleShowLess = () => {
    this.setState({showFull: false})
  }

  render() {
    const {
      account,
      intl,
    } = this.props

    const { showFull } = this.state

    if (!account) return null

    const note_emojified = account.get('note_emojified')
    const limited_note_emojified = account.get('limited_note_emojified')
    const content = { __html: note_emojified }
    let small_content = { __html: limited_note_emojified }
    const memberSinceDate = intl.formatDate(account.get('created_at'), { month: 'long', year: 'numeric' })
    const hasNote = !!content ? (account.get('note').length > 0 && account.get('note') !== '') : false
    const loadMore = (!!note_emojified && !!limited_note_emojified) ? ((note_emojified != limited_note_emojified) ? true : false) : false    

    if (!hasNote) small_content = { __html: intl.formatMessage(messages.add_bio) }

    return (
      <PanelLayout
        title={intl.formatMessage(messages.title)}
        headerButtonIcon="pencil"
        headerButtonAction={this.handleOnEditBio}
      >
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
        </div>
      </PanelLayout>
    )
  }

}
