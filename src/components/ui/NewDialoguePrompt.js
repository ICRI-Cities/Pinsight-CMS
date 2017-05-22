import { Component } from 'react'
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

class NewDialoguePrompt extends Component {

	constructor(props) {
		super(props);
		this.state = {
			open: false,
			dialogueTitle: "No title"
		}
	}

	handleOpen = () => {
		this.setState({open: true});	
	}

	onCancel = (e,d) => {
		this.setState({open: false});
	}


	onTitleChange = (e,value) => {
		this.setState({dialogueTitle: value});
	}


	onSubmit = (e,d) => {
		this.setState({open: false});
		this.props.onSubmit(this.state.dialogueTitle);
	}

	render() {
		const actions = [
			<FlatButton
				label="Add"
				primary={true}
				className="PrimaryFlatButton"
				onTouchTap={this.onSubmit}
			/>,
			<FlatButton
				label="Cancel"
				primary={false}
				onTouchTap={this.onCancel}
			/>,
		];

		return (
			<div className="NewDialoguePrompt">
				<FlatButton
					label="Add new dialogue"
					secondary={true}
					onTouchTap={this.handleOpen}
				/>

				<Dialog
					className="CreateNewDialogueDialog"
					title="Create a new dialogue"
					actions={actions}
					modal={false}
					open={this.state.open}
					onRequestClose={this.handleClose}
				>
					<TextField 
						id="text-field" 
						onChange={this.onTitleChange} 
						hintText="Type the title of the dialogue"
					/>
				</Dialog>
			</div>
		)
	}
}

export default NewDialoguePrompt;