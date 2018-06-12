import { Component } from 'react'
import {List, ListItem} from 'material-ui/List';
import {Link} from 'react-router'
import AppBar from 'material-ui/AppBar'

import NewDialogue from './NewDialogue'
import NewDialoguePrompt from './NewDialoguePrompt';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import GraphIcon from 'material-ui/svg-icons/editor/linear-scale';
import DownloadIcon from 'material-ui/svg-icons/action/get-app';
import EyeIcon from 'material-ui/svg-icons/image/remove-red-eye';
import IconButton from 'material-ui/IconButton';
import DataIcon from "material-ui/svg-icons/av/equalizer";


class DialogueList extends Component {


	constructor(props) {
		super(props);
	}



	onDownloadData(dialogue) {
		var o = {};
		o.dialogue = dialogue;
		o.cards = {};
		for(var i in dialogue.cards) {
			o.cards[i] = this.props.cards[i]
		}
		
		var uriContent = "data:application/octet-stream," + encodeURIComponent(JSON.stringify(o));
		window.open(uriContent, 'export');
	}

	render() {
		
		let i = 0;
		let list = [];
		let dialogues = Object.keys(this.props.dialogues).map((key, i) => {
			
			let dialogue = this.props.dialogues[key];
			
			return (
				<li className="ListItem" key={i} >
					<Link activeClassName="active" to={"/dialogues/"+dialogue.id}>
						{dialogue.title + " ("+Object.keys(dialogue.cards).length+" cards)"}
					</Link>
					<IconButton tooltip ="responses"><Link to={`/dialogues/${dialogue.id}/viz`} > <DataIcon/></Link></IconButton>
					<IconButton tooltip ="structure"><Link  to={"/dialogues/"+dialogue.id+"/structure"}><GraphIcon/></Link></IconButton>
					<IconButton tooltip ="download dialogue" onTouchTap={(e)=>this.onDownloadData(dialogue)}><DownloadIcon/> </IconButton>
					<IconButton tooltip ="delete" onTouchTap={(e)=>this.props.onDeleteDialogue(dialogue)}><DeleteIcon/> </IconButton>
				</li>
				)
		});


		return (
			<div style={{margin:"0 5%"}} >
				<ul className="List">
				{
					dialogues
				}
				</ul>
				<NewDialoguePrompt {...this.props} />
			</div>

			)
	}
}

export default DialogueList