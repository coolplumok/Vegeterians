import {
  BREAKPOINT_EXTRA_SMALL,
  POPOVER_COMMENT_SORTING_OPTIONS,
  POPOVER_DATE_PICKER,
  POPOVER_EMOJI_PICKER,
  POPOVER_GROUP_LIST_SORT_OPTIONS,
  POPOVER_GROUP_MEMBER_OPTIONS,
  POPOVER_GROUP_OPTIONS,
  POPOVER_NAV_SETTINGS,
  POPOVER_PROFILE_OPTIONS,
  POPOVER_SEARCH,
  POPOVER_SIDEBAR_MORE,
  POPOVER_STATUS_OPTIONS,
  POPOVER_STATUS_EXPIRATION_OPTIONS,
  POPOVER_STATUS_VISIBILITY,
  POPOVER_USER_INFO,
  POPOVER_VIDEO_STATS,
} from '../../constants'
import {
  CommentSortingOptionsPopover,
  DatePickerPopover,
  EmojiPickerPopover,
  GroupListSortOptionsPopover,
  GroupMemberOptionsPopover,
  GroupOptionsPopover,
  NavSettingsPopover,
  ProfileOptionsPopover,
  SearchPopover,
  SidebarMorePopover,
  StatusExpirationOptionsPopover,
  StatusOptionsPopover,
  StatusVisibilityPopover,
  UserInfoPopover,
  VideoStatsPopover,
} from '../../features/ui/util/async_components'

import { closePopover } from '../../actions/popover'
import { getWindowDimension } from '../../utils/is_mobile'
import Bundle from '../../features/ui/util/bundle'
import ModalBase from '../modal/modal_base'
import PopoverBase from './popover_base'
import ErrorPopover from './error_popover'
import LoadingPopover from './loading_popover'

const initialState = getWindowDimension()

const POPOVER_COMPONENTS = {}
POPOVER_COMPONENTS[POPOVER_COMMENT_SORTING_OPTIONS] = CommentSortingOptionsPopover
POPOVER_COMPONENTS[POPOVER_DATE_PICKER] = DatePickerPopover
POPOVER_COMPONENTS[POPOVER_EMOJI_PICKER] = EmojiPickerPopover
POPOVER_COMPONENTS[POPOVER_GROUP_LIST_SORT_OPTIONS] = GroupListSortOptionsPopover
POPOVER_COMPONENTS[POPOVER_GROUP_MEMBER_OPTIONS] = GroupMemberOptionsPopover
POPOVER_COMPONENTS[POPOVER_GROUP_OPTIONS] = GroupOptionsPopover
POPOVER_COMPONENTS[POPOVER_NAV_SETTINGS] = NavSettingsPopover
POPOVER_COMPONENTS[POPOVER_PROFILE_OPTIONS] = ProfileOptionsPopover
POPOVER_COMPONENTS[POPOVER_SEARCH] = SearchPopover
POPOVER_COMPONENTS[POPOVER_SIDEBAR_MORE] = SidebarMorePopover
POPOVER_COMPONENTS[POPOVER_STATUS_OPTIONS] = StatusOptionsPopover
POPOVER_COMPONENTS[POPOVER_STATUS_EXPIRATION_OPTIONS] = StatusExpirationOptionsPopover
POPOVER_COMPONENTS[POPOVER_STATUS_VISIBILITY] = StatusVisibilityPopover
POPOVER_COMPONENTS[POPOVER_USER_INFO] = UserInfoPopover
POPOVER_COMPONENTS[POPOVER_VIDEO_STATS] = VideoStatsPopover

const mapStateToProps = (state) => ({
  type: state.getIn(['popover', 'popoverType']),
  props: state.getIn(['popover', 'popoverProps'], {}),
})

const mapDispatchToProps = (dispatch) => ({
  onClose: (type) => dispatch(closePopover(type)),
})

export default
@connect(mapStateToProps, mapDispatchToProps)
class PopoverRoot extends PureComponent {

  static propTypes = {
    type: PropTypes.string,
    props: PropTypes.object,
    onClose: PropTypes.func.isRequired,
  }

  state = {
    width: initialState.width,
  }

  componentDidMount() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize, false)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false)
  }

  componentDidUpdate() {
    const { type } = this.props
    const { width } = this.state

    if (width <= BREAKPOINT_EXTRA_SMALL && !!type) {
      document.body.classList.add(_s.overflowYHidden)
    } else {
      document.body.classList.remove(_s.overflowYHidden)
    }
  }

  handleResize = () => {
    const { width } = getWindowDimension()

    this.setState({ width })
  }

  renderLoading = () => {
    const { width } = this.state
    const isXS = width <= BREAKPOINT_EXTRA_SMALL

    return <LoadingPopover isXS={isXS} onClose={this.props.onClose} />
  }

  renderError = () => {
    const { width } = this.state
    const isXS = width <= BREAKPOINT_EXTRA_SMALL

    return <ErrorPopover isXS={isXS} onClose={this.props.onClose} />
  }

  render() {
    const { type, props, onClose } = this.props
    const { width } = this.state

    const visible = !!type

    const isXS = width <= BREAKPOINT_EXTRA_SMALL
    const Wrapper = isXS ? ModalBase : PopoverBase

    //If is XS and popover is user info, dont show
    //Since on mobile this should not be visible
    if (isXS && type === POPOVER_USER_INFO) return null

    return (
      <Wrapper
        onClose={onClose}
        visible={visible}
        innerRef={this.setRef}
        {...props}
      >
        {
          visible &&
          <Bundle
            fetchComponent={POPOVER_COMPONENTS[type]}
            loading={this.renderLoading}
            error={this.renderError}
            renderDelay={150}
          >
            {
              (Component) => <Component isXS={isXS} {...props} />
            }
          </Bundle>
        }
      </Wrapper>
    )
  }

}