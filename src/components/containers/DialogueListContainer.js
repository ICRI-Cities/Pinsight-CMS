import { connect } from "react-redux";
import DialogueList from "../ui/DialogueList";
import {deleteDialogue} from "../../actions"

const mapStateToProps = (state, props) => {

	if (!state.hasLoaded) return;

	return {
		dialogues: state.dialogues,
		cards: state.cards
	};
};

const mapDispatchToProps = (dispatch, props) => {


	return {
		
		onDeleteDialogue(dialogue ) {
			var confirmDialogue = confirm("If you delete this dialogue, you will not be able to get it back. Delete this dialogue?");
			if (confirmDialogue == true) {
				dispatch(deleteDialogue(dialogue));
			}
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	DialogueList
	);
