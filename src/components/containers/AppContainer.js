import {connect} from 'react-redux'
import App from '../ui/App'
import { changeAppTitle} from '../../actions'



const mapStateToProps = (state, props) => {

	let title = "Pinsight";
	let icon = false;

	if(!state.hasLoaded) return {hasLoaded: state.hasLoaded};

	if(props.params.device && props.params.dialogue == null) {
		const device = state.devices[parseInt(props.params.device)];
		title = state.devices[props.params.device].name;
		icon = true;
	} else if(props.params.dialogue != null) {
		const dialogue = state.dialogues[props.params.dialogue];
		title = dialogue.title;
		icon = true;
	}


	return  { 
		isUpdating: state.isUpdating,
		hasLoaded: state.hasLoaded,
		hasUpdated: state.hasUpdated,
		allDevices: state.devices,
		props,
		icon,
		title
	}

}

export default connect(mapStateToProps)(App)