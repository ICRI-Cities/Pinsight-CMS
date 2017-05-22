import {connect} from 'react-redux'
import Home from '../ui/Home'
import {deleteDialogue, addCard, addDialogue, changeDevicePosition} from '../../actions'



const mapStateToProps = (state, props) => {

	return  { 
		allDialogues: state.dialogues,
		allCards: state.cards,
		devices: state.devices,
	}
}


const mapDispatchToProps = (dispatch, props, test) => {

	return {

		onDeleteDialogue(dialogueId) {
			dispatch(deleteDialogue(dialogueId));
		},

		onChangeDevicePosition(deviceIndex, lat, lng) {
			dispatch(changeDevicePosition(deviceIndex, lat, lng));
		}

	}

}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
