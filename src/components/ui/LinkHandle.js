import {Component} from "react";
import LinkIcon from "material-ui/svg-icons/content/link";
import { lightBlue500 } from "material-ui/styles/colors";


class LinkHandle extends Component {
	
	constructor(props) {
		super(props);
	}

	render() {

		let props = this.props;

		let style = {
			transform: "translate("+ (props.isFirst ? "-100%" : "100%") + ", -50%)",
			right: props.isFirst ? "auto" :0,
			background: lightBlue500
		}
	
		return ( <div className="LinkHandle" style={style}  onTouchTap={props.onTouchTap} > <LinkIcon color="#fff"/> </div>	);
	}

}

export default LinkHandle;