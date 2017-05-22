import { Component } from 'react'
import {Link} from 'react-router'
import SelectField from 'material-ui/SelectField'
import Popover from 'material-ui/Popover'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import LinkIcon from 'material-ui/svg-icons/content/link'
import trimString from '../../utilities'
import {cyan500, pink400} from 'material-ui/styles/colors'


class ControlledInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isFocused: false, 
			currentValue: this.props.label 
		}
	}


	handleChange(e){
		this.setState({ currentValue: e.target.value });
		this.props.onChange(e);
	}
	
	handleFocus(e){
		this.setState({ isFocused: true });
	}

	handleBlur(e){
		this.setState({ isFocused: false });
	}

	componentWillReceiveProps(nextProps){
		if (!this.state.isFocused){
			this.setState({ currentValue: nextProps.label });
		}
	}

	render() {
		return (
			<input style={{width: '100%', fontSize:".9rem" }} 
			type="text"
			onChange={this.handleChange.bind(this)}
			onFocus={this.handleFocus.bind(this)}
			onBlur={this.handleBlur.bind(this)}
			value={this.state.currentValue}
			/>
			)
	}
}

export default class ButtonCombo extends Component {


	constructor(props) {
		super(props);
		this.state = {
			answerIndex: this.props.answerIndex,
			label: this.props.label,
			link: this.props.link
		}
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
		// if already in linking mode go back to non linking
		this.props.onLinking(this.props.linkedAnswer == -1 ? this.state.answerIndex : - 1);
	}

	getTitle = (card,i) => {
		return card.title !== "" ? trimString(card.title) : ("Card " + (i+1));
	}

	render() {
		let inputProps = {};
		
		let inputStyle = {
			display:'block',
			fontSize: '1rem', 
			width:"100%"
		};
		const len =  20 - this.state.label.length;
		let errorText =+  len > 0 ? len + " chars left" : (len*-1) + " chars too long";
		
		// check if you are in linking mode and set styles accordingly
		const l = this.props.linkedAnswer;
		const ai = this.props.answerIndex;
		const buttonProps = {
			labelStyle: {color: "#fff"},
			backgroundColor:  l == ai && l != -1  ? pink400 : cyan500, 
			hoverColor:  l == ai && l != -1  ? pink400 : cyan500, 
			label: l == ai && l != -1  ? "confirm link" :"link" ,
			icon: <LinkIcon color={"#fff"}/>
		}
		const divStyle = {}
		if(this.props.linkedAnswer != -1) {
			divStyle.opacity =  l == ai ? 1 : .1
		}

		const linkStyle = {fontSize:".8rem", display:"block", margin:"1rem 0" };

		const linkedCard = this.props.allCards[this.state.link];
		let linkedCardURL;
		if(linkedCard) {
			if(this.props.device) {
				linkedCardURL = "/dialogues/"+this.props.device+"/"+this.props.dialogue.id+"/"+linkedCard.id;
			} else {
				linkedCardURL = "/dialogues/"+this.props.dialogue.id+"/"+linkedCard.id;
			}
		} else {
			linkedCardURL = "#";
		}

		const link  = () => !linkedCard ? <p style={linkStyle}>{answerLabel}</p> : <Link to={linkedCardURL} style={linkStyle}>{answerLabel}</Link>;		



		let answerLabel = linkedCard ? trimString(linkedCard.title, 50) : "End";
		if(answerLabel === "") answerLabel = "Card " + (Object.keys(this.props.dialogue.cards).indexOf(linkedCard.id) +1);
		

		//

		return (

			<div style={divStyle} >
			<div className="FieldContainer">
			<label>{"Button " + (this.state.answerIndex+1) + " label"}</label>
			<ControlledInput onChange={this.onLabelChange.bind(this)} label={this.props.label}/>
			<label style={{color: len < 0 ? "red" : "#ddd"}}>{errorText}</label>
			</div>

			<div className="FieldContainer">
			<label>{"Button " + (this.state.answerIndex+1) + " link"} </label>
			{link()}
			<div onTouchTap={this.onButtonClicked.bind(this)}>
			<FlatButton {...buttonProps}/>
			</div>
			</div>
			</div>
			)
	}


}
