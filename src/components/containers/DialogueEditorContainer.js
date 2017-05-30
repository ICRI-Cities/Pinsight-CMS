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
	let cards = Object.keys(dialogue.cards).map(key => {
		return dialogue.cards[key];
	});
	cards.sort((a,b)=> {return a.order - b.order})
	cards = cards.map((card)=> {
		return state.cards[card.id]
	})


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
	let cardIndex = props.params.card;
	let dialogueId = props.params.dialogue;

	return {
		onChangeDialogueTitle(value) {
			dispatch(changeDialogueTitle(dialogueId, cardIndex, value));
		},

	
		onChangedCard({ cardIndex, title, answers, isImage, imageFilename, imageURL }) {
			dispatch(changeCard(cardIndex, title, answers,  isImage, imageFilename, imageURL));
		},

		onAddCard({order}) {
			dispatch(addNewCard(deviceId, dialogueId, order));
		},

		onDeleteCard({ cardId, order }) {
			var confirmDialogue = confirm("If you delete this card, you will not be able to get it back. Delete this card?");
			if (confirmDialogue == true) {
				dispatch(deleteCard(dialogueId, cardId, order));
			} else {
				// Do nothing
			} 			
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	DialogueEditorDirect
	);
