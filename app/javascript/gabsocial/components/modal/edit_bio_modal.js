import {
  getDefaultKeyBinding,
  Editor,
  EditorState,
  CompositeDecorator,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from 'draft-js'
import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { saveUserProfileInformation } from '../../actions/user'
import { makeGetAccount } from '../../selectors'
import { me } from '../../initial_state'
import Button from '../button'
import Block from '../block'
import Divider from '../divider'
import Heading from '../heading'
import Textarea from '../textarea'
import draftToMarkdown from '../../features/ui/util/draft-to-markdown'
import markdownToDraft from '../../features/ui/util/markdown-to-draft'
import { urlRegex } from '../../features/ui/util/url_regex'
import classNames from 'classnames/bind'
import RichTextEditorBar from '../rich_text_editor_bar'

import '!style-loader!css-loader!draft-js/dist/Draft.css'

const cx = classNames.bind(_s)

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

const getBlockStyle = (block) => {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote'
    default:
      return null
  }
}

function handleStrategy(contentBlock, callback, contentState) {
  findWithRegex(HANDLE_REGEX, contentBlock, callback)
}

function hashtagStrategy(contentBlock, callback, contentState) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback)
}

function urlStrategy(contentBlock, callback, contentState) {
  findWithRegex(urlRegex, contentBlock, callback)
}

const findWithRegex = (regex, contentBlock, callback) => {
  const text = contentBlock.getText()
  let matchArr, start
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index
    callback(start, start + matchArr[0].length)
  }
}

const HighlightedSpan = (props) => {
  return (
    <span
      className={_s.colorBrand}
      data-offset-key={props.offsetKey}
    >
      {props.children}
    </span>
  )
}

const compositeDecorator = new CompositeDecorator([
  {
    strategy: handleStrategy,
    component: HighlightedSpan,
  },
  {
    strategy: hashtagStrategy,
    component: HighlightedSpan,
  },
  {
    strategy: urlStrategy,
    component: HighlightedSpan,
  }
])

const styleMap = {
  'CODE': {
    padding: '0.25em 0.5em',
    backgroundColor: 'var(--border_color_secondary)',
    color: 'var(--text_color_secondary)',
    fontSize: 'var(--fs_n)',
  },
};

const HANDLE_REGEX = /\@[\w]+/g
const HASHTAG_REGEX = /\#[\w\u0590-\u05ff]+/g

const messages = defineMessages({
  edit_bio: { id: 'account.edit_bio', defaultMessage: 'Edit bio' },
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  save: { id: 'lightbox.save', defaultMessage: 'Save' },
  placeholder: { id: 'account.placeholder', defaultMessage: 'Add your bio...' },
})

const mapStateToProps = (state) => {
  const getAccount = makeGetAccount()
  const account = getAccount(state, me)
  const isPro = account.get('is_pro')
  const isProPlus = account.get('is_proplus')

  return {
    account,
    isPro,
    isProPlus,
  }
}

const mapDispatchToProps = (dispatch) => ({
  onSave: (data) => dispatch(saveUserProfileInformation(data)),
})

