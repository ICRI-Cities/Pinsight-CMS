import C from '../constants'
import { combineReducers } from 'redux'
import update from 'immutability-helper';


export const isUpdating = (state=null,action) => {

	if(action.type === C.ISUPDATING) {
		return action.value;
	} else {
		return state;
	}
}

export const hasUpdated = (state=null,action) => {
	if(action.type === C.HASUPDATED) {
		return action.value;
	} else {
		return state;
	}
}

export const hasLoaded = (state=null,action) => {
	if(action.type === C.HASLOADED && action.value != null) {
		return  action.value;
	} else {
		return state;
	}
}



export const devices = (state=null,action) => {
	
	switch(action.type) {
		
		case C.ADD_DIALOGUE_DEVICE:
		let newState;
		// if there were no dialogues
		if(!state[action.deviceIndex].dialogues) {
			newState = update(state, {[action.deviceIndex]: {"dialogues": {$set: {}}}});
		}
		newState= update(state, {[action.deviceIndex]: {"dialogues": {[action.dialogue.id]: {$set:action.dialogue}}}});
		return newState;

		case C.REMOVE_DIALOGUE_DEVICE:
		let newDialogues = {...state[action.deviceIndex].dialogues}
		delete newDialogues[action.dialogueId];
		return update(state, {[action.deviceIndex]: {"dialogues": {$set:newDialogues}}});


		case C.GET_DATA:
		return update(state, {$set: action.value.devices});

		case C.CHANGE_DEVICE_DIALOGUES:
		return update(state, {[action.deviceIndex]: {"dialogues": {$set:action.dialogues}}});

		case C.CHANGE_DEVICE_POSITION:
		console.log("old state",state[action.deviceIndex].position)
		let newPosition = {
			lat: action.lat,
			lng: action.lng
		};
		newState = update(state, {[action.deviceIndex]: {"position": {$set: newPosition}}});
		console.log("new state", newState[action.deviceIndex].position)
		return newState;

		default:
		return state;
	}

}

export const dialogues = (state=null,action) => {

	let newCardId = action.newCardId;
	let newState;
	switch(action.type) {

		case C.GET_DATA:
		return update(state, {$set: action.value.dialogues});

		case C.NEEDS_UPDATE:
		return update(state, {[action.dialogueId]: {"needsUpdate": {$set: action.needsUpdate}}});

		case C.ADD_DIALOGUE:		
		newState = update(state, { [action.dialogue.id]: { $set: action.dialogue } });
		return newState;

		case C.CHANGE_DIALOGUE:		
		newState = update(state, { [action.dialogue.id]: { cards: { $set: action.dialogue.cards }} });
		return newState;

		case C.CHANGE_DIALOGUE_TITLE:
		newState = update(state, { [action.dialogue.id]: { title: { $set: action.title }} });
		return newState;

		case C.DELETE_CARD:
		let next = Object.assign({}, state);
		delete next[action.dialogueId].cards[action.cardId];
		return next;

		return newState;
		
	}
	return state;
}

export const cards = (state=null,action) => {

	let cardIndex = action.cardIndex;
	let newState;
	switch(action.type) {

		case C.GET_DATA:
		return update(state, {$set: action.value.cards});

		case C.CHANGE_CARD:
		newState = update(state, {[cardIndex]: {$set: {
			id: action.cardIndex,
			title: action.title,
			answers: action.answers,
			isImage: action.isImage,
			imageURL: action.imageURL
		}}});		
		return newState;

		case C.ADD_CARD:
		return update(state, { [action.newCard.id]: {$set: action.newCard} });

		case C.DELETE_CARD:
		// delete card
		let next = Object.assign({}, state);
		delete next[action.cardId];

		// set links to deleted card to -1
		for(var i in next) {
			if(next[i].answers[0].link == action.cardId) next[i].answers[0].link = -1;
			if(next[i].answers[1].link == action.cardId) next[i].answers[1].link = -1;
		}

		return next;

		default:
		return state;
	}

}

export default combineReducers({
	isUpdating, hasUpdated, hasLoaded, devices, dialogues, cards
})
