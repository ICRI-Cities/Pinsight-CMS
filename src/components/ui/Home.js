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

export default Home