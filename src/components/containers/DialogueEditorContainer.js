import { connect } from "react-redux";
import DialogueEditorDirect from "../ui/DialogueEditorDirect";
import {
	deleteCard,
	needsUpdate,
	changeCard,
	addNewCard,
	changeCardAnswer,
	changeCardTitle,
	addImageToCard,
	changeDialogueTitle
} from "../../actions";

const mapStateToProps = (state, props) => {
	if (!state.hasLoaded) return;
	const dialogue = state.dialogues[props.params.dialogue];
	let dialogueCards = Object.keys(dialogue.cards).map(key => {
		return dialogue.cards[key];
	});

	dialogueCards.sort((a,b)=> {return a.order - b.order});
	
	let cards  = dialogueCards.map((card)=> {
		let c = state.cards[card.id];
		c.index = card.order;
		return c;
	});


	const allCards = state.cards;
	const device = state.devices[props.params.device];

	return {
		device,
		dialogue,
		cards,
		allCards
	};
};

const mapDispatchToProps = (dispatch, props) => {

	let deviceId = props.params.device;
	let dialogueId = props.params.dialogue;

	return {
		
		onChangedCard({ cardId, title, answers, isImage, imageFilename, imageURL }) {
			dispatch(changeCard(cardId, title, answers,  isImage, imageFilename, imageURL));
		},

		onAddCard({linkedCard, order, answerIndex}) {
			dispatch(addNewCard(deviceId, dialogueId, linkedCard, order, answerIndex));
		},

		onDeleteCard({ cardId, order }) {
			var confirmDialogue = confirm("If you delete this card, you will not be able to get it back. Delete this card?");
			if (confirmDialogue == true) {
				dispatch(deleteCard(dialogueId, cardId, order));
			}
			
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	DialogueEditorDirect
	);
