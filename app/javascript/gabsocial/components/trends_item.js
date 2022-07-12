import { Fragment } from 'react'
import { urlRegex } from '../features/ui/util/url_regex'
import {
  CX,
  DEFAULT_REL,
} from '../constants'
import Button from './button'
import DotTextSeperator from './dot_text_seperator'
import RelativeTimestamp from './relative_timestamp'
import Text from './text'

export default class TrendingItem extends PureComponent {

  static propTypes = {
    index: PropTypes.number,
    isLast: PropTypes.bool,
    isHidden: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    author: PropTypes.string,
    url: PropTypes.string,
    date: PropTypes.string,
  }

  static defaultProps = {
    title: '',
    description: '',
    author: '',
    url: '',
    date: '',
  }

  state = {
    hovering: false,
  }

  handleOnMouseEnter = () => {
    this.setState({ hovering: true })
  }

  handleOnMouseLeave = () => {
    this.setState({ hovering: false })
  }

  render() {
    const {
      index,
      isLast,
      isHidden,
      title,
      description,
      author,
      url,
      date,
    } = this.props
    const { hovering } = this.state

    if (!title || !url) return null

    const correctedTitle = `${title}`.trim()
    let correctedDescription = description || ''
      
    const correctedAuthor = `${author}`.replace('www.', '')
    correctedDescription = correctedDescription.length >= 120 ? `${correctedDescription.substring(0, 120).trim()}...` : correctedDescription
    const descriptionHasLink = correctedDescription.match(urlRegex)

    if (isHidden) {
      return (
        <Fragment>
          {correctedTitle}
          {!descriptionHasLink && correctedDescription}
          {correctedAuthor}
        </Fragment>
      )
    }

    const containerClasses = CX({
      default: 1,
      noUnderline: 1,
      px15: 1,
      pt10: 1,
      pb5: 1,
      borderColorSecondary: !isLast,
      borderBottom1PX: !isLast,
      backgroundColorSubtle_onHover: 1,
    })

    const subtitleClasses = CX({
      ml5: 1,
      underline: hovering,
    })

    return (
      <Button
        noClasses
        href={url}
        target='_blank'
        rel={DEFAULT_REL}
        className={containerClasses}
        onMouseEnter={() => this.handleOnMouseEnter()}
        onMouseLeave={() => this.handleOnMouseLeave()}
      >
      
        <div className={[_s.default, _s.flexNormal, _s.pb5].join(' ')}>
          <div className={_s.default}>
            <Text size='medium' color='primary' weight='bold'>
              {correctedTitle}
            </Text>
          </div>

          {
            !!correctedDescription && !descriptionHasLink &&
            <div className={[_s.default, _s.heightMax56PX, _s.overflowHidden, _s.pt5, _s.mb5].join(' ')}>
              <Text size='small' color='secondary'>
                {correctedDescription}
              </Text>
            </div>
          }
          
          <div className={[_s.default, _s.flexRow].join(' ')}>
            <Text color='secondary' size='small'>
              {index}
            </Text>
            <DotTextSeperator />
            <Text color='secondary' size='small' className={_s.ml5}>
              {correctedAuthor}
            </Text>
            <DotTextSeperator />
            <Text color='secondary' size='small' className={subtitleClasses}>
              <RelativeTimestamp timestamp={date} />
            </Text>
            {
              hovering &&
              <Text color='secondary' size='small' className={_s.ml10}>→</Text>
            }
          </div>

        </div>
      </Button>
    )
  }

}
