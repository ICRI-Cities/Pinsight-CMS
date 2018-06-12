import {Component} from "react";
import LinkIcon from "material-ui/svg-icons/content/link";
import { lightBlue500 } from "material-ui/styles/colors";
import PlusIcon from "material-ui/svg-icons/content/add-circle";


class LinkHandle extends Component {
	
	constructor(props) {
		super(props);
	}

	render() {

		let props = this.props;

		let style = {
			transform: "translate("+ (props.isFirst ? "-120%" : "120%") + ",0)",
			right: props.isFirst ? "auto" :0
		}

		let style2={width:"1.5rem", height:"1.5rem"}

		let style3 = {
			position:"absolute", 
			transform: "translate("+ (props.isFirst ? "-500%" : "500%") + ",0)",
			right: props.isFirst ? "auto" :0
		}

		return (
			<div>
			<div className="LinkHandle" style={style} >
			<div style={{...style2, background: props.isLinking? lightBlue500 : "#B0BEC5"}} className="LinkIcon icon" onTouchTap={props.onAddLink} > <LinkIcon color="#fff"/> </div>	
			<div  className="icon"><span style={{color: "#B0BEC5", fontSize: "1.3rem"}}>+</span></div>
			</div>
			</div>);
	}

}

export default LinkHandle;