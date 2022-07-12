import { defineMessages, injectIntl } from 'react-intl'
import { fetchFeaturedProducts } from '../../actions/shop'
import { URL_DISSENTER_SHOP } from '../../constants'
import PanelLayout from './panel_layout'
import Image from '../image'
import Text from '../text'

const messages = defineMessages({
  title: { id: 'shop_panel.title', defaultMessage: 'Dissenter Shop' },
  shop_now: { id: 'shop_panel.shop_now', defaultMessage: 'Visit the Dissenter Shop' },
})

const mapStateToProps = (state) => ({
  items: state.getIn(['shop', 'featured', 'items']),
  isError: state.getIn(['shop', 'featured', 'isError']),
})

const mapDispatchToProps = (dispatch) => ({
  onFetchFeaturedProducts: () => dispatch(fetchFeaturedProducts()),
})

export default
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class ShopPanel extends PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    products: PropTypes.array,
    isLazy: PropTypes.bool,
    onFetchFeaturedProducts: PropTypes.func.isRequired,
    isError: PropTypes.bool.isRequired,
  }

  state = {
    fetched: !this.props.isLazy,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.shouldLoad && !prevState.fetched) {
      return { fetched: true }
    }

    return null
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.fetched && this.state.fetched) {
      this.props.onFetchFeaturedProducts()
    }
  }

  componentDidMount() {
    if (!this.props.isLazy) {
      this.props.onFetchFeaturedProducts()
    }
  }

  render() {
    const {
      intl,
      items,
      isError,
    } = this.props

    if (!items || isError || !Array.isArray(items)) return null

    return (
      <PanelLayout
        noPadding
        title={intl.formatMessage(messages.title)}
        footerButtonTitle={intl.formatMessage(messages.shop_now)}
        footerButtonHref={URL_DISSENTER_SHOP}
      >
        <div className={[_s.default, _s.flexRow, _s.flexWrap, _s.pl5, _s.pt5].join(' ')}>
          {
            items.map((block) => (
              <a
                className={[_s.default, _s.width50PC, _s.noUnderline, _s.overflowHidden, _s.cursorPointer, _s.pb5, _s.pr5].join(' ')}
                target='_blank'
                rel='noreferrer noopener'
                href={block.link}
                title={block.name}
              >
                <Image
                  src={block.image}
                  className={[_s.width100PC, _s.height122PX].join(' ')}
                />

                <Text
                  align='center'
                  className={[_s.py10, _s.px10].join(' ')}
                >
                  {block.name}
                </Text>
              </a>
            ))
          }
        </div>
      </PanelLayout>
    )
  }
}