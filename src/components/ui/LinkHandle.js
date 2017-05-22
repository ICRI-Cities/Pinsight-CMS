import {Component} from "react";
import LinkIcon from "material-ui/svg-icons/content/link";
import { blue500 } from "material-ui/styles/colors";


class LinkHandle extends Component {
	
	constructor(props) {
		super(props);
	}

	render() {


		let props = this.props;

		let style = {
			left: props.linkingAnswerIndex == 0 ? "-0.5rem" : "auto",
			right: props.linkingAnswerIndex == 1 ? "0.5rem" : "auto",
			background: blue500, 
			//(props.card && props.linkingTargetCardId == props.card.id) ? blue500 : "#333"
		}
	
		return ( <div className="LinkHandle" style={style}  onTouchTap={() => props.onLinkHandleClicked(props.card.id)} > <LinkIcon color="#fff"/> </div>	);
	}

}

export default LinkHandle;