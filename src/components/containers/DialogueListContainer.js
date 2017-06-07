import { connect } from "react-redux";
import DialogueList from "../ui/DialogueList";

const mapStateToProps = (state, props) => {

	if (!state.hasLoaded) return;

	return {
		dialogues: state.dialogues
	};
};

const mapDispatchToProps = (dispatch, props) => {


	return {
		

	};
};

export default connect(mapStateToProps, mapDispatchToProps)(
	DialogueList
	);
