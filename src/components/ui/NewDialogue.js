import { Component } from 'react'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton';



export default class NewDialogue extends Component {

	render() {
		return (
			<div>
				<TextField id="text-field" hintText="Type the title of the dialogue"/>
				<FlatButton label="CANCEL" />
				<FlatButton label="OK" primary={true} />
			</div> 
			)
	}
}