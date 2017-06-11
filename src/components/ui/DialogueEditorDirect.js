import { Component } from "react";
import { Link } from "react-router";

import IconButton from "material-ui/IconButton";
import BackIcon from "material-ui/svg-icons/navigation/arrow-back";
import PlusIcon from "material-ui/svg-icons/content/add-circle";
import PlayIcon from "material-ui/svg-icons/av/play-arrow";
import FlatButton from "material-ui/FlatButton";
import {lightBlue500, blueGrey200, blueGrey800} from 'material-ui/styles/colors'

import CardEditorDirect from "./CardEditorDirect";
import DialoguePreview from "./DialoguePreview";
import {TransitionMotion, spring} from 'react-motion';

import * as d3 from 'd3';


const MARGIN_TOP = 100;
const CARD_HEIGHT = 500;

class DialogueEditorDirect extends Component {

	constructor(props) {
		super(props);

		this.state = {
			isPreviewing: false,
			isLinking: false,
			selectedCardId: null,
			linkingCardId: null,
			linkingAnswerIndex: null
		};

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
		const cardEditor = document.querySelector(".CardEditor");
		const h = cardEditor.offsetHeight;
		const w = cardEditor.offsetWidth;

		console.log("mount")
		d3.select(this.svg).attr("height", this.getY(this.props.cards.length + 1));

		window.requestAnimationFrame(this.drawArrows)
	}


	componentDidUpdate(prevProps, prevState) {
		d3.select(this.svg).attr("height", this.getY(this.props.cards.length + 1));
	}


	drawArrows() {
		this.drawArrow(0);
		this.drawArrow(1);
		window.requestAnimationFrame(this.drawArrows)

	}

	drawArrow(index) {

		if(!this.svg) return;
		let svg = d3.select(this.svg);

		let selectedCardId = this.state.selectedCardId;
		let linkingAnswerIndex = this.state.linkingAnswerIndex;

		let paths = svg
		.selectAll(".arrowpath.links"+index)
		.data(this.props.cards, (card)=>card.id)
		
		paths
		.exit()
		.remove();

		paths
		.enter()
		.append("path")
		.merge(paths)
		.each(function(card){
			const isSelected = card.id  == selectedCardId;
			const isLinking = isSelected &&  index == linkingAnswerIndex;
			const el = d3.select(this);
			el.attr("class","arrowpath links"+index + (isLinking ? " blinking" : ""))	
			el.style("stroke",  isLinking  ? lightBlue500 : blueGrey200);
			el.attr("marker-end", isLinking  ? "url(#bluearrow)" :"url(#lightarrow)");
		})
		.datum((card)=>this.getMyPoints(card, index) || [])
		.attr("d", this.linkPathFn)

	}


	getMyPoints(card, answerId) {
		const topOffset = this.svg.getBoundingClientRect().top
		const endCard = d3.select(".EndCard").node().getBoundingClientRect();

		let source = this.getRect(card.id + " #answer"+answerId + " .LinkHandle");
		if(!source) return;
		let sy = source.top + source.height *.5 - topOffset;
		let t = card.answers[answerId].link;
		let target = (t != -1) ? this.getRect(t) : endCard;
		if(!target) return;

		let ty =  target.top + target.height *.5  - topOffset;
		const isRight = answerId == 1;
		const sx = isRight ? source.right : source.left;

		const isAbove = target.top < source.top;

		let cornerX = isRight ? 50 : -50;

		// calculating distance between cards to push link away from edge
		let push = (target.top - source.top) * 0.1;
		if(isAbove) {
			ty-=10;
			push += target.top * 0.01;
			cornerX += push * (isRight ? -1 :1);
		} else {
			push += source.top * 0.01;
			cornerX += push *(isRight ? 1 : -1) 
		}



		const arcWidth = 40;

		let pnts = [
		{
			x:sx,
			y:sy
		},
		{
			x:sx + cornerX + (!isRight ? arcWidth : -arcWidth),
			y:sy
		},
		{
			x:sx + cornerX,
			y:sy
		},
		{
			x:sx + cornerX,
			y:sy + (isAbove ? -arcWidth : arcWidth)
		},
		{
			x:sx + cornerX,
			y:ty + (isAbove ? arcWidth : -arcWidth)
		},
		{
			x:sx + cornerX,
			y:ty
		},
		{
			x:sx + cornerX + (!isRight ? arcWidth : -arcWidth),
			y:ty
		},
		{
			x:sx ,
			y:ty
		}
		];

		return pnts;

	}


	getRect(id) {
		let node =  d3
		.select("#card" + id)
		.node()

		return node ? node.getBoundingClientRect() : null;
	}

	// ----------------- HANDLERS
	
	onAddCard(obj) {
		this.resetSelectCard();
		this.props.onAddCard(obj)
	}

	onDeleteCard(obj) {
		this.resetSelectCard();
		this.props.onDeleteCard(obj)

	}

