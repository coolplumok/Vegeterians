import Block from '../../components/block'
import Button from '../../components/button'
import Divider from '../../components/divider'
import Heading from '../../components/heading'
import Text from '../../components/text'

export default class Copyright extends PureComponent {

  render() {

    return (
      <div className={[_s.default].join(' ')}>
        <Block>
          <div className={[_s.default, _s.px15, _s.py15].join(' ')}>
            <Heading>Vegeterians NETWORK INC</Heading>
            <br />
            <Heading>COPYRIGHT POLICY</Heading>
            <br />
            <Heading size='h2'>Reporting Claims of Copyright Infringement</Heading>
            <br />

            <Text tagName='p' className={_s.mt15} size='medium'>We take claims of copyright infringement seriously. We will respond to notices of alleged copyright infringement that comply with applicable law. If you believe any materials accessible on or from this site (the “Website”) infringe your copyright, you may request removal of those materials (or access to them) from the Website by submitting written notification to our copyright agent designated below. In accordance with the&nbsp;
              <Button
                isText
                underlineOnHover
                color='brand'
                backgroundColor='none'
                className={_s.displayInline}
                href='https://www.ic.gc.ca/eic/site/oca-bc.nsf/eng/ca02920.html'
              >
                Canadian Notice and Notice Regime
              </Button>
              &nbsp;that came into effect on January 2, 2015 as part of the&nbsp;
              <Button
                isText
                underlineOnHover
                color='brand'
                backgroundColor='none'
                className={_s.displayInline}
                href='https://www.ic.gc.ca/eic/site/oca-bc.nsf/eng/ca02920.html'
              >
                Copyright Modernization Act of Canada
              </Button>
              &nbsp;the notice must include substantially the following:</Text>

            <ul className={[_s.default, _s.px15, _s.mt15, _s.ml15].join(' ')}>
              <li>
                <Text tagName='p' size='medium'>state the claimant's name and address</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>identify the copyright material that is alleged to have been infringed and the claimant's interest or right with respect to that material</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>specify the location data (e.g. the web address or Internet address associated with the alleged infringement)</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>specify the infringement that is alleged</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>
                  specify the date and time of the alleged infringement
                </Text>
              </li>
            </ul>

            <Text tagName='p' className={_s.mt15} size='medium'>
              <Button
                isText
                underlineOnHover
                color='brand'
                backgroundColor='none'
                className={_s.displayInline}
                href='http://www.ic.gc.ca/eic/site/oca-bc.nsf/eng/ca02920.html#q05'
              >
                http://www.ic.gc.ca/eic/site/oca-bc.nsf/eng/ca02920.html#q05
              </Button>
            </Text>
            <Text tagName='p' className={_s.mt15} size='medium'>The <i>Copyright Act</i> also lists the specific information that must not be included in a notice for it to comply with the Notice and Notice regime:</Text>

            <ul className={[_s.default, _s.px15, _s.mt15, _s.ml15].join(' ')}>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>an offer to settle the claimed infringement</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>a request or demand, made in relation to the claimed infringement, for payment or for personal information</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>a reference, including by way of hyperlink, to such an offer, request or demand</Text>
              </li>
              <li className={_s.mt10}>
                <Text tagName='p' size='medium'>any other information that may be prescribed by regulation</Text>
              </li>
            </ul>

            <Text tagName='p' className={_s.mt15} size='medium'>Please send copyright notices to:</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>
              Vegeterians Network Inc.<br />
              300-1095 McKenzie Ave<br />
              Victoria, British Columbia,<br />
              Canada, V8P 2L5
            </Text>
            <Text tagName='p' className={_s.mt15} size='medium'>Or via any contact form at the bottom of this page.</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>If you fail to comply with all of the requirements above your Notice may not be effective.</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>Please be aware that if you knowingly materially misrepresent that material or activity on the Website is infringing your copyright, you may be held liable for damages (including costs and attorneys’ fees).</Text>

            <br />
            <Heading size='h2'>Counter Notification Procedures</Heading>
            <Text tagName='p' className={_s.mt15} size='medium'>If you believe that material you posted on the Website was removed or access to it was disabled by mistake or misidentification, you may file a counter notification with us (a “Counter Notice”) by submitting written notification to our mailing address above or email.</Text>

            <br />
            <Heading size='h2'>Repeat Infringers</Heading>
            <Text tagName='p' className={[_s.mt15, _s.mb15].join(' ')} size='medium'>It is our policy in appropriate circumstances to disable and/or terminate the accounts of users who are repeat infringers.</Text>

            <br />
            <Divider />

            <Text tagName='p' className={[_s.mt15, _s.mb15].join(' ')} size='medium'>
              <Button
                isText
                underlineOnHover
                color='brand'
                backgroundColor='none'
                className={_s.displayInline}
                href='mailto:copyright@Vegeteriansnetwork.com'
              >
                copyright@Vegeteriansnetwork.com
              </Button>
            </Text>
          </div>
        </Block>
      </div>
    )
  }

}
