import Button from '../button'
import Block from '../block'
import Heading from '../heading'
import css from './subscription.module.css'
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import Icon from '../../assets/loading_icon';
import { me } from '../../initial_state'
import { MODAL_UPGRADE_FLASH_MESSAGE } from '../../constants'
import { openModal } from '../../actions/modal'

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY)

const mapStateToProps = (state) => ({
  isPro: state.getIn(['accounts', me, 'is_pro']),
  isProPlus: state.getIn(['accounts', me, 'is_proplus']),
  subscriptionId: state.getIn(['accounts', me, 'subscription_id']),
})  

const mapDispatchToProps = (dispatch) => ({
  onOpenNotify() {
    dispatch(openModal(MODAL_UPGRADE_FLASH_MESSAGE))
  },
})

export default
@connect(mapStateToProps, mapDispatchToProps)
class SubscriptionModal extends PureComponent {

  state = {
    error_message:'',
    plan:'monthly',
    pro_monthly:"",
    pro_yearly:"",
    proplus_monthly:"",
    proplus_yearly:""
  }

  componentDidMount() {
    axios.get(`/api/v1/plan`)
      .then(res => {
        const price = res.data.all_data;
        this.setState({
          pro_monthly:price.pro_monthly,
          proplus_monthly:price.proplus_monthly,
          pro_yearly:price.pro_yearly,
          proplus_yearly:price.proplus_yearly
        })
      })
  }

  onHandleCloseModal = (e) => {
    this.props.onClose();
  }

  toggle=(e)=>{
    if(e.target.checked){
      this.setState({plan: "yearly"})
    }
    else{
      this.setState({plan: "monthly"})
    }
  }

  Cardpayment = (event) => {
    const PRICE_ID = event.target.id

    if(!this.props.subscriptionId || !(this.props.isPro || this.props.isProPlus)){
      axios.get(`/api/v1/checkout_session?price_id=${PRICE_ID}`)
        .then(res => {
          if (res.data.success) {
            return (stripePromise.then((stripe) => {
                stripe.redirectToCheckout({
                  sessionId: res.data.session_id
                }).then((response) => {
                }).catch(error => {
                  this.setState({error_message: error})
                });
              })
            )
          } else {
            this.setState({error_message: 'Something went wrong!'})
          }
        }
      )
    }
    else{
      axios.get(`/api/v1/change_membership?plan_id=${PRICE_ID}`).then(res=>{ console.log(res)
      })
      this.onHandleCloseModal();
      this.props.onOpenNotify();
    }
  };

  render() {
    const {error_message, close, plan, pro_monthly, proplus_monthly, pro_yearly, proplus_yearly} = this.state;
    const {isPro, isProPlus, subscriptionId} = this.props;

    return (
      <div className={css.modalBLock} style={{width: "65%"}} >
        { !pro_monthly &&  
          <div className={css.loaderBox}>
            <Icon/>
          </div>
        }
        <div className={css.cardBlock}>
          <div className={css.cardHeader}>
            <Heading size='h2'>
              Vegeterians PRICING
            </Heading>
            <Button
              backgroundColor='none'
              className={_s.mlAuto}
              onClick={this.onHandleCloseModal}
              color='secondary'
              icon='close'
              iconSize='15px'
            />
          </div>
          <div className={css.cardHeaderToggle}>
          <span className={css.cardHeading}>Monthly</span><input className={css.toggle} type="checkbox" onChange={this.toggle}/><span className={css.cardHeading}>Yearly</span>
          </div>
           <p>{error_message}</p> 
          <div className={css.pricingModal}>
          <div className={css.pricingBox}>
              <div className={css.pricingBoxHeader}>
                <h2 className={css.HeaderLabel}>Vegeterians PRO</h2>
                <h4 className={css.PriceValue}>
                  <small>$</small>
                  {plan == 'monthly' ? pro_monthly : pro_yearly}
                  <span className={css.PriceUnit}>/{plan}</span>
                </h4>
              </div>
              <p className={css.cardHeading}>Become a power user and unlock cool new features!</p>
              <div className={css.contentListBox}>
                <ul className={css.contentList}>
                  <li>Ambassador Rewards</li>
                  <li>Curated Expert Content</li>
                  <li className={css.selectContent}>Create your own Groups</li>
                  <li>500MB per video upload</li>
                  <li>Schedule Posts</li>
                  <li>Rich text post editor</li>
                  <li>Verified status badge</li>
                  <li>Hide Promoted Posts</li>
                  <li>Pro User Badge</li>
                  <li>Bookmark Posts</li>
                  <li>Timed Extinguishing Posts</li>
                  <li className={css.disabledContent}>Top of Who to Followd</li>
                  <li className={css.disabledContent}>Groups are Featured</li>
                  <li className={css.disabledContent}>2 Included Post Boosts</li>
                  <li className={css.disabledContent}>Phone Support</li>
                </ul>
                <button
                 id = {plan == 'monthly' ? process.env.MONTHLY_PRO_PLAN_ID : process.env.YEARLY_PRO_PLAN_ID}
                 className={css.buttonCard}
                 onClick={this.Cardpayment}
                 disabled = {isPro ? true : false}
                  >${plan == 'monthly' ? pro_monthly : pro_yearly}/{plan}</button>
              </div>
            </div> 
           <div className={css.pricingBox}>
            <div className={css.pricingBoxHeader}>
              <h2 className={css.HeaderLabel}>Vegeterians ProPlus</h2>
              <h4 className={css.PriceValue}>
                <small>$</small>
                 {plan == 'monthly' ? proplus_monthly : proplus_yearly}
                <span className={css.PriceUnit}>/{plan}</span>
              </h4>
             </div>
              <p className={css.cardHeading}>Expand your audience and influence!!</p>
              <div className={css.contentListBox}>
                <ul className={css.contentList}>
                <li>Ambassador Rewards</li>
                <li>Curated Expert Content</li>
                <li>Create your own Groups</li>
                <li className={css.selectContent}> 5GB per video upload</li>
                <li>Schedule Posts</li>
                <li>Rich text post editor</li>
                <li>Verified status badge</li>
                <li>Hide Promoted Posts</li>
                <li>Pro User Badge</li>
                <li>Bookmark Posts</li>
                <li>Timed Extinguishing Posts</li>
                <li>Top of Who to Follow</li>
                <li>Groups are Featured</li>
                <li>2 Included Post Boosts</li>
                <li>Phone Support</li>
              </ul>
              <button
               id = {plan == 'monthly' ? process.env.MONTHLY_PRO_PLUS_PLAN_ID : process.env.YEARLY_PRO_PLUS_PLAN_ID}
               className={css.buttonCard}
               disabled = {isProPlus ? true : false}
               onClick={this.Cardpayment}>${plan == 'monthly' ? proplus_monthly : proplus_yearly}/{plan}</button>
            </div>
            </div>
          </div>
        </div>  
      </div>
    )   
    
  }

}