	resetSelectCard() {
		this.setState({
			isLinking: false,
			selectedCardId: null,
			linkingCardId: null,
			linkingAnswerIndex: null
		});
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
		if (this.state.isLinking) {
			if(id != this.state.selectedCardId) this.onLinkHandleClicked(id);
		} else {
			this.setState({
				selectedCardId: id
			});
		}
	}

	onLinking(cardId, answerIndex) {

		if (this.state.isLinking) {
			this.resetLinking();
		} else {
			this.setState({
				isLinking: true,
				selectedCardId: cardId,
				linkingCardId: cardId,
				linkingAnswerIndex: answerIndex
			});
		}

	}

	onLinkHandleClicked(linkedCardId) {

		let card = this.props.allCards[this.state.selectedCardId];
		let answers = card.answers;
		answers[this.state.linkingAnswerIndex].link = linkedCardId;

		this.props.onChangedCard({
			cardIndex: this.state.selectedCardId,
			title: this.props.allCards[this.state.selectedCardId].title,
			answers
		});

		this.resetLinking();
	}

	resetLinking() {
		this.setState({
			isLinking: false,
			linkingCardId: null,
			linkingAnswerIndex: null
		});
	}


	getY(n) {
		return n * CARD_HEIGHT + MARGIN_TOP;
	}

	render() {
		console.log("render")
		let svgStyle = {
			position: "absolute",
			pointerEvents: "none",
			top: 0
		};

		const props = this.props;

		let cards =  props.cards.map((card,i)=>{
			return({
				...card,
				y: this.getY(i)
			})
		});
		const endCard = {endCard:true, y: this.getY(cards.length)}
		cards.push(endCard);

		return (
			<div className="DialogueEditorDirect">

			<div className="DialogueEditorMenu">	
			<FlatButton
			style={{ color: "#333" }}
			label="preview"
			primary={true}
			icon={<PlayIcon color="#333" />}
			onTouchTap={this.onPreviewOpen}
			/>
			</div>

			<div className="DialogueWrapper" style={{height: this.getY(cards.length)}} >

			<TransitionMotion
			willEnter={(d)=>{
				return {blur:20, scale: 1.3, y: d.data.y}
			}}
			willLeave={(d)=>{
				return {blur: spring(20), scale: spring(.2), y: d.data.y}
			}}
			styles={cards.map((card,i) => ({
				key: card.endCard ? "end" : "key"+card.id,
				data: {card, index: i, y:card.y},
				style: {blur: spring(0), scale: spring(1), y:spring(card.y)},
			}))}>


			{ (interpolatedStyles) =>

				<div className={"CardsContainer" + (this.state.isLinking ? " isLinking" : "")}>
				{
					interpolatedStyles.map(s => {
						return this.getComponent(s);
					})
				}
				</div>
			}

			</TransitionMotion>



			<svg ref={(svg)=> {this.svg = svg;} } style={svgStyle} width="100%" height="5000">
			<defs>
			<marker
			id="darkarrow"
			markerWidth="5"
			markerHeight="5"
			viewBox="0 -5 10 10"
			orient="auto"
			>
			<path d="M0,-5L10,0L0,5" fill={blueGrey800} />
			</marker>

			<marker
			id="lightarrow"
			markerWidth="5"
			markerHeight="5"
			viewBox="0 -5 10 10"
			orient="auto"
			>
			<path d="M0,-5L10,0L0,5" fill={blueGrey200} />
			</marker>

			<marker
			id="bluearrow"
			markerWidth="5"
			markerHeight="5"
			viewBox="0 -5 10 10"
			orient="auto"
			>
			<path d="M0,-5L10,0L0,5" fill={lightBlue500} />
			</marker>

			</defs>



			</svg>


			<DialoguePreview
			open={this.state.isPreviewing}
			allCards={this.props.allCards}
			dialogues={[this.props.dialogue]}
			onClosePreview={this.onPreviewClose}
			/>

			</div>
			</div>
			);
	}


	getComponent(s) {

		let props = this.props;

		if(s.data.card.endCard) {
			return (
				<div 
				key="keyEnd"  
				className="CardEditor EndCard"
				onTouchTap={()=> this.onSelectCard(-1)}
				style = {{
					position: "absolute",
					transform: "translate3d(0px, "+s.style.y+"px, 0px)"
				}}
				>
				END OF DIALOGUE
				</div>)
		} else {
			return (
				<CardEditorDirect
				index={s.data.index}
				key={s.key} 
				card={s.data.card}
				style={s.style}
				linkingAnswerIndex={this.state.linkingAnswerIndex}
				isLinking={this.state.isLinking}
				linkingCardId={this.state.linkingCardId}
				selectedCardId={this.state.selectedCardId}
				onLinking={this.onLinking}
				onSelectCard={this.onSelectCard}
				onLinkHandleClicked={this.onLinkHandleClicked}
				onAddCard={this.onAddCard}
				onDeleteCard={this.onDeleteCard}
				onChangedCard={props.onChangedCard}
				/>
				)
		}
	} 
}

export default DialogueEditorDirect;