import {connect} from 'react-redux'
import DeviceEditor from '../ui/DeviceEditor'
import {save, changeCardAnswer, changeCardTitle, changeDialogueTitle} from '../../actions'
import {addNewDialogueToDevice, deleteDialogueFromDevice, changeDialoguesOrder, setDeviceToRefresh} from '../../actions'

const mapStateToProps = (state, props) => {
	const device = state.devices[parseInt(props.params.device)];
	// console.log(device)
	let dialogues = [];
	if(device.dialogues && Object.keys(device.dialogues).length){
		for(let id in device.dialogues) {
			let dialogue = state.dialogues[id];
			dialogue.order = device.dialogues[id].order;
			dialogues.push(dialogue);
		}
		dialogues.sort((a,b)=> {return a.order - b.order});
	}
	return  {
		allDialogues:  state.dialogues,
		allCards: state.cards,
		dialogues,
		device
	}

}


const mapDispatchToProps = (dispatch, props) => {

	return {
		
		onAddNewDialogue(newDialogueTitle) {
			dispatch(addNewDialogueToDevice(props.params.device, newDialogueTitle))
		},

		onDeleteDialogueFromDevice(dialogueId) {
			dispatch(deleteDialogueFromDevice(props.params.device, dialogueId))
		},

		onChangeDialogues(dialogues) {
			dispatch(changeDialoguesOrder(dialogues, props.params.device));
		},

		onRefreshDevice() {
			dispatch(setDeviceToRefresh(props.params.device));
		}


	}

}



export default connect(mapStateToProps, mapDispatchToProps)(DeviceEditor)
