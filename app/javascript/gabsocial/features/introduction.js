import { Fragment } from 'react'
import ReactSwipeableViews from 'react-swipeable-views'
import ImmutablePropTypes from 'react-immutable-proptypes'
import ImmutablePureComponent from 'react-immutable-pure-component'
import {
  CX,
  BREAKPOINT_EXTRA_SMALL,
} from '../constants'
import { me } from '../initial_state'
import { saveShownOnboarding } from '../actions/onboarding'
import { fetchGroups } from '../actions/groups'
import { saveUserProfileInformation } from '../actions/user'
import { makeGetAccount } from '../selectors'
import Button from '../components/button'
import Divider from '../components/divider'
import FileInput from '../components/file_input'
import GroupListItem from '../components/group_list_item'
import Heading from '../components/heading'
import Icon from '../components/icon'
import Image from '../components/image'
import Input from '../components/input'
import Text from '../components/text'
import ComposeFormContainer from './compose/containers/compose_form_container'
import Responsive from './ui/util/responsive_component'

class SlideWelcome extends PureComponent {

  render() {
    return (
      <div className={[_s.default, _s.width100PC, _s.height100PC].join(' ')}>
        <Image src='/headers/onboarding.png' alt='Welcome to Vegeterians.live' />

        <div className={[_s.default, _s.px15, _s.py15].join(' ')}>

          <Text size='large'>Vegeterians.live is a place for online health freedom and knowledge sharing. </Text>
          <br />
          <Text size='large'>Vegeterians.Live is a free, secure, private portal for the wellness community, a place to gather, talk health, and organize. </Text>
          <br />
          <Text size='large'>Holistic health doctors, health professionals, researchers and influencers are increasingly being censored and de-platformed by the big social networks. </Text>
          <br />
          <Text size='large'>We are committed to preserving access to life-saving natural health knowledge and empowering practitioners and health seekers. </Text>
          <br />
          <Text size='large'>Speak freely, associate freely!</Text>
          <br />
          <Text size='large'>Let's get started!</Text>

        </div>
      </div>
    )
  }
}