export default
@injectIntl
@connect(mapStateToProps, mapDispatchToProps)
class EditBioModal extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    isPro: PropTypes.bool.isRequired,
    isProPlus: PropTypes.bool.isRequired,
  }

  state = {
    bioValue: this.props.account ? this.props.account.get('note_plain') : '',
    editorState: EditorState.createEmpty(compositeDecorator),
  }

  componentDidMount() {
    if (this.props.isPro || this.props.isProPlus) {
      const rawData = markdownToDraft(this.state.bioValue, markdownOptions)
      const contentState = convertFromRaw(rawData)
      const editorState = EditorState.createWithContent(contentState)
      this.setState({
        editorState,
        bioValue: this.state.bioValue,
      })
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.account !== this.props.account) {
      if (this.props.account) {
        if (this.props.isPro || this.props.isProPlus) {
          let editorState
          if (!this.state.bioValue) {
            editorState = EditorState.createEmpty(compositeDecorator)
          } else {
            const rawData = markdownToDraft(this.state.bioValue, markdownOptions)
            const contentState = convertFromRaw(rawData)
            editorState = EditorState.moveFocusToEnd(
              EditorState.createWithContent(contentState)
            )
          }
          this.setState({
            bioValue: this.state.bioValue,
            editorState: editorState,
          })
        } else {
          this.setState({
            bioValue: this.state.bioValue,
          })
        }
      } else {
        this.setState({
          bioValue: '',
        })
      }
    }
  }

  handleBioChange = (value) => {
    this.setState({ bioValue: value })
  }

  handleOnClose = () => {
    this.props.onClose()
  }

  handleOnSave = () => {
    const { account } = this.props
    const {
      bioValue,
      editorState,
    } = this.state

    const obj = {}
    if (account.get('note_plain') !== bioValue) obj.note = bioValue

    this.props.onSave(obj)
    this.handleOnClose()
  }

  setTextbox = (c) => {
    this.textbox = c
  }

  onChange = (editorState) => {
    const content = editorState.getCurrentContent()
    const selectionState = editorState.getSelection()
    const selectionStart = selectionState.getStartOffset()
    const rawObject = convertToRaw(content)
    const markdownString = draftToMarkdown(rawObject, markdownOptions)

    this.setState({
      editorState,
      bioValue: markdownString,
    })
  }

  handleOnFocus = () => {
    document.addEventListener('paste', this.handleOnPaste)
    this.setState({ active: true })
  }

  handleOnBlur = () => {
    document.removeEventListener('paste', this.handleOnPaste, true)
    this.setState({ active: false })
  }

  focus = () => {
    this.textbox.focus()
  }

  handleOnPaste = (e) => {
    if (this.state.active) {
    }
  }

  keyBindingFn = (e) => {
    if (e.type === 'keydown') {
    }

    return getDefaultKeyBinding(e)
  }

  handleKeyCommand = (command) => {
    const { editorState } = this.state
    const newState = RichUtils.handleKeyCommand(editorState, command)

    if (newState) {
      this.onChange(newState)
      return true
    }

    return false
  }

  setRef = (n) => {
    try {
      this.textbox = n
      this.props.inputRef(n) 
    } catch (error) {
      //
    }
  }
  
  render() {
    const { intl, account, isPro, isProPlus } = this.props
    const {
      bioValue,
      editorState,
    } = this.state

    const isVerified = account.get('is_verified')

    const editorContainerClasses = cx({
      default: 1,
      cursorText: 1,
      text: 1,
      colorPrimary: 1,
      fs16PX: 0,
      fs14PX: 1,
      pt15: 0,
      px15: 1,
      px10: 0,
      pb10: 1,
    })

    return (
      <div style={{ width: '440px' }} className={[_s.default, _s.modal].join(' ')}>
        <Block>
          <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.justifyContentCenter, _s.borderBottom1PX, _s.borderColorSecondary, _s.height53PX, _s.px15].join(' ')}>
            <Button
              backgroundColor='none'
              title={intl.formatMessage(messages.close)}
              className={[_s.mrAuto, _s.width60PX, _s.pl0].join(' ')}
              onClick={this.handleOnClose}
              color='secondary'
              icon='close'
              iconSize='10px'
            />
            <Heading size='h2'>
              {intl.formatMessage(messages.edit_bio)}
            </Heading>
            <Button
              title={intl.formatMessage(messages.save)}
              className={[_s.mlAuto, _s.width60PX].join(' ')}
              onClick={this.handleOnSave}
            >
              {intl.formatMessage(messages.save)}
            </Button>
          </div>
          <div className={[_s.default, _s.heightMax80VH, _s.overflowYScroll].join(' ')}>
            <div className={[_s.default, _s.width100PC, _s.alignItemsCenter].join(' ')}>
              <div className={[_s.default, _s.py5, _s.px15, _s.mt5, _s.mb15, _s.width100PC].join(' ')}>
                {
                  (isPro || isProPlus) &&
                  <div>
                    <RichTextEditorBar
                      editorState={editorState}
                      onChange={this.onChange}
                      rteControlsEnabled={true}
                    />
                    <div
                      className={editorContainerClasses}
                      onClick={this.handleOnFocus}
                    >
                      <Editor
                        blockStyleFn={getBlockStyle}
                        editorState={editorState}
                        customStyleMap={styleMap}
                        handleKeyCommand={this.handleKeyCommand}
                        onChange={this.onChange}
                        placeholder={intl.formatMessage(messages.placeholder)}
                        ref={this.setRef}
                        onBlur={this.handleOnBlur}
                        onFocus={this.handleOnFocus}
                        keyBindingFn={this.keyBindingFn}
                        stripPastedStyles
                        spellCheck
                      />
                    </div>
                  </div>
                }
                {
                  !(isPro || isProPlus) &&
                  <Textarea
                    value={bioValue}
                    onChange={this.handleBioChange}
                    placeholder={intl.formatMessage(messages.placeholder)}
                  >
                  </Textarea>
                }
                <Divider isInvisible />
              </div>
            </div>
          </div>
        </Block>
      </div>
    )
  }
}
