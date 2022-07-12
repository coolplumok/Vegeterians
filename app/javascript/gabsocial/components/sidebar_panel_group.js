import { Fragment } from 'react'
import { me, promotions } from '../initial_state'
import StatusPromotionPanel from './panel/status_promotion_panel'

export default class SidebarPanelGroup extends PureComponent {

  static propTypes = {
    layout: PropTypes.array.isRequired,
    page: PropTypes.string.isRequired,
    promotion: PropTypes.object,
  }

  render() {
    const { layout, page } = this.props

    if (Array.isArray(promotions) && Array.isArray(layout) && !!me) {
      const sidebarPromotionPageId = `${page}.sidebar`
      const promotion = promotions.find(p => p.timeline_id === sidebarPromotionPageId)

      if (!!promotion) {
        const correctedPosition = promotion.position - 1 > layout.length ? layout.length - 1 : promotion.position
        if (!layout.find(p => p.key === 'status-promotion-panel')) {
          layout.splice(correctedPosition, 0, <StatusPromotionPanel key='status-promotion-panel' statusId={promotion.status_id} />)
        }
      }
    }

    return (
      <Fragment>
        {layout}
      </Fragment>
    )
  }

}
