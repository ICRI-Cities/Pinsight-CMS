import { connect } from "react-redux";
import ResponseViz from "../ui/ResponseViz";
import {getResponses} from "../../actions";


const mapStateToProps = (state, props) => {

	if (!state.hasLoaded) return;
	
	const dialogue = state.dialogues[props.params.dialogue];
	let cards = Object.keys(dialogue.cards).map(key => {
		return state.cards[key];
	});

	return {
		dialogue,
		cards,
		responses: state.responses
	};
};

const mapDispatchToProps = (dispatch, props) => {

	return {
		getResponsesData() {
			dispatch(getResponses(props.params.dialogue));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	ResponseViz
	);
