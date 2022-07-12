import classNames from 'classnames/bind'

// Bind CSS Modules global variable `_s` to classNames module
const cx = classNames.bind(_s)

// Define colors for enumeration for Text component `color` prop
const COLORS = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  brand: 'brand',
  error: 'error',
  white: 'white',
  inherit: 'inherit',
}

// Define sizes for enumeration for Text component `size` prop
const SIZES = {
  extraSmall: 'extraSmall',
  small: 'small',
  normal: 'normal',
  medium: 'medium',
  large: 'large',
  extraLarge: 'extraLarge',
}

// Define weights for enumeration for Text component `weight` prop
const WEIGHTS = {
  normal: 'normal',
  medium: 'medium',
  bold: 'bold',
  extraBold: 'extraBold',
}

// Define alignments for enumeration for Text component `align` prop
const ALIGNMENTS = {
  center: 'center',
  left: 'left',
}

/**
 * Renders a text component
 * @param {string} [props.align='left] - the alignment of the text
 * @param {bool} [props.isBadge] - to style the text as a badge
 * @param {string} [props.className] - add custom className
 * @param {string} [props.color='primary'] color of the text
 * @param {bool} [props.hasUnderline] - if the text is underlined
 * @param {string} [props.htmlFor] - define the `for` attribute on the tag
 * @param {string} [props.size='normal'] size of the text
 * @param {string} [props.tagName='span'] tagName of the text element
 * @param {string} [props.weight='normal'] weight of the text
 */
export default class Text extends PureComponent {

  static propTypes = {
    align: PropTypes.oneOf(Object.keys(ALIGNMENTS)),
    isBadge: PropTypes.bool,
    children: PropTypes.any,
    className: PropTypes.string,
    color: PropTypes.oneOf(Object.keys(COLORS)),
    hasUnderline: PropTypes.bool,
    htmlFor: PropTypes.string,
    size: PropTypes.oneOf(Object.keys(SIZES)),
    tagName: PropTypes.string,
    weight: PropTypes.oneOf(Object.keys(WEIGHTS)),
  }

  static defaultProps = {
    tagName: 'span',
    align: ALIGNMENTS.left,
    color: COLORS.primary,
    size: SIZES.normal,
    weight: WEIGHTS.normal,
  }

  render() {
    const {
      tagName,
      className,
      children,
      color,
      size,
      weight,
      align,
      htmlFor,
      isBadge,
      hasUnderline,
    } = this.props

    // Style the component according to props
    const classes = cx(className, {
      default: 1,
      text: 1,

      radiusSmall: isBadge,
      lineHeight15: isBadge,
      px5: isBadge,

      colorPrimary: color === COLORS.primary,
      colorSecondary: color === COLORS.secondary,
      colorTertiary: color === COLORS.tertiary,
      colorBrand: color === COLORS.brand,
      colorWhite: color === COLORS.white,
      inherit: color === COLORS.inherit,

      fs19PX: size === SIZES.extraLarge,
      fs16PX: size === SIZES.large,
      fs15PX: size === SIZES.medium,
      fs14PX: size === SIZES.normal,
      fs13PX: size === SIZES.small,
      fs12PX: size === SIZES.extraSmall,

      fontWeightNormal: weight === WEIGHTS.normal,
      fontWeightMedium: weight === WEIGHTS.medium,
      fontWeightBold: weight === WEIGHTS.bold,
      fontWeightExtraBold: weight === WEIGHTS.extraBold,

      textAlignLeft: align === ALIGNMENTS.left,
      textAlignCenter: align === ALIGNMENTS.center,

      underline: hasUnderline,
    })

    return React.createElement(
      tagName,
      {
        htmlFor,
        className: classes,
      },
      children,
    )
  }

}