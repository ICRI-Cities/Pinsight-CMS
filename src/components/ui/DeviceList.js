import { Component } from 'react'
import {List, ListItem} from 'material-ui/List';
import {Link} from 'react-router'
import PreviewIcon from 'material-ui/svg-icons/av/play-circle-filled'
import IconButton from 'material-ui/IconButton';
import DialoguePreview from './DialoguePreview'
import PinIcon from 'material-ui/svg-icons/communication/location-on'


class DeviceList extends Component {	
	
	constructor(props) {
		super(props);
		this.state = {
			previewPromptOpen:false
		}
	}

	onPreviewDialogue(device) {
		
		let dialogues = Object.keys(device.dialogues).map((d)=>{
			return this.props.allDialogues[d];
		});

		console.log(dialogues)
		this.setState({
			previewPromptOpen: true,
			previewedDialogues: dialogues
		})
	}


	onClosePreview() {
		this.setState({
			previewPromptOpen: false,
			previewedDialogues: null
		})
	}

	



	render() {
		return(
			<div>
			<ul className="List">
			{
				this.props.devices.map((device,i)=>
					<li key={i}  className="ListItem">
					<Link activeClassName="active" to={"/devices/"+device.id}>
					 <p> <PinIcon color={device.color} />{device.name}</p>
					</Link>
					</li>
					)
			}
			</ul>
			<DialoguePreview open={this.state.previewPromptOpen} allCards={this.props.allCards} dialogues={this.state.previewedDialogues} onClosePreview={this.onClosePreview.bind(this)} />
			</div>
			)
	}

}
export default DeviceList