import {
  getDefaultKeyBinding,
  Editor,
  EditorState,
  CompositeDecorator,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  ContentState,
} from 'draft-js'
import draftToMarkdown from '../features/ui/util/draft-to-markdown'
import markdownToDraft from '../features/ui/util/markdown-to-draft'
import { urlRegex } from '../features/ui/util/url_regex'
import classNames from 'classnames/bind'
import RichTextEditorBar from './rich_text_editor_bar'

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

export default class Composer extends PureComponent {

  static propTypes = {
    inputRef: PropTypes.func,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    valueMarkdown: PropTypes.string,
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onPaste: PropTypes.func,
    small: PropTypes.bool,
    isPro: PropTypes.bool,
    isProPlus: PropTypes.bool,
    isEdit: PropTypes.bool,
  }

  state = {
    active: false,
    editorState: EditorState.createEmpty(compositeDecorator),
    plainText: this.props.value,
  }

  componentDidMount() {
    if (this.props.valueMarkdown && (this.props.isPro || this.props.isProPlus) && this.props.isEdit) {
      const rawData = markdownToDraft(this.props.valueMarkdown, markdownOptions)
      const contentState = convertFromRaw(rawData)
      const editorState = EditorState.createWithContent(contentState)

      this.setState({
        editorState,
        plainText: this.props.value,
      })
    } else if (this.props.value) {
      const editorState = EditorState.push(this.state.editorState, ContentState.createFromText(this.props.value))
      this.setState({
        editorState,
        plainText: this.props.value,
      })
    }
  }

  componentDidUpdate() {
    if (this.state.plainText !== this.props.value) {
      let editorState
      if (!this.props.value) {
        editorState = EditorState.createEmpty(compositeDecorator)
      } else {
        editorState = EditorState.moveFocusToEnd(
          EditorState.push(this.state.editorState, ContentState.createFromText(this.props.value))
        )
      }
      this.setState({
        editorState,
        plainText: this.props.value,
      })
    }
  }

  onChange = (editorState) => {
    const content = editorState.getCurrentContent()
    // const plainText = content.getPlainText('\u0001')

    const blocks = convertToRaw(editorState.getCurrentContent()).blocks
    const value = blocks.map(block => (!block.text.trim() && '') || block.text).join('\n')

    this.setState({
      editorState,
      plainText: value,
    })

    const selectionState = editorState.getSelection()
    const selectionStart = selectionState.getStartOffset()

    const rawObject = convertToRaw(content)
    const markdownString = (this.props.isPro || this.props.isProPlus) ? draftToMarkdown(rawObject,markdownOptions) : null

    this.props.onChange(null, value, markdownString, selectionStart)
  }

  handleOnFocus = () => {
    document.addEventListener('paste', this.handleOnPaste)
    this.setState({ active: true })
    this.props.onFocus()
  }

  handleOnBlur = () => {
    document.removeEventListener('paste', this.handleOnPaste, true)
    this.setState({ active: false })
    this.props.onBlur()
  }

  focus = () => {
    this.textbox.focus()
  }

  handleOnPaste = (e) => {
    if (this.state.active) {
      this.props.onPaste(e)
    }
  }

  keyBindingFn = (e) => {
    if (e.type === 'keydown') {
      this.props.onKeyDown(e)
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
    const {
      disabled,
      placeholder,
      small,
      isPro,
      isProPlus,
    } = this.props
    const { editorState } = this.state

    const editorContainerClasses = cx({
      default: 1,
      cursorText: 1,
      text: 1,
      colorPrimary: 1,
      fs16PX: !small,
      fs14PX: small,
      pt15: !small,
      px15: !small,
      px10: small,
      pb10: !small,
    })

    return (
      <div className={_s.default}>

        {
          !small && (isPro || isProPlus) &&
          <RichTextEditorBar
            editorState={editorState}
            onChange={this.onChange}
          />
        }

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
            placeholder={placeholder}
            ref={this.setRef}
            readOnly={disabled}
            onBlur={this.handleOnBlur}
            onFocus={this.handleOnFocus}
            keyBindingFn={this.keyBindingFn}
            stripPastedStyles
            spellCheck
          />
        </div>
      </div>
    )
  }

}