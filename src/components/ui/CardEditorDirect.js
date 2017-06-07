import { Component } from "react";

import FlatButton from "material-ui/FlatButton";
import PlusIcon from "material-ui/svg-icons/content/add-circle";
import IconButton from "material-ui/IconButton";
import DeleteIcon from "material-ui/svg-icons/action/delete";
import { blue500, blueGrey200 } from "material-ui/styles/colors";

import ButtonCombo from "./ButtonCombo";
import CardContentBox from "./CardContentBox";

import update from "immutability-helper";

export default class CardEditorDirect extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			isImage: props.card.isImage,
			imageURL: props.card.imageURL,
			cardIndex: props.card.id,
			title: props.card.title,
			answers: props.card.answers
		};

		this.onChangeImage= this.onChangeImage.bind(this)
		this.onChangeCardAnswer= this.onChangeCardAnswer.bind(this)
		this.onChangeImageMode=  this.onChangeImageMode.bind(this)
		this.onChangeTitle = this.onChangeTitle.bind(this)
		this.onSelectCard = this.onSelectCard.bind(this) 
		this.onDeleteCard = this.onDeleteCard.bind(this) 
	}


	onChangedCard() {

		this.props.onChangedCard({
			isImage: this.state.isImage,
			imageURL: this.state.imageURL,
			imageFilename: this.state.imageFilename,
			cardIndex: this.state.cardIndex,
			title: this.state.title,
			answers: this.state.answers
		});

	}

	onChangeImage({filename, url}) {
		console.log(filename, url)
		this.setState({
			isImage:true,
			imageFilename: filename,
			imageURL: url
		}, ()=> this.onChangedCard());
	}

	onChangeImageMode(isImage) {
		console.log(isImage)
		this.setState({
			isImage
		}, ()=> this.onChangedCard());
	}

	onChangeTitle(ev) {
		this.setState({
			title: ev.target.value
		}, ()=> this.onChangedCard());
	}

	onChangeCardAnswer(data) {
		let newState = update(this.state, {
			answers: { [data.answerIndex]: { $set: data.value } }
		});
		this.setState(newState, () => this.onChangedCard());
	}

	onSelectCard() {
		if(this.props.selectedCardId !=this.props.card.id) {
			this.props.onSelectCard(this.props.card.id);
		}
	}

	onDeleteCard() {
		this.props.onDeleteCard({ cardId: this.props.card.id, order: this.props.index })
	}

	getClassName() {
		let s = "CardEditor";
		if(this.props.selectedCardId == this.props.card.id) s+= " selected";
		if(this.props.isLinking  && this.props.linkingCardId != this.props.card.id) s+= " isHoverable";
		return s;
	}

	render() {
		let component;
		let props = this.props;
		const ai = props.answerIndex;
		let deleteButton = (
			<IconButton

			style={{position: "absolute", right: 0, width:30, height:30, padding:0}}
			className="CardDeleteButton"
			onTouchTap={this.onDeleteCard}
			>
			<DeleteIcon color="black" />
			</IconButton>
			);

		return (
			

			<div style= {{
				position: "absolute",
				width: "100%",
				transform: "translate3d(0px, "+ props.style.y +"px, 0px) scale("+props.style.scale+")"
			}}
			onTouchTap = {this.onSelectCard}
			>
			{ props.index > 0 && deleteButton }

			
			<div className={this.getClassName()} id={"card" + props.card.id} > 


			<div className="FieldContainer">
			<CardContentBox card={props.card} 
			onSelectCard = {props.onSelectCard}
			onChangeImage= {this.onChangeImage} 
			onChangeImageMode= {this.onChangeImageMode} 
			onChangeTitle={this.onChangeTitle} 
			onImageAddedToCard={this.props.onImageAddedToCard}
			/>
			</div>


			<div className="ButtonEditor">
			{ props.card.answers.map((answer, i) => (
				<div key={i} className="ButtonCombo">
				<ButtonCombo
				card = {props.card}
				onSelectCard = {props.onSelectCard}
				linkingAnswerIndex = {props.linkingAnswerIndex}
				onChangeCardAnswer = {this.onChangeCardAnswer}
				answerIndex={i}
				onLinking = {props.onLinking}
				label={answer.label}
				link={answer.link}
				/>
				</div>
				))}
			</div>
			</div>
			

			<FlatButton
			label="Add Card"
			primary={true}
			style={{position:"absolute", color: "#333",left:"50%", bottom:0, transform:"translate(-50%,120%)" }}
			onTouchTap={()=> {props.onAddCard({order: props.index })} }
			icon={<PlusIcon color="#333" />}
			/>


			</div>
			);
	}
}
