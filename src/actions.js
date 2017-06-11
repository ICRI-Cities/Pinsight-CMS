import {hashHistory} from 'react-router'
import C from './constants'
import * as firebase from 'firebase'



export const getData = () => {
	return (dispatch) => {

		if(window.DEBUG && localStorage["redux-store"]) {
			dispatch({
				type: C.GET_DATA,
				value: JSON.parse(localStorage["redux-store"])
			});
			dispatch(hasLoaded(true));

		} else {

			dispatch(hasLoaded(false));
			window.database
			.ref('/')
			.once('value')
			.then((snapshot) => {
				localStorage.setItem('redux-store', JSON.stringify(snapshot.val()));
				dispatch({
					type: C.GET_DATA,
					value: snapshot.val()
				});
				dispatch(isUpdating(false));
				dispatch(hasLoaded(true));
			});




		}

	}
}

export const getResponses = (dialogueId) => {
	
	return (dispatch) => {

		dispatch(isUpdating(true));
		

		window.database
		.ref('responses')
		.orderByChild("dialogueId").equalTo(dialogueId).once("value").then((snapshot) => {
			dispatch({
				type: C.GET_RESPONSES,
				dialogueId,
				value: snapshot.val() || {}
			});
			console.log(snapshot.val())
			dispatch(isUpdating(false));
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

		
		// create and add new dialogue with a new empty card
		const newCardRef =  window.database.ref('/cards/').push();
		const newDialogueRef = window.database.ref('/dialogues/').push();

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

		// move up the order of existing dialogues
		const deviceDialogues = getState().devices[deviceIndex].dialogues;
		let orderedDialouges = {};
		for(var i in  deviceDialogues) {
			orderedDialouges[i] = {order:deviceDialogues[i].order+1};
			updates['devices/'+deviceIndex+'/dialogues/'+i] =  {order:deviceDialogues[i].order+1};
		}


		dispatch(isUpdating(true));	
		window.database.ref().update(updates).then(()=>{
			// dispatch(hasUpdated());	
			dispatch(isUpdating(false));


			dispatch(isUpdating(false));
			dispatch({
				type: C.CHANGE_DEVICE_DIALOGUES,
				deviceIndex,
				dialogues : deviceDialogues
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

		});

		

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
		
		let orderedDialouges = {};

		for(let i in dialogues) {
			orderedDialouges[i] = {order: dialogues[i].order}
		}

		window.database
		.ref('devices/'+deviceIndex+'/dialogues')
		.set(orderedDialouges)

		dispatch(()=> {
			// dispatch(hasUpdated());	
			dispatch(isUpdating(false));
			dispatch({
				type: C.CHANGE_DEVICE_DIALOGUES,
				deviceIndex,
				dialogues : orderedDialouges
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


export const renameDialogue = (dialogue, title) => {
	return (dispatch) => {

		dispatch(isUpdating(true));
		window.database.ref("dialogues/"+dialogue.id+"/title").set(title).then(()=> {
			dispatch(isUpdating(false));
			dispatch({
				type: C.CHANGE_DIALOGUE_TITLE,
				dialogue,
				title
			});	
		});

	};

}


export const deleteDialogue = (dialogue) => {
	return (dispatch) => {

		console.log(dialogue)
		dispatch(isUpdating(true));
		let updates = {};

		dispatch({
			type: C.DELETE_DIALOGUE,
			dialogue
		});	

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

			window.database.ref().update(updates);


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
			id: newCardRef.key,
			createdAt: firebase.database.ServerValue.TIMESTAMP,
			title:"",
			answers: [
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

				
				dispatch(isUpdating(false));

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


		dispatch({
			type: C.DELETE_CARD,
			dialogueId,
			order,
			cardId
		})

		dispatch(isUpdating(true))

		let updates = {};

		// delete links
		window.database.ref("cards").once("value", (s) => {

			let cards = s.val();


			for(let c in cards) {

				let card = cards[c];

				if(card.id == cardId) {
					updates["cards/"+card.id] = null
				}

				if(card.answers[0].link == cardId) updates["cards/"+card.id + "/answers/0/link"] = -1;
				if(card.answers[1].link == cardId) updates["cards/"+card.id + "/answers/1/link"] = -1;

			}

			// remove card reference in dialogue's cards list
			updates["/dialogues/"+dialogueId+"/cards/"+cardId] = null;
			window.database.ref().update(updates);

			// change order of other cards
			window.database.ref("/dialogues/"+dialogueId).once("value", (value) => {


				var cards = value.val().cards;
				delete cards[cardId];

				for (var key in cards) {
					if(cards[key].order > order) cards[key].order-=1;
				}

				// update the dialogue cards
				window.database.ref("/dialogues/"+dialogueId+"/cards").set(cards);

				// all done
				dispatch(isUpdating(false));

			});

		});


	}

}


export const changeCard = (cardIndex, title, answers, isImage, imageFilename, imageURL) => {

	return (dispatch) => {


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

		// delay updates to the database

		if(changeCardTimeout) clearInterval(changeCardTimeout);
		if(new Date() - lastChanged < 1000) {
			changeCardTimeout = setTimeout(()=>{
				changeCardOnDB(dispatch, cardIndex,title,isImage,imageFilename,imageURL,answers) 
			}, 1000);
		} else {
			changeCardOnDB(dispatch, cardIndex,title,isImage,imageFilename,imageURL,answers) 
		}

	}

}

let changeCardTimeout;
let lastChanged;

const changeCardOnDB = (dispatch, cardIndex,title,isImage,imageFilename,imageURL,answers)=> {

	dispatch(isUpdating(true))
	
	lastChanged = new Date();
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