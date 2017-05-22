import { Component } from 'react'
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import DialoguePlayer from './DialoguePlayer'

class DialoguePreview extends Component {

	constructor(props) {
		super(props);
	}
	
	render() {

		const actions = [
			<FlatButton
				label="Close"
				primary={false}
				onTouchTap={this.props.onClosePreview.bind(this)}
			/>
		];

		return (
			<div className="DialoguePreview">
				<Dialog
					actions={actions}
					modal={false}
					open={this.props.open}
				>
					<DialoguePlayer dialogues={this.props.dialogues} allCards={this.props.allCards} />
				</Dialog>
			</div>
		)
	}
}

export default DialoguePreview;