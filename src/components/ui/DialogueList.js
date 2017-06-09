import { Component } from 'react'
import {List, ListItem} from 'material-ui/List';
import {Link} from 'react-router'
import AppBar from 'material-ui/AppBar'

import NewDialogue from './NewDialogue'
import NewDialoguePrompt from './NewDialoguePrompt';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import EyeIcon from 'material-ui/svg-icons/image/remove-red-eye';
import IconButton from 'material-ui/IconButton';


class DialogueList extends Component {


	constructor(props) {
		super(props);
	}


	getDialogueFirstCard(dialogue) {

		const dialogueCards = Object.keys(dialogue.cards).map( (cardId) => { return cardId })
		return dialogueCards[0];
	}


	render() {
		
		let i = 0;
		let list = [];
		let dialogues = Object.keys(this.props.dialogues).map((key, i) => {
			
			let dialogue = this.props.dialogues[key];
			
			return (
				<li className="ListItem" key={i} >
					<Link activeClassName="active" to={"/dialogues/"+dialogue.id+"/"+this.getDialogueFirstCard(dialogue)}>
						{dialogue.title}
					</Link>
					<IconButton onTouchTap={(e)=>this.props.onDeleteDialogue(dialogue)}><DeleteIcon/> </IconButton>
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