import { Fragment } from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import isObject from 'lodash.isobject'
import ImmutablePureComponent from 'react-immutable-pure-component'
import Textarea from 'react-textarea-autosize'
import {
  CX,
  BREAKPOINT_EXTRA_SMALL,
} from '../constants'
import { isRtl } from '../utils/rtl'
import { textAtCursorMatchesToken } from '../utils/cursor_token_match'
import Responsive from '../features/ui/util/responsive_component'
import AutosuggestAccount from './autosuggest_account'
import AutosuggestEmoji from './autosuggest_emoji'
import Input from './input'
import Composer from './composer'

export default class AutosuggestTextbox extends ImmutablePureComponent {

  static propTypes = {
    value: PropTypes.string,
    valueMarkdown: PropTypes.string,
    suggestions: ImmutablePropTypes.list,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    onSuggestionSelected: PropTypes.func.isRequired,
    onSuggestionsClearRequested: PropTypes.func.isRequired,
    onSuggestionsFetchRequested: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onKeyUp: PropTypes.func,
    onKeyDown: PropTypes.func,
    id: PropTypes.string,
    searchTokens: PropTypes.arrayOf(PropTypes.string),
    onPaste: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    textarea: PropTypes.bool,
    small: PropTypes.bool,
    isPro: PropTypes.bool,
    isProPlus: PropTypes.bool,
    isEdit: PropTypes.bool,
  }

  static defaultProps = {
    searchTokens: ['@', ':'],
  }

  state = {
    suggestionsHidden: true,
    focused: false,
    selectedSuggestion: 0,
    lastToken: null,
    tokenStart: 0,
  }

  onChange = (e, value, markdown, selectionStart) => {
    if (!isObject(e)) {
      e = {
        target: {
          value,
          markdown,
          selectionStart,
        },
      }
    }

    const [ tokenStart, token ] = textAtCursorMatchesToken(e.target.value, e.target.selectionStart, this.props.searchTokens);

    if (token !== null && this.state.lastToken !== token) {
      this.setState({ lastToken: token, selectedSuggestion: 0, tokenStart });
      this.props.onSuggestionsFetchRequested(token);
    } else if (token === null) {
      this.setState({ lastToken: null });
      this.props.onSuggestionsClearRequested();
    }

    this.props.onChange(e, e.target.selectionStart);
  }

  onKeyDown = (e) => {
    const { suggestions, disabled } = this.props;
    const { selectedSuggestion, suggestionsHidden } = this.state;

    if (disabled) {
      e.preventDefault();
      return;
    }

    // Ignore key events during text composition
    // e.key may be a name of the physical key even in this case (e.x. Safari / Chrome on Mac)
    if (e.which === 229 || e.isComposing) return;

    switch (e.key) {
    case 'Escape':
      if (suggestions.size === 0 || suggestionsHidden) {
        document.querySelector('#gabsocial').focus()
      } else {
        e.preventDefault();
        this.setState({ suggestionsHidden: true });
      }

      break;
    case 'ArrowDown':
      if (suggestions.size > 0 && !suggestionsHidden) {
        e.preventDefault();
        this.setState({ selectedSuggestion: Math.min(selectedSuggestion + 1, suggestions.size - 1) });
      }

      break;
    case 'ArrowUp':
      if (suggestions.size > 0 && !suggestionsHidden) {
        e.preventDefault();
        this.setState({ selectedSuggestion: Math.max(selectedSuggestion - 1, 0) });
      }

      break;
    case 'Enter':
    case 'Tab':
      // Select suggestion
      if (this.state.lastToken !== null && suggestions.size > 0 && !suggestionsHidden) {
        e.preventDefault();
        e.stopPropagation();
        this.props.onSuggestionSelected(this.state.tokenStart, this.state.lastToken, suggestions.get(selectedSuggestion));
      }

      break;
    }

    if (e.defaultPrevented || !this.props.onKeyDown) return;

    this.props.onKeyDown(e);
  }

  onBlur = () => {
    this.setState({ suggestionsHidden: true, focused: false });

    if (this.props.onBlur) {
      this.props.onBlur();
    }
  }

  onFocus = () => {
    this.setState({ focused: true });

    if (this.props.onFocus) {
      this.props.onFocus();
    }
  }

  onPaste = (e) => {
    if (this.props.onPaste && e.clipboardData && e.clipboardData.files.length === 1) {
      this.props.onPaste(e.clipboardData.files);
      e.preventDefault();
    }
  }

  onSuggestionClick = (e) => {
    const suggestion = this.props.suggestions.get(e.currentTarget.getAttribute('data-index'));
    e.preventDefault();
    this.props.onSuggestionSelected(this.state.tokenStart, this.state.lastToken, suggestion);
    this.textbox.focus();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.suggestions !== this.props.suggestions && nextProps.suggestions.size > 0 && this.state.suggestionsHidden && this.state.focused) {
      this.setState({ suggestionsHidden: false });
    }
  }

  renderSuggestion = (suggestion, i) => {
    const { selectedSuggestion } = this.state;
    let inner, key;

    if (typeof suggestion === 'object') {
      inner = <AutosuggestEmoji emoji={suggestion} />;
      key = suggestion.id;
    } else {
      inner = <AutosuggestAccount id={suggestion} />;
      key = suggestion;
    }

    const isSelected = i === selectedSuggestion
    const classes = CX({
      bgPrimary: !isSelected,
      bgSubtle: isSelected,
    })

    return (
      <div
        role='button'
        tabIndex='0'
        key={key}
        data-index={i}
        className={classes}
        onMouseDown={this.onSuggestionClick}
      >
        {inner}
      </div>
    );
  }

  setTextbox = (c) => {
    this.textbox = c
  }

  render() {
    const {
      value,
      small,
      suggestions,
      disabled,
      placeholder,
      onKeyUp,
      children,
      valueMarkdown,
      id,
      isPro,
      isProPlus,
      isEdit,
    } = this.props

    const { suggestionsHidden } = this.state

    const textareaContainerClasses = CX({
      default: 1,
      maxWidth100PC: 1,
      flexGrow1: small,
      justifyContentCenter: small,
      py5: small,
    })

    const textareaClasses = CX({
      default: 1,
      font: 1,
      wrap: 1,
      resizeNone: 1,
      bgTransparent: 1,
      outlineNone: 1,
      lineHeight125: 1,
      colorPrimary: 1,
      width100PC: !small,
      pt15: !small,
      px15: !small,
      px10: small,
      pb10: !small,
      fs16PX: !small,
      fs14PX: small,
      heightMax200PX: small,
      heightMax80VH: !small,
      heightMin80PX: !small,
    })

    return (
      <Fragment>
        <div className={textareaContainerClasses}>
          <label htmlFor={id} className={_s.visiblyHidden}>
            {placeholder}
          </label>
          
          <Responsive max={BREAKPOINT_EXTRA_SMALL}>
            <Textarea
              id={id}
              inputRef={this.setTextbox}
              className={textareaClasses}
              disabled={disabled}
              placeholder={placeholder}
              autoFocus={false}
              value={value}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              onKeyUp={onKeyUp}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onPaste={this.onPaste}
              aria-autocomplete='list'
            />
          </Responsive>

          <Responsive min={BREAKPOINT_EXTRA_SMALL}>
            <Composer
              inputRef={this.setTextbox}
              disabled={disabled}
              placeholder={placeholder}
              value={value}
              valueMarkdown={valueMarkdown}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              onKeyUp={onKeyUp}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              onPaste={this.onPaste}
              small={small}
              isEdit={isEdit}
              isPro={isPro}
              isProPlus={isProPlus}
            />
          </Responsive>

          {children}
        </div>

        {
          !small && !suggestionsHidden && !suggestions.isEmpty() &&
          <div className={[_s.default].join(' ')}>
            {suggestions.map(this.renderSuggestion)}
          </div>
        }
      </Fragment>
    )
  }

}
