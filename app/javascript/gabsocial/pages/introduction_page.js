import PageTitle from '../features/ui/util/page_title'
import IntroductionLayout from '../layouts/introduction_layout'

export default class IntroductionPage extends PureComponent {

  render() {
    const { children } = this.props

    return (
      <IntroductionLayout>
        <PageTitle path='Welcome to Vegeterians.live' />
        {children}
      </IntroductionLayout>
    )
  }

}
