import Block from '../block'
import Heading from '../heading'
import Button from '../button'
import Text from '../text'
import Icon from '../icon'

export default class PanelLayout extends PureComponent {

  static propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    children: PropTypes.node,
    headerButtonTitle: PropTypes.string,
    headerButtonIcon: PropTypes.string,
    headerButtonAction: PropTypes.func,
    headerButtonTo: PropTypes.string,
    footerButtonTitle: PropTypes.string,
    footerButtonAction: PropTypes.func,
    footerButtonTo: PropTypes.string,
    footerButtonHref: PropTypes.string,
    noPadding: PropTypes.bool,
  }

  loadMore =(e)=> {
    e.preventDefault();
    this.props.loadMore()
  }

  render() {
    const {
      title,
      subtitle,
      headerButtonTitle,
      headerButtonIcon,
      headerButtonAction,
      headerButtonTo,
      footerButtonTitle,
      footerButtonAction,
      footerButtonTo,
      footerButtonHref,
      noPadding,
      children,
      loadMore_btn,
      visible
    } = this.props

    const iconSize = '16px'
    
    return (
      <aside className={[_s.default, _s.mb15].join(' ')}>
        <Block>
          {
            (title || subtitle) &&
            <div className={[_s.default, _s.px15, _s.py10].join(' ')}>
              <div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
                <Heading size='h2'>
                  {title}
                </Heading>
                {
                  ((!!headerButtonTitle || !!headerButtonIcon) && (!!headerButtonAction || !!headerButtonTo)) &&
                  <div className={[_s.default, _s.mlAuto].join(' ')}>
                    <Button
                      isText
                      backgroundColor='none'
                      color='brand'
                      to={headerButtonTo}
                      onClick={headerButtonAction}
                    >
                      {
                        !!headerButtonTitle &&
                        <Text size='small' color='inherit' weight='bold'>
                          {headerButtonTitle}
                        </Text>
                      }
                      {
                        !!headerButtonIcon &&
                        <Icon id={headerButtonIcon} className={_s.fillBrand} size={iconSize} />
                      }
                    </Button>
                  </div>
                }
              </div>
              {
                subtitle &&
                <Heading size='h4'>
                  {subtitle}
                </Heading>
              }
            </div>
          }

          {
            !noPadding &&
            <div className={[_s.default, _s.px15, _s.py10].join(' ')}>
              {children}
            </div>
          }

          {
            noPadding && children
          }

          {
            (!!footerButtonTitle && (!!footerButtonAction || !!footerButtonTo || !!footerButtonHref)) && 
            <div className={_s.default}>
              <Button
                isText
                color='none'
                backgroundColor='none'
                to={footerButtonTo}
                href={footerButtonHref}
                onClick={this.loadMore}
                className={[_s.px15, _s.py15, _s.bgSubtle_onHover].join(' ')}
              > 
              {loadMore_btn > 0 && visible <= loadMore_btn ? 
              <Text color='brand' size='medium'>
                {footerButtonTitle}
              </Text> : null }  
              </Button>
            </div>
          }
        </Block>
      </aside>
    )
  }

}