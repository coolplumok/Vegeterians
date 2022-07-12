import { defineMessages, injectIntl } from 'react-intl'
import {
  fetchGifCategories,
  fetchGifResults,
  clearGifResults,
  setSelectedGif,
  changeGifSearchText
} from '../../actions/tenor'
import Block from '../block'
import Button from '../button'
import ColumnIndicator from '../column_indicator'
import Image from '../image'
import Input from '../input'
import Text from '../text'

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
  title: { id: 'pick_gif', defaultMessage: 'Select a GIF' },
  searchGifs: { id: 'search_gifs', defaultMessage: 'Search for GIFs' },
})

const mapStateToProps = (state) => ({
  categories: state.getIn(['tenor', 'categories']),
  suggestions: state.getIn(['tenor', 'suggestions']),
  results: state.getIn(['tenor', 'results']),
  loading: state.getIn(['tenor', 'loading']),
  error: state.getIn(['tenor', 'error']),
  searchText: state.getIn(['tenor', 'searchText']),
})

export const mapDispatchToProps = (dispatch, { onClose }) => ({

  handleCloseModal() {
    dispatch(changeGifSearchText(''))
    dispatch(clearGifResults())
    onClose()
  },

  handleFetchCategories: () => {
    dispatch(fetchGifCategories())
  },

  handleOnChange: (value) => {
    dispatch(changeGifSearchText(value))
    if (value.length >= 3) {
      dispatch(fetchGifResults())
    } else if (value.length === 0) {
      dispatch(clearGifResults())
    }
  },

  handleSelectResult: (result) => {
    dispatch(setSelectedGif(result))
    onClose()
  },

  // dispatchSubmit: (e) => {
  //   e.preventDefault();
  //   dispatch(getGifs());
  // },

})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class GifPickerModal extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    handleCloseModal: PropTypes.func.isRequired,
    handleFetchCategories: PropTypes.func.isRequired,
    handleOnChange: PropTypes.func.isRequired,
    handleSelectResult: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    results: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    searchText: PropTypes.string,
  }

  state = {
    row: 0,
  }

  componentDidMount() {
    this.props.handleFetchCategories()
  }

  onChange = (value) => {
    this.props.handleOnChange(value)
  }

  onHandleCloseModal = () => {
    this.props.handleCloseModal()
  }

  handleSelectCategory = (category) => {
    this.props.handleOnChange(category)
  }

  handleSelectGifResult = (resultBlock) => {
    this.props.handleSelectResult(resultBlock)
  }

  render() {
    const {
      intl,
      categories,
      results,
      loading,
      error,
      searchText,
    } = this.props

    return (
      <div style={{ width: '560px' }}>
        <Block>
          <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.justifyContentCenter, _s.borderBottom1PX, _s.borderColorSecondary, _s.height53PX, _s.px15].join(' ')}>
            <div className={[_s.default, _s.flexGrow1, _s.mr5].join(' ')}>
              <Input
                onChange={this.onChange}
                value={searchText}
                prependIcon='search'
                placeholder={intl.formatMessage(messages.searchGifs)}
              />
            </div>
            <Button
              backgroundColor='none'
              title={intl.formatMessage(messages.close)}
              className={_s.mlAuto}
              onClick={this.onHandleCloseModal}
              color='secondary'
              icon='close'
              iconSize='10px'
            />
          </div>
          <div className={[_s.default, _s.heightMin50VH, _s.heightMax80VH, _s.overflowYScroll].join(' ')}>
            {
              error &&
              <ColumnIndicator type='error' />
            }
            {
              (loading && results.length === 0 && categories.length === 0) &&
              <ColumnIndicator type='loading' />
            }

            {
              (results.length > 0 || categories.length > 0) &&
              <div className={[_s.default, _s.width100PC, _s.height100PC].join(' ')}>
                {
                  results.length === 0 && categories.length > 0 &&
                  <GifCategoriesCollection categories={categories} handleSelectCategory={this.handleSelectCategory} />
                }
                {
                  results.length > 0 &&
                  <GifResultsCollection results={results} handleSelectGifResult={this.handleSelectGifResult} />
                }
              </div>
            }
          </div>
        </Block>
      </div>
    )
  }
}

class GifResultsCollectionColumn extends PureComponent {

  static propTypes = {
    results: PropTypes.array.isRequired,
    handleSelectGifResult: PropTypes.func.isRequired,
  }

  onClick = (resultId) => {
    this.props.handleSelectGifResult(resultId)
  }

  render() {
    const { results } = this.props

    return (
      <div className={[_s.default, _s.flexNormal].join(' ')}>
      {
        results.map((result, i) => (
          <button
            key={`gif-result-item-${i}`}
            onClick={() => this.onClick(result)}
            className={[_s.default, _s.outlineNone, _s.bgTransparent, _s.cursorPointer, _s.px2, _s.py2].join(' ')}
          >
            <Image
              height={result.media[0].tinygif.dims[1]}
              src={result.media[0].tinygif.url}
            />
          </button>
        ))
      }
      </div>
    )
  }

}

class GifResultsCollection extends PureComponent {

  static propTypes = {
    results: PropTypes.array.isRequired,
    handleSelectGifResult: PropTypes.func.isRequired,
  }

  render() {
    const { results, handleSelectGifResult } = this.props

    // : todo :
    const count = results.length
    const columnIndex = 10

    return (
      <div className={[_s.default, _s.height100PC, _s.flexRow, _s.width100PC].join(' ')}>
        <GifResultsCollectionColumn
          results={results.slice(0, columnIndex)}
          handleSelectGifResult={handleSelectGifResult}
        />
        <GifResultsCollectionColumn
          results={results.slice(columnIndex, columnIndex * 2)}
          handleSelectGifResult={handleSelectGifResult}
        />
        <GifResultsCollectionColumn
          results={results.slice(columnIndex * 2, count)}
          handleSelectGifResult={handleSelectGifResult}
        />
      </div>
    )
  }
}

class GifCategoriesCollection extends PureComponent {
  static propTypes = {
    categories: PropTypes.array.isRequired,
    handleSelectCategory: PropTypes.func.isRequired,
  }

  onClick = (term) => {
    this.props.handleSelectCategory(term)
  }

  render() {
    const { categories } = this.props

    return (
      <div className={[_s.default, _s.height100PC, _s.width100PC, _s.flexRow, _s.flexWrap].join(' ')}>
        {
          categories.map((category, i) => (
            <button
              key={`gif-category-${i}`}
              onClick={() => this.onClick(category.searchterm)}
              className={[_s.default, _s.outlineNone, _s.bgTransparent, _s.px2, _s.py2, _s.width50PC].join(' ')}
            >
              <div className={[_s.default, _s.cursorPointer].join(' ')}>
                <Image
                  height={150}
                  src={category.image}
                />
                <div className={[_s.default, _s.posAbs, _s.videoPlayerControlsBackground, _s.right0, _s.bottom0, _s.left0, _s.py10, _s.px10].join(' ')}>
                  <Text color='white' weight='bold' size='extraLarge'>
                    {category.searchterm}
                  </Text>
                </div>
              </div>
            </button>
          ))
        }
      </div>
    )
  }

}