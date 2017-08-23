import { Component } from "react";
import { Link } from "react-router";

import IconButton from "material-ui/IconButton";
import BackIcon from "material-ui/svg-icons/navigation/arrow-back";
import PlayIcon from "material-ui/svg-icons/av/play-arrow";
import FlatButton from "material-ui/FlatButton";
import {lightBlue500, blueGrey200, blueGrey800} from 'material-ui/styles/colors'

import CardEditorDirect from "./CardEditorDirect";
import DialoguePreview from "./DialoguePreview";
import {TransitionMotion, spring} from 'react-motion';

import * as d3 from 'd3';


const MARGIN_TOP = 100;
const CARD_HEIGHT = 400;

class DialogueEditorDirect extends Component {

	constructor(props) {
		super(props);

		this.onLinking= this.onLinking.bind(this)
		this.onAddCard= this.onAddCard.bind(this)
		this.onDeleteCard= this.onDeleteCard.bind(this)
		this.onSelectCard= this.onSelectCard.bind(this)
		this.onLinkHandleClicked= this.onLinkHandleClicked.bind(this)
		this.onPreviewOpen= this.onPreviewOpen.bind(this)
		this.onPreviewClose= this.onPreviewClose.bind(this)
		this.drawArrows= this.drawArrows.bind(this)

		this.linkPaths = {};
		this.linkPathFn = d3.line().x(function(d) { return d.x; }).y(function(d) { return d.y; }).curve(d3.curveBasis);


	}


	// ----------------- LIFE CYCLE


	componentDidMount() {
		window.requestAnimationFrame(this.drawArrows)
	}


	updatePaths(index) {
		
		

	}



	drawArrows() {

	}

	drawArrow(index) {

	}


	// ----------------- HANDLERS
	
	onAddCard(obj) {
	}

	onDeleteCard(obj) {
	}

	resetSelectCard() {
		
	}


	onPreviewOpen() {
		this.setState({
			isPreviewing: true
		});
	}

	onPreviewClose() {
		this.setState({
			isPreviewing: false
		});
	}

	onSelectCard(id) {

	}

	onLinking(cardId, answerIndex) {


	}

	onLinkHandleClicked(linkedCardId) {

	}

	resetLinking() {

	}



	render() {
		
		let s = this.state;
		<div>

		{ s.cards.map(()=>{
			getComponent()
		})}
		</div>

	}

}

import 'ButtonCombo' from './ButtonCombo';

class DraggableCard extends Component {

	constructor(props) {
		super(props);
		this.setState({
			dragging:false,
			pos: {
				x:props.x, 
				y:props.y
			}
		})
	}

	componentDidUpdate(props, state) {
		if (this.state.dragging && !state.dragging) {
			document.addEventListener('mousemove', this.onMouseMove)
			document.addEventListener('mouseup', this.onMouseUp)
		} else if (!this.state.dragging && state.dragging) {
			document.removeEventListener('mousemove', this.onMouseMove)
			document.removeEventListener('mouseup', this.onMouseUp)
		}
	}

	// calculate relative position to the mouse and set dragging=true
	onMouseDown(e) {

		if (e.button !== 0) return
			var pos = $(this.getDOMNode()).offset()
		this.setState({
			dragging: true,
			rel: {
				x: e.pageX - pos.left,
				y: e.pageY - pos.top
			}
		})
		e.stopPropagation()
		e.preventDefault()
	}

	onMouseUp(e) {
		this.setState({dragging: false})
		e.stopPropagation()
		e.preventDefault()
	}

	onMouseMove(e) {
		if (!this.state.dragging) return
			this.setState({
				pos: {
					x: e.pageX - this.state.rel.x,
					y: e.pageY - this.state.rel.y
				}
			})
		e.stopPropagation()
		e.preventDefault()
	}

	render() {
		let containerStyle = {
			transform: "translate(" + this.state.pos.x +"px " + this.state.pos.y +"px)", 
			width: 200,
			height: 200,
			background: "#333"
		}

		<div style={containerStyle}>
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
		</div>
	}


}

export default DialogueEditorDirect;