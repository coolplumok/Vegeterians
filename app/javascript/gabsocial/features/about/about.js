import Block from '../../components/block'
import Button from '../../components/button'
import Divider from '../../components/divider'
import Heading from '../../components/heading'
import Text from '../../components/text'

export default class About extends PureComponent {

  render() {

    return (
      <div className={[_s.default].join(' ')}>
        <Block>
          <div className={[_s.default, _s.px15, _s.py15, _s.mb10].join(' ')}>
            <Heading>About Vegeterians.live</Heading>

            <Text tagName='p' className={_s.mt15} size='medium'>
              Vegeterians.live is the social network for Vegeterians Network (https://Vegeterians.network), launched to create a safe,
              private, and supportive online environment for the holistic and integrative health community. Holistic
              health practitioners, integrated medical doctors, health coaches, healthy lifestyle influencers and those
              interested in holistic wellness at any level, can share expertise, personal experiences, tips, tools,
              services and products that are becoming absolutely essential in the post-covid environment. We are
              providing a platform for the natural health community and experts that are increasingly being censored.
              and de-platformed by governments, medical establishment and big tech.
            </Text>

            <Text tagName='p' className={_s.mt15} size='medium'>
              We are committed to health freedom and preserving access to life-saving natural health education on
              nutrition, immunity, mind-body and community wellness.
            </Text>
          </div>

          <Divider />

          <div className={[_s.default, _s.px15, _s.py15].join(' ')} id='opensource'>
            <Heading>Open Source</Heading>

            <Text tagName='p' className={_s.mt15} size='medium'>At Vegeterians.live, we believe that the future of online publishing is decentralized and open. We believe that users of social networks should be able to control their social media experience on their own terms, rather than the terms set down by Big Tech. Open source technology allows users (at least those with the interest and inclination to look through the source code to ensure that there isn’t any malicious or nefarious code that might be infecting your computer or revealing your private information.</Text>
            <Text tagName='p' className={_s.mt15} size='medium'>
              Vegeterians.live's codebase is free and open-source, licensed under the GNU Affero General Public License version 3 (AGPL3).&nbsp;
              <Button
                isText
                underlineOnHover
                color='brand'
                backgroundColor='none'
                className={_s.displayInline}
                href='https://gitlab.com/Vegeterians-live/Vegeterians-social'
              >
                https://gitlab.com/Vegeterians-live/Vegeterians-social
              </Button>
            </Text>

            <Text tagName='p' className={_s.mt15} size='medium'>
              For full terms and conditions of use of this site please see&nbsp;
              <Button
                isText
                underlineOnHover
                color='brand'
                backgroundColor='none'
                className={_s.displayInline}
                href='https://Vegeterians.live/about/tos'
              >
                https://Vegeterians.live/about/tos
              </Button>
              .
            </Text>
          </div>
        </Block>
      </div>
    )
  }

}