class SlidePhotos extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
  }

  state = {
    displayNameValue: this.props.account.get('display_name'),
  }

  handleCoverPhotoChange = (e) => {
    try {
      this.props.onSave({ header: e.target.files[0] })
    } catch (error) {
      //
    }
  }

  handleProfilePhotoChange = (e) => {
    try {
      this.props.onSave({ avatar: e.target.files[0] })
    } catch (error) {
      //
    }
  }

  handleDisplayNameChange = (value) => {
    this.setState({ displayNameValue: value })
  }

  handleDisplayNameBlur = () => {
    this.props.onSave({
      displayName: this.state.displayNameValue,
    })
  }

  render() {
    const { displayNameValue } = this.state

    return (
      <div className={[_s.default, _s.width100PC].join(' ')}>
        <div className={[_s.default, _s.px15, _s.py15, _s.alignItemsCenter].join(' ')}>

          <div className={[_s.default, _s.py10, _s.maxWidth640PX].join(' ')}>
            <Text size='large' align='center'>Set your cover photo, profile photo and enter your display name so people can find you.</Text>
          </div>

          <div className={[_s.default, _s.mt15, _s.width100PC, _s.alignItemsCenter].join(' ')}>
            <div className={[_s.default, _s.border1PX, _s.borderColorSecondary, _s.overflowHidden, _s.radiusSmall, _s.bgPrimary].join(' ')}>
              <FileInput
                width='300px'
                height='140px'
                id='cover-photo'
                onChange={this.handleCoverPhotoChange}
              />
              <div className={[_s.default, _s.mtNeg32PX, _s.alignItemsCenter, _s.justifyContentCenter].join(' ')}>
                <FileInput
                  width='124px'
                  height='124px'
                  id='profile-photo'
                  className={[_s.circle, _s.border6PX, _s.borderColorWhite, _s.bgPrimary].join(' ')}
                  onChange={this.handleProfilePhotoChange}
                />
              </div>
              <div className={[_s.default, _s.py5, _s.px15, _s.mt5, _s.mb15].join(' ')}>
                <Input
                  id='display-name'
                  title='Display name'
                  placeholder='Add your name...'
                  value={displayNameValue}
                  onChange={this.handleDisplayNameChange}
                  onBlur={this.handleDisplayNameBlur}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class SlideGroups extends ImmutablePureComponent {

  static propTypes = {
    groupIds: ImmutablePropTypes.list,
  }

  render() {
    const { groupIds } = this.props

    return (
      <div className={[_s.default, _s.width100PC].join(' ')}>
        <div className={[_s.default, _s.py15, _s.alignItemsCenter].join(' ')}>
          <div className={[_s.default, _s.px15, _s.mb15].join(' ')}>
            <Text size='large'>Vegeterians.live Groups are a great way to connect with people who share your interests. Please select a few groups to get started.</Text>
          </div>

          <div className={[_s.default, _s.width100PC].join(' ')}>
            {
              groupIds.map((groupId, i) => (
                <GroupListItem
                  isAddable
                  isStatic
                  key={`group-collection-item-${i}`}
                  id={groupId}
                  isLast={groupIds.count() - 1 === i}
                />
              ))
            }
          </div>
        </div>
      </div>
    )
  }
}

class SlideFirstPost extends PureComponent {

  static propTypes = {
    submitted: PropTypes.bool.isRequired,
    onNext: PropTypes.func.isRequired,
  }

  render() {
    const { submitted } = this.props

    return (
      <div className={[_s.default, _s.width100PC].join(' ')}>
        <div className={[_s.default, _s.py15, _s.px15].join(' ')}>
          {
            !submitted &&
            <Fragment>
              <Text size='large' className={_s.pb10}>Now let's make your very first Vegeterians.live post! Please introduce yourself to the Vegeterians.live community. How did you hear about Vegeterians.live? What are you interested in?</Text>
              <br />

              <Divider />

              <div className={[_s.default, _s.mt15, _s.boxShadowBlock, _s.radiusSmall].join(' ')}>
                <ComposeFormContainer
                  hidePro
                  autoFocus
                />
              </div>
            </Fragment>
          }
          {
            submitted &&
            <Fragment>
              <Text size='large' align='center'>Your post was posted!</Text>
              <br />
              <Text size='large' align='center'>Welcome to our community, remember to speak freely.</Text>
              <br />
              <Button
                href='/home'
                onClick={this.props.onNext}
              >
                Finish
              </Button>
            </Fragment>
          }

        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  account: makeGetAccount()(state, me),
  groupIds: state.getIn(['group_lists', 'onboarding', 'items']),
  shownOnboarding: state.getIn(['settings', 'shownOnboarding'], false),
  isSubmitting: state.getIn(['compose', 'is_submitting']),
})

const mapDispatchToProps = (dispatch) => ({
  onSaveShownOnboarding: () => dispatch(saveShownOnboarding()),
  onFetchFeaturedGroups: () => dispatch(fetchGroups('onboarding')),
  onSaveUserProfileInformation(data) {
    dispatch(saveUserProfileInformation(data))
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
class Introduction extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    groupIds: ImmutablePropTypes.list,
    isSubmitting: PropTypes.bool.isRequired,
    shownOnboarding: PropTypes.bool.isRequired,
    onSaveShownOnboarding: PropTypes.func.isRequired,
    onFetchFeaturedGroups: PropTypes.func.isRequired,
    onSaveUserProfileInformation: PropTypes.func.isRequired,
  }

  state = {
    currentIndex: 0,
    submittedFirstPost: false,
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyUp)
    this.props.onFetchFeaturedGroups()
    this.props.onSaveShownOnboarding()
  }

  componentDidUpdate(prevProps) {
    if (!this.state.submittedFirstPost && !prevProps.isSubmitting && this.props.isSubmitting) {
      this.setState({ submittedFirstPost: true })
    }
  }

  componentWillUnmount() {
    window.addEventListener('keyup', this.handleKeyUp)
  }

  handleDot = (e) => {
    const i = Number(e.currentTarget.getAttribute('data-index'))
    e.preventDefault()
    this.setState({ currentIndex: i })
  }

  handlePrev = () => {
    this.setState(({ currentIndex }) => ({
      currentIndex: Math.max(0, currentIndex - 1),
    }))
  }

  handleNext = () => {
    const newIndex = Math.min(this.state.currentIndex + 1, 3)
    this.setState({
      currentIndex: newIndex,
    })
  }

  handleSwipe = (index) => {
    this.setState({ currentIndex: index })
  }

  handleKeyUp = ({ key }) => {
    switch (key) {
      case 'ArrowLeft':
        this.handlePrev()
        break
      case 'ArrowRight':
        this.handleNext()
        break
    }
  }

  handleOnSaveUserProfileInformation = (data) => {
    this.props.onSaveUserProfileInformation(data)
  }

  render() {
    const { account, groupIds } = this.props
    const { currentIndex, submittedFirstPost } = this.state

    const pages = [
      <SlideWelcome />,
      <SlidePhotos
        account={account}
        onSave={this.handleOnSaveUserProfileInformation}
      />,
      <SlideGroups groupIds={groupIds} />,
      <SlideFirstPost
        submitted={submittedFirstPost}
        onNext={this.handleNext}
      />,
    ]

    const titles = [
      `Welcome to Vegeterians.live!`,
      'Complete your profile',
      'Find your people',
      'Start a conversation',
    ]
    const title = titles[currentIndex]

    const pagination = pages.map((page, i) => {
      const btnClasses = CX({
        default: 1,
        width10PX: 1,
        height10PX: 1,
        outlineNone: 1,
        circle: 1,
        cursorPointer: 1,
        bgBrandLightOpaque: i !== currentIndex,
        bgBrand: i === currentIndex,
      })

      return (
        <li className={[_s.default, _s.px5].join(' ')} key={`intro-slide-${i}`}>
          <button tabIndex='0' className={btnClasses} onClick={this.handleDot} data-index={i} />
        </li>
      )
    })

    const nextTitle = currentIndex === 3 ? 'Finish' : 'Next'

    return (
      <div className={[_s.default, _s.width100PC, _s.heightMax80VH].join(' ')}>
        <div className={[_s.default, _s.flexRow, _s.alignItemsCenter, _s.justifyContentCenter, _s.borderBottom1PX, _s.borderColorSecondary, _s.height53PX, _s.px15].join(' ')}>
          <Responsive min={BREAKPOINT_EXTRA_SMALL}>
            <Heading>
              {title}
            </Heading>
          </Responsive>
          <Responsive max={BREAKPOINT_EXTRA_SMALL}>
            <Heading size='h2'>
              {title}
            </Heading>
          </Responsive>
          <div className={[_s.mlAuto].join(' ')}>
            <Button
              href={currentIndex === 3 ? '/home' : undefined}
              onClick={this.handleNext}
              className={_s.px10}
              icon={currentIndex !== 3 ? 'arrow-right' : undefined}
              iconSize={currentIndex !== 3 ? '18px' : undefined}
            >
              {
                currentIndex === 3 &&
                <Fragment>
                  <Responsive min={BREAKPOINT_EXTRA_SMALL}>
                    <Text color='white' className={_s.px5}>{nextTitle}</Text>
                  </Responsive>
                  <Responsive max={BREAKPOINT_EXTRA_SMALL}>
                    <Icon id='check' size='14px' className={_s.fillWhite} />
                  </Responsive>
                </Fragment>
              }
            </Button>
          </div>
        </div>

        <ReactSwipeableViews
          index={currentIndex}
          onChangeIndex={this.handleSwipe}
          className={[_s.default, _s.flexNormal, _s.heightCalc80VH106PX].join(' ')}
          containerStyle={{
            width: '100%',
          }}
          slideStyle={{
            // height: '100%',
          }}
        >
          {
            pages.map((page, i) => (
              <div key={i} className={[_s.default, _s.heightCalc80VH106PX].join(' ')}>
                {page}
              </div>
            ))
          }
        </ReactSwipeableViews>

        <div className={[_s.default, _s.px15, _s.height53PX, _s.alignItemsCenter, _s.justifyContentCenter, _s.borderTop1PX, _s.borderColorSecondary, _s.width100PC, _s.flexRow].join(' ')}>
          <div className={[_s.default, _s.width50PX, _s.mrAuto].join(' ')}>
            {
              currentIndex !== 0 &&
              <Button
                className={_s.opacity05}
                onClick={this.handlePrev}
                icon='arrow-left'
                backgroundColor='none'
                color='secondary'
                iconSize='20px'
              />
            }
          </div>
          <ul className={[_s.default, _s.height100PC, _s.flexGrow1, _s.alignItemsCenter, _s.justifyContentCenter, _s.flexRow, _s.listStyleNone].join(' ')}>
            {pagination}
          </ul>
          <Button
            isText
            href={currentIndex === 3 ? '/home' : undefined}
            className={[_s.default, _s.width50PX, _s.height100PC, _s.justifyContentCenter, _s.pr0, _s.pl0, _s.mlAuto, _s.opacity05].join(' ')}
            onClick={this.handleNext}
            backgroundColor='none'
            color='secondary'
          >
            <Text color='inherit' align='right'>{nextTitle}</Text>
          </Button>
        </div>
      </div>
    )
  }
}