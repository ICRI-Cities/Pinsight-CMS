import { Component } from "react";
import SelectField from "material-ui/SelectField";
import Popover from "material-ui/Popover";
import MenuItem from "material-ui/MenuItem";
import Paper from "material-ui/Paper";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import PlusIcon from "material-ui/svg-icons/content/add-circle";
import IconButton from "material-ui/IconButton";
import DeleteIcon from "material-ui/svg-icons/action/delete";
import LinkIcon from "material-ui/svg-icons/content/link";
import { blue500, blueGrey200, pink400 } from "material-ui/styles/colors";
import trimString from "../../utilities";
import ControlledInput from "./ControlledInput";
import CardContentBox from "./CardContentBox";
import update from "immutability-helper";
import LinkHandle from "./LinkHandle";

class ButtonCombo extends Component {

	constructor(props) {
		super(props);
		this.state = {
			answerIndex: this.props.answerIndex,
			label: this.props.label,
			link: this.props.link
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState(nextProps);
	}

	onLabelChange(event) {
		this.props.onChangeCardAnswer({
			answerIndex: this.state.answerIndex,
			value: {
				label: event.target.value,
				link: this.state.link
			}
		});
	}

	onButtonClicked() {
		this.props.onLinking(this.props.card.id, this.state.answerIndex);
	}

	getTitle(card, i) {
		return card.title !== "" ? trimString(card.title) : "Card " + (i + 1);
	}

	render() {
		let inputProps = {};

		let inputStyle = {
			display: "block",
			fontSize: "1rem",
			width: "100%"
		};
		const len = 20 - this.state.label.length;
		let errorText = +len > 0
		? len + " chars left"
		: len * -1 + " chars too long";

		let isLinking = this.props.isLinking;
		let isLinkingThisAnswer =
		this.props.selectedCardId == this.props.card.id &&
		this.props.linkingAnswerIndex == this.state.answerIndex;
		const buttonProps = {
			label: isLinking ? "confirm" : "link",
			labelStyle: { color: "#fff" },
			backgroundColor: blue500,
			hoverColor: blue500,
			style: { opacity: isLinking ? isLinkingThisAnswer ? 1 : 0 : 1 }
		};

		return (
			<div id={"answer"+this.props.answerIndex} onTouchTap={() => this.props.onSelectCard(this.props.card.id)}>
			<div className="FieldContainer">
			<ControlledInput
			onChange={this.onLabelChange.bind(this)}
			label={this.props.label}
			/>
			<label style={{ color: len < 0 ? "red" : "#ddd" }}>
			{errorText}
			</label>
			</div>

			<div className="FieldContainer">
			<div className="LinkButtonContainer" onTouchTap={this.onButtonClicked.bind(this)}>
			<FlatButton
			{...buttonProps}
			icon={<LinkIcon color={"#fff"} />}
			/>
			</div>
			</div>
			</div>
			);
	}
}

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

	render() {
		let component;
		let props = this.props;

		const ai = this.props.answerIndex;

		let deleteButton = (
			<IconButton
			className="CardDeleteButton"
			onTouchTap={() => this.props.onDeleteCard({ cardId: props.card.id, order: props.index })}
			>
				<DeleteIcon color="#EBECF5" />
			</IconButton>
			);

		const isSelected =  props.selectedCardId == props.card.id;
		return (
			<div>
			<div className="CardEditor" style={{ border: "2px solid "+ (isSelected ? blueGrey200 : "rgba(0,0,0,0)")}} id={"card" + props.card.id} >

			 { props.isLinking && !isSelected && 
				<LinkHandle {...props}/> 
			}

			{ props.index > 0 && deleteButton }

			<div className="FieldContainer">
				<CardContentBox card={props.card} 
					onChangeImage= {this.onChangeImage.bind(this)} 
					onChangeImageMode= {this.onChangeImageMode.bind(this)} 
					onChangeTitle={this.onChangeTitle.bind(this)} 
					onImageAddedToCard={this.props.onImageAddedToCard}
					/>
			</div>


			<div className="ButtonEditor">
			{ props.card.answers.map((answer, i) => (
				<div key={i} className="ButtonCombo">
					<ButtonCombo
						{...props}
						onChangeCardAnswer = {this.onChangeCardAnswer.bind(this)}
						answerIndex={i}
						label={answer.label}
						link={answer.link}
					/>
					</div>
				))}
			</div>
			</div>
			<div style={{width:"100%"}} >
				<FlatButton
					label="Add Card"
					primary="true"
					style={{ color: "#333",left:"50%", transform:"translate(-50%,0)" }}
					onTouchTap={()=> this.props.onAddCard({order: this.props.index }) }
					icon={<PlusIcon color="#333" />}
					/>
			</div>

			</div>
		);
	}
}
