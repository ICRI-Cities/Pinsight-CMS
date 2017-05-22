import {hashHistory} from 'react-router'
import C from './constants'
import * as firebase from 'firebase'

export const getData = () => {
	return (dispatch) => {
		dispatch(hasLoaded(false));
		window.database
		.ref('/')
		.once('value')
		.then((snapshot) => {
			dispatch({
				type: C.GET_DATA,
				value: snapshot.val()
			});
			dispatch(isUpdating(false));
			dispatch(hasLoaded(true));
		});	

	}
}


export const isUpdating = (value) => {
	return {
		type: C.ISUPDATING,
		value: value
	}
}

export const hasUpdated = (time) => {
	return {
		type: C.HASUPDATED,
		value: time
	}
}


export const hasLoaded = (loaded) => {
	return {
		type: C.HASLOADED,
		value: loaded
	}
}

export const changeAppTitle = (text) => {
	return {
		type: C.HASLOADED,
		value: text
	}
}

// DEVICES

export const setDeviceToRefresh = (deviceIndex) => {
	
	return (dispatch, getState) => {
		dispatch(isUpdating(true))
		
		let updates = {};
		updates['devices/'+deviceIndex+'/lastUpdated'] = firebase.database.ServerValue.TIMESTAMP;

		window.database.ref().update(updates).then((d)=>{
			dispatch(isUpdating(false))
			dispatch(hasUpdated(new Date()));	
		});

	}

}

export const addNewDialogueToDevice = (deviceIndex, title) => {

	return (dispatch, getState) => {
		var deviceDialogues = getState().devices[deviceIndex].dialogues;
		
		var deviceDialogues = getState().devices[deviceIndex].dialogues;
		for(var i in deviceDialogues) {
			deviceDialogues[i].order+=1;
		}
		
		changeDialoguesOrder(deviceDialogues, deviceIndex);

		// create new key and dialogues
		var newCardRef =  window.database.ref('/cards/').push();
		var newDialogueRef = window.database.ref('/dialogues/').push();

		let newCard = {
			id: newCardRef.key,
			title: "",
			answers: [
			{
				label: "",
				link: -1,
			},
			{
				label: "",
				link: -1,
			}
			]
		};

		let newDialogue = {
			id: newDialogueRef.key,
			cards: {
				[newCardRef.key]: {
					id: newCardRef.key,
					order:0
				}
			},
			title: title
		};



		let updates = {};
		updates['cards/'+newCard.id] = newCard;
		updates['dialogues/'+newDialogue.id] = newDialogue;
		updates['devices/'+deviceIndex+'/dialogues/'+newDialogue.id] = {
			order: 0
		}

		dispatch(isUpdating(true));	
		window.database.ref().update(updates).then(()=>{
			// dispatch(hasUpdated());	
			dispatch(isUpdating(false));	
		});

		dispatch({
			type: C.ADD_CARD,
			newCard
		})

		dispatch({
			type: C.ADD_DIALOGUE,
			dialogue: newDialogue
		})

		dispatch({
			type: C.ADD_DIALOGUE_DEVICE,
			deviceIndex, 
			dialogue: {
				id: newDialogueRef.key,
				order: 0
			}
		})

	}
}

export const deleteDialogueFromDevice = (deviceIndex, dialogueId) => {
	return (dispatch) => {

		dispatch(isUpdating(true));
		window.database.ref('/devices/'+deviceIndex+'/dialogues/'+dialogueId).set(null).then(()=>{
			// dispatch(hasUpdated());	
			dispatch(isUpdating(false));
			dispatch({
				type: C.REMOVE_DIALOGUE_DEVICE,
				deviceIndex,
				dialogueId
			})
		});
	}
}


export const changeDialoguesOrder = (dialogues, deviceIndex) => {

	return (dispatch) => {
		
		dispatch(isUpdating(true));
		
		window.database
		.ref('devices/'+deviceIndex+'/dialogues')
		.set(dialogues)

		dispatch(()=> {
			// dispatch(hasUpdated());	
			dispatch(isUpdating(false));
			dispatch({
				type: C.CHANGE_DEVICE_DIALOGUES,
				deviceIndex,
				dialogues
			});
		})

	}
}

export const changeDevicePosition = (deviceIndex, lat, lng) => {

	return (dispatch) => {
		
		dispatch(isUpdating(true));

		let updates = {};

		updates['devices/'+deviceIndex+'/position/lng'] = lng;
		updates['devices/'+deviceIndex+'/position/lat'] = lat;
		

		window.database.ref().update(updates).then(() => {
			dispatch(isUpdating(false));


			dispatch({
				type: C.CHANGE_DEVICE_POSITION,
				deviceIndex,
				lat,
				lng
			});

		});


	}

}


// DIALOGUES

export const saveDialogue = (dialogue) => {

	return (dispatch, getState) => {
		
		dispatch(isUpdating(true));

		const cards = getState().cards;
		let updates = {};

		updates['/dialogues/'+dialogue.id] = dialogue;
		
		Object.keys(dialogue.cards).map((l)=> {	
			updates['/cards/'+l] = cards[l];
		});

		window.database.ref().update(updates).then(() => {
			dispatch(isUpdating(false));
		})
	}
}

