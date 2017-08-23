import { connect } from "react-redux";
import StructureViz from "../ui/StructureViz";




const mapStateToProps = (state, props) => {

	if (!state.hasLoaded) return;
	
	const dialogue = state.dialogues[props.params.dialogue];
	let cards = Object.keys(dialogue.cards).map(key => {
		return state.cards[key];
	});
	return {
		dialogue,
		cards
	};
};


export default connect(mapStateToProps)(
	StructureViz
	);
