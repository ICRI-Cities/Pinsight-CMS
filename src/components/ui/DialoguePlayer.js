import { Component } from 'react'
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton'


class DialoguePlayer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			currentDialogueIndex: 0,
			currentCard: null
		}

	}

	onButtonClicked(link) {

		this.setState({
			currentCard: this.props.allCards[link]
		})

		if(link == -1) {
			let currentDialogueIndex = this.state.currentDialogueIndex+1;
			currentDialogueIndex %= this.props.dialogues.length;
			console.log(currentDialogueIndex, this.props.dialogues);


			this.setState({
				currentDialogueIndex,
				currentCard: null
			});

		} else {	
			this.setState({
				currentCard: this.props.allCards[link]
			})
		}
	}

	render() {

		const dialogue = this.props.dialogues[this.state.currentDialogueIndex];

		const cards = Object.keys(dialogue.cards).map( 
			(cardId) => {
				return this.props.allCards[cardId] 
			}
		)

		const currentCard = this.state.currentCard ? this.state.currentCard : cards[0];
		

		let answers = currentCard.answers.map((answer,i)=> {

			return (
				<RaisedButton
					label = {answer.label || " " }
					key = {i}
					primary={true}
					onTouchTap={() => this.onButtonClicked(answer.link) }
				/>
			)

		});

		return (
			<div className="DialoguePlayer">
				{currentCard.title ? <h2>{currentCard.title}</h2> : <h2 style={{color:"#ddd"}}>No text</h2>}
				<div className="DialoguePlayerButtons">
					{ answers }
				</div>
			</div>
		)
	}
}

export default DialoguePlayer