export const deleteDialogue = (dialogue) => {
	return (dispatch) => {

		dispatch(isUpdating(true));
		let updates = {};

		// delete reference of this dialogue in devices
		window.database
		.ref('devices')
		.once('value')
		.then((snapshot) => {
			let devices = snapshot.val();
			devices.forEach((d, i) => {
				updates['/devices/'+ i +'/dialogues/'+dialogue.id] = null;
			});
			// delete cards
			let cardsToDelete = Object.keys(dialogue.cards);
			cardsToDelete.forEach((cardIndex)=>{
				updates['/cards/'+cardIndex] = null;
			});
			// finally delete dialogue
			updates['/dialogues/'+dialogue.id] = null;

			window.database.ref().update(updates).then(()=> {
				dispatch(hasLoaded(false));
				
				// re update the whole app
				// TODO this should only refresh dialogues

				window.database
				.ref('/')
				.once('value')
				.then((snapshot) => {
					dispatch({
						type: C.GET_DATA,
						value: snapshot.val()
					})
					// dispatch(hasUpdated());	
					dispatch(isUpdating(false));
					dispatch(hasLoaded(true));
				});

			});


		});	
	}
}

export const addDialogue = (title) => {
	
	return (dispatch) => {

		dispatch(isUpdating(true));
		
		var newCardRef =  window.database.ref('/cards/').push();
		var newDialogueRef = window.database.ref('/dialogues/').push();

		let newCard = {
			id: newCardRef.key,
			title: "",
			answers: [
			{
				label: "",
				link: -1,
			},
			{
				label: "",
				link: -1,
			}
			]
		};

		let newDialogue = {
			id: newDialogueRef.key,
			cards: {
				[newCardRef.key]:{
					id: newCardRef.key,
					order:0
				}
			},
			title
		};

		newCardRef.set(newCard);

		newDialogueRef.set(newDialogue).then(()=>{
			dispatch(isUpdating(false));

			dispatch({
				type: C.ADD_CARD,
				newCard
			});

			dispatch({
				type: C.ADD_DIALOGUE,
				dialogue: newDialogue
			});
		});

	}
}


// CARDS

// deviceId: the device containing the dialogue (used for linking to new card)
// dialogueId: the dialogue the new card should be added in
// order: the index of the new card 

export const addNewCard = (deviceId, dialogueId, order) => {

	return (dispatch) => {

		dispatch(isUpdating(true));
		let updates = {};
		// get new card key
		let newCardRef =  window.database.ref('/cards/').push();
		let newCard = {
			"id": newCardRef.key,
			"title":"",
			"answers": [
			{
				"label":"",
				"link":-1
			},
			{
				"label":"",
				"link":-1
			}]
		};


		// add the card first 
		newCardRef.set(newCard).then((d) => {
			
			// change order of other cards
			window.database.ref("/dialogues/"+dialogueId).once("value", (value) => {

				var cards = value.val().cards;

				for (var key in cards) {
					if(cards[key].order >= order + 1) cards[key].order+=1;
				}
				cards[newCardRef.key] = {
					id: newCardRef.key,
					order: order + 1
				}

				// update the dialogue cards
				window.database.ref("/dialogues/"+dialogueId+"/cards").set(cards);

				// all done
				dispatch({
					type: C.ADD_CARD,
					newCard
				})

				dispatch({
					type: C.CHANGE_DIALOGUE,
					dialogue: {
						id: dialogueId,
						cards: cards
					}
				})

				
			});
		})

	}
}




export const deleteCard = (dialogueId, cardId, order) => {

	return (dispatch) => {

		dispatch(isUpdating(true))

		let updates = {};

		// delete links
		window.database.ref("cards").once("value", (s) => {

			let cards = s.val();

			for(let c in cards) {

				let card = cards[c];

				if(card.order > order) {
					updates["cards/"+card.id + "/order"] = card.order -1;
				}
				if(card.id == cardId) {
					updates["cards/"+card.id] = null
				}

				if(card.answers[0].link == cardId) updates["cards/"+card.id + "/answers/0/link"] = -1;
				if(card.answers[1].link == cardId) updates["cards/"+card.id + "/answers/1/link"] = -1;

			}


			window.database.ref().update(updates)


			// change order of other cards
			window.database.ref("/dialogues/"+dialogueId).once("value", (value) => {

				window.database.ref("/dialogues/"+dialogueId+"/cards/"+cardId).set(null);

				var cards = value.val().cards;
				delete cards[cardId];

				for (var key in cards) {
					if(cards[key].order > order) cards[key].order-=1;
				}

				// update the dialogue cards
				window.database.ref("/dialogues/"+dialogueId+"/cards").set(cards);

				// all done
				dispatch(isUpdating(false));
				dispatch({
					type: C.CHANGE_DIALOGUE,
					dialogue: {
						id: dialogueId,
						cards: cards
					}
				})

				dispatch({
					type: C.DELETE_CARD,
					dialogueId,
					cardId
				})


			});

		});


	}

}


export const changeCard = (cardIndex, title, answers, isImage, imageFilename, imageURL) => {
	console.log(imageFilename, imageURL);
	return (dispatch) => {

		dispatch(isUpdating(true))

		if(imageURL == null) imageURL= "";
		if(imageFilename == null) imageFilename= "";
		if(isImage == null) isImage = false;

		dispatch({
			type: C.CHANGE_CARD,
			cardIndex,
			isImage,
			imageFilename,
			imageURL,
			title,
			answers
		})

		const updates = {
			cardIndex,
			title,
			isImage,
			imageFilename,
			imageURL,
			answers
		}

		window.database.ref('/cards/'+cardIndex).update(updates).then(()=>dispatch(isUpdating(false)));

	}

}
