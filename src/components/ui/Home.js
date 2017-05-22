import DeviceMap from './DeviceMap'
import {Component} from 'react'


class Home extends Component {

	constructor() {
		super();
	}

	render() {

		return (
			<DeviceMap {...this.props}/>
		)
	}
}

// Upon removing Tabs/Tab, the following are no longer in use:
// #AppTabsContainer, .appTabsContentContainer
// {{background:red500}}
// <DialogueList {...this.props}/>

// TODO: remove things we don't need?


export default Home