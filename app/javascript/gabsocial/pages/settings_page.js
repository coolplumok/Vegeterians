import SettingsLayout from '../layouts/settings_layout'

export default class SettingsPage extends PureComponent {

	static propTypes = {
    tabs: PropTypes.array,
    title: PropTypes.string,
	}
	
	render() {
		const { children, title, tabs } = this.props;

		return (
			<SettingsLayout
				title={title}
				tabs={tabs}
			>
				{children}
			</SettingsLayout>
		)
	}
}