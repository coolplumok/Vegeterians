import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import { injectIntl, defineMessages } from 'react-intl'
import classNames from 'classnames/bind'
import { isRtl } from '../utils/rtl'
import Button from './button'
import Icon from './icon'
import Text from './text'

const MAX_HEIGHT = 200

const messages = defineMessages({
  show: { id: 'status.show_more', defaultMessage: 'Show' },
  hide: { id: 'status.show_less', defaultMessage: 'Hide' },
  readMore: { id: 'status.read_more', defaultMessage: 'Read more' },
})

const cx = classNames.bind(_s)

// .emojione {
//   margin: -3px 0 0;

//   @include size(20px);
// }

export default
@injectIntl
class StatusContent extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  }

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    expanded: PropTypes.bool,
    onExpandedToggle: PropTypes.func,
    onClick: PropTypes.func,
    collapsable: PropTypes.bool,
    intl: PropTypes.object.isRequired,
    isComment: PropTypes.bool,
  }

  state = {
    hidden: true,
    collapsed: null, // `collapsed: null` indicates that an element doesn't need collapsing, while `true` or `false` indicates that it does (and is/isn't).
  }

  updateOnProps = [
    'status',
    'expanded',
    'collapsable',
    'isComment',
  ]

  _updateStatusLinks() {
    const node = this.node

    if (!node) return

    const links = node.querySelectorAll('a')

    for (let i = 0; i < links.length; ++i) {
      const link = links[i]
      if (link.classList.contains('linked')) {
        continue
      }
      link.classList.add('linked')
      link.classList.add(_s.text, _s.colorBrand, _s.cursorPointer, _s.inherit)

      const mention = this.props.status.get('mentions').find(item => link.href === `${item.get('url')}`)

      if (mention) {
        link.addEventListener('click', this.onMentionClick.bind(this, mention), false)
        link.setAttribute('title', mention.get('acct'))
      } else if (link.textContent[0] === '#' || (link.previousSibling && link.previousSibling.textContent && link.previousSibling.textContent[link.previousSibling.textContent.length - 1] === '#')) {
        link.addEventListener('click', this.onHashtagClick.bind(this, link.text), false)
      } else {
        link.setAttribute('title', link.href)
      }
    }

    if (
      this.props.collapsable
      && this.props.onClick
      && this.state.collapsed === null
      && node.clientHeight > MAX_HEIGHT
      && this.props.status.get('spoiler_text').length === 0
    ) {
      this.setState({ collapsed: true })
    }
  }

  componentDidMount() {
    this._updateStatusLinks()
  }

  componentDidUpdate() {
    this._updateStatusLinks()
  }

  onMentionClick = (mention, e) => {
    if (this.context.router && e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      // e.preventDefault()
      // this.context.router.history.push(`/${mention.get('acct')}`)
    }
  }

  onHashtagClick = (hashtag, e) => {
    hashtag = hashtag.replace(/^#/, '').toLowerCase()

    if (this.context.router && e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      this.context.router.history.push(`/tags/${hashtag}`)
    }
  }

  handleMouseDown = (e) => {
    this.startXY = [e.clientX, e.clientY]
  }

  handleMouseUp = (e) => {
    if (!this.startXY) return

    const [startX, startY] = this.startXY
    const [deltaX, deltaY] = [Math.abs(e.clientX - startX), Math.abs(e.clientY - startY)]

    if (e.target.localName === 'button' ||
      e.target.localName === 'a' ||
      (e.target.parentNode && (e.target.parentNode.localName === 'button' || e.target.parentNode.localName === 'a'))) {
      return
    }

    if (deltaX + deltaY < 5 && e.button === 0 && this.props.onClick) {
      this.props.onClick()
    }

    this.startXY = null
  }

  handleSpoilerClick = (e) => {
    e.preventDefault()

    if (this.props.onExpandedToggle) {
      // The parent manages the state
      this.props.onExpandedToggle()
    } else {
      this.setState({ hidden: !this.state.hidden })
    }
  }

  handleReadMore = (e) => {
    e.preventDefault()
    this.setState({ collapsed: false })
  }

  setRef = (c) => {
    this.node = c
  }

  getHtmlContent = () => {
    const { status, reblogContent } = this.props

    const properContent = status.get('contentHtml')

    return reblogContent
      ? `${reblogContent} <div className='status__quote'>${properContent}</div>`
      : properContent
  }

  render() {
    const {
      collapsable,
      intl,
      isComment,
      status,
    } = this.props
    const { collapsed } = this.state

    if (status.get('content').length === 0) return null

    const hidden = this.props.onExpandedToggle ? !this.props.expanded : this.state.hidden

    const content = { __html: this.getHtmlContent() }
    const spoilerContent = { __html: status.get('spoilerHtml') }
    const directionStyle = {
      direction: isRtl(status.get('search_index')) ? 'rtl' : 'ltr',
    }

    if (status.get('spoiler_text').length > 0) {
      let mentionsPlaceholder = null

      const mentionLinks = status.get('mentions').map(item => (
        <Button
          isText
          backgroundColor='none'
          to={`/${item.get('acct')}`}
          href={`/${item.get('acct')}`}
          key={item.get('id')}
          className={['mention', _s.mr5, _s.pb5].join(' ')}
        >
          @{item.get('username')}
        </Button>
      )).reduce((aggregate, item) => [...aggregate, item, ' '], [])

      if (hidden) {
        mentionsPlaceholder = (
          <div className={[_s.statusContent, _s.default, _s.alignItemsStart, _s.flexRow, _s.flexWrap].join(' ')}>
            {mentionLinks}
          </div>
        )
      }

      const toggleText = intl.formatMessage(hidden ? messages.show : messages.hide)

      const spoilerContainerClasses = cx({
        default: 1,
        py10: 1,
        borderBottom1PX: !hidden,
        borderColorSecondary: !hidden,
        mb10: !hidden,
      })

      const statusContentClasses = cx({
        statusContent: 1,
        outlineNone: 1,
        displayNone: hidden,
      })

      const containerClasses = cx({
        statusContent: 1,
        px15: !isComment,
        outlineNone: 1,
        mt5: isComment,
      })

      return (
        <div
          className={[].join(' ')}
          ref={this.setRef}
          tabIndex='0'
          className={containerClasses}
          style={directionStyle}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
        >

          <div className={spoilerContainerClasses}>
            <div className={[_s.default, _s.flexRow, _s.mr5].join(' ')}>
              <Icon id='warning' size='14px' className={[_s.fillPrimary, _s.mt2, _s.mr5].join(' ')}/>
              <div
                className={[_s.statusContent, _s.outlineNone].join(' ')}
                dangerouslySetInnerHTML={spoilerContent}
                lang={status.get('language')}
              />
            </div>

            <div className={[_s.default, _s.mt10, _s.alignItemsStart].join(' ')}>
              <Button
                isNarrow
                radiusSmall
                backgroundColor='tertiary'
                color='primary'
                tabIndex='0'
                onClick={this.handleSpoilerClick}
              >
                <Text size='small' color='inherit'>
                  {toggleText}
                </Text>
              </Button>
            </div>
          </div>

          {mentionsPlaceholder}

          <div
            tabIndex={!hidden ? 0 : null}
            className={statusContentClasses}
            style={directionStyle}
            dangerouslySetInnerHTML={content}
            lang={status.get('language')}
          />
        </div>
      )
    } else if (this.props.onClick) {
      const hasMarginBottom = !!status.get('card') || !!status.get('poll') || status.get('media_attachments').size > 0

      const containerClasses = cx({
        px15: !isComment,
        mb15: hasMarginBottom,
      })

      const statusContentClasses = cx({
        statusContent: 1,
        outlineNone: 1,
        height215PX: collapsed & !isComment,
        height122PX: collapsed && isComment,
        overflowHidden: collapsed,
        mt5: isComment,
      })

      return (
        <div className={containerClasses}>
          <div
            ref={this.setRef}
            tabIndex='0'
            className={statusContentClasses}
            style={directionStyle}
            dangerouslySetInnerHTML={content}
            lang={status.get('language')}
            onMouseDown={this.handleMouseDown}
            onMouseUp={this.handleMouseUp}
          />
          {
            this.state.collapsed && collapsable &&
            <Button
              isText
              underlineOnHover
              color='primary'
              backgroundColor='none'
              className={[_s.py2].join(' ')}
              onClick={this.handleReadMore}
            >
              <Text size='medium' color='inherit' weight='bold'>
                {intl.formatMessage(messages.readMore)}
              </Text>
            </Button>
          }
        </div>
      )
    }

    const containerClasses = cx({
      statusContent: 1,
      outlineNone: 1,
      px15: !isComment,
      mb15: !isComment,
      mt5: isComment,
    })

    return (
      <div
        tabIndex='0'
        ref={this.setRef}
        className={containerClasses}
        style={directionStyle}
        dangerouslySetInnerHTML={content}
        lang={status.get('language')}
      />
    )
  }

}
