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
			left: props.mystyle.left ? props.mystyle.left : "auto",
			right: props.mystyle.right ? props.mystyle.right : "auto",
			background: lightBlue500
		}
	
		return ( <div className="LinkHandle" style={style}  onTouchTap={props.onTouchTap} > <LinkIcon color="#fff"/> </div>	);
	}

}

export default LinkHandle;