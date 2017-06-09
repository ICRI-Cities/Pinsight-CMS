import { Component } from 'react'
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton'


class DialoguePlayer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			currentDialogueIndex: 0,
			isAtEndCard: false,
			currentCard: null
		}

	}

	onButtonClicked(link) {

		this.setState({
			currentCard: this.props.allCards[link]
		})

		if(link == -1) {
			
			this.setState({
				isAtEndCard: true
			});

		} else {	
			this.setState({
				isAtEndCard: false,
				currentCard: this.props.allCards[link]
			})
		}
	}

	goToNextDialogue() {
		let currentDialogueIndex = this.state.currentDialogueIndex+1;
		currentDialogueIndex %= this.props.dialogues.length;	
		this.setState({
			isAtEndCard: false,
			currentDialogueIndex,
			currentCard: null
		});
	}


	render() {

		const dialogue = this.props.dialogues[this.state.currentDialogueIndex];
		const  buttonDivStyle = {
			width:"48%", 
			display: "block",
			background:"white"
		};
		const  buttonStyle = {
			background:"white"
		};
		if(this.state.isAtEndCard) {
			return (
				<div className="DialoguePlayer">
				
				<h2 style={{color:"#ddd"}}> End </h2>

				{ this.props.dialogues.length > 1 && 
					<div className="DialoguePlayerButtons">
					<RaisedButton
					buttonStyle = {buttonStyle}
					style = {buttonDivStyle}
					label = {this.props.dialogues.length > 1 ? "End" : "next dialogue" }
					primary={true}
					onTouchTap={()=>this.goToNextDialogue()}
					/>
					</div>
				}
				</div>
				)
		} else {

			const cards = Object.keys(dialogue.cards).map( cardId => this.props.allCards[cardId]);
			const currentCard = this.state.currentCard ? this.state.currentCard : cards[0];

			let answers = currentCard.answers.map((answer,i)=> {

				return (
					<RaisedButton
					label = {answer.label || " " }
					key = {i}
					style = {buttonDivStyle}
					buttonStyle = {buttonStyle}
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
}

export default DialoguePlayer