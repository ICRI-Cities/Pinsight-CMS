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

		this.linkPaths = {};
		this.linkPathFn = d3.line().x(function(d) { return d.x; }).y(function(d) { return d.y; }).curve(d3.curveBasis);

		window.onresize = ()=>{
			this.updatePaths();
		};

	}


	// ----------------- LIFE CYCLE


	componentDidMount() {
		
		d3.select(this.svg).attr("height", this.getY(this.props.cards.length + 1));

		this.updatePaths();


	}




	componentDidUpdate(prevProps, prevState) {
		d3.select(this.svg).attr("height", this.getY(this.props.cards.length + 1));

		this.updatePaths();
		this.drawPaths();
	}

	updatePaths() {
		let selectedCardId = this.state.selectedCardId;
		let linkingAnswerIndex = this.state.linkingAnswerIndex;

		let svg = d3.select(this.svg);

		for (var index = 0; index < 2; index++) {

			let paths = svg
			.selectAll(".arrowpath.links" + index)
			.data(this.props.cards, (card)=>card.id);


			paths
			.enter()
			.append("path")
			.attr("class","arrowpath links" + index)
			.style("stroke-width", 2)
			.style("stroke",  blueGrey200)
			.attr("marker-end", "url(#lightarrow)");

			paths
			.each(function(card){
				const isSelected = card.id  == selectedCardId;
				const isLinking = isSelected &&  index == linkingAnswerIndex;
				const el = d3.select(this);
				el.style("stroke-width",  isLinking  ? 2.5 : 2);
				el.style("stroke",  isLinking  ? lightBlue500 : blueGrey200);
				el.attr("marker-end", isLinking  ? "url(#bluearrow)" :"url(#lightarrow)");
			});

		}
	}

	drawPaths() {
		this.drawPath(0);
		this.drawPath(1);
		window.requestAnimationFrame(this.drawPaths.bind(this))
	}

	drawPath(index) {

		if(!this.svg) return;
		let svg = d3.select(this.svg);

		let paths = svg
		.selectAll(".arrowpath.links"+index)

		paths
		.attr("d", (d)=>{
			let points = this.getMyPoints(d, index) || [];
			return (points.length) ? this.linkPathFn(points) : null; 
		});

	}


	getMyPoints(card, answerId) {
		const topOffset = this.svg.getBoundingClientRect().top;
		const endCard = d3.select(".EndCard").node().getBoundingClientRect();

		let source = this.getRect(card.id + " #answer"+answerId + " .LinkHandle .LinkIcon");
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
		let maxDistance = (Object.keys(this.props.cards).length+1) * CARD_HEIGHT;
		let distance = (target.top - source.top);
		let push = (distance/maxDistance) * 100 + card.index*5;

		if(isAbove) {
			ty-=10;
			cornerX += push * (isRight ? -1 :1);
		} else {
			cornerX += push *(isRight ? 1 : -1) 
		}



		const arcWidth = 20;

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
			x:sx + (isRight ? 10 : -10),
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

	onAddCard({answerIndex, linkedCard, order}) {
		this.resetSelectCard();
		this.props.onAddCard({answerIndex, linkedCard, order})
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
			cardId: this.state.selectedCardId,
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

		let svgStyle = {
			position: "absolute",
			pointerEvents: "none",
			top: 0
		};

		const props = this.props;



		let cards =  props.cards.map((card,i)=>{
			return({
				...card,
				y: this.getY(card.index)
			})
		});


		const endCard = {endCard:true, y: this.getY(cards.length)}
		cards.push(endCard);

		return (
			<div className="DialogueEditorDirect">

			<div className="DialogueEditorMenu">	
			<FlatButton
			style={{ color: "#ddd" }}
			label="preview"
			primary={true}
			icon={<PlayIcon color="#ddd" />}
			onTouchTap={this.onPreviewOpen}
			/>
			</div>

			<div className="DialogueWrapper" style={{height: this.getY(cards.length)}} >
			<TransitionMotion
			willLeave=  {
				(d)=> {return {y:d.data.y, scale: spring(0)}}
			}
			willEnter=  {
				(d)=> {
					return {y:d.data.y, scale: 0}
				}
			}
			styles={
				cards.map((card,i)=>{
					return {
						data: card,
						key: card.endCard ? "end" : "key"+card.id,
						style: {y: spring(card.y), scale:spring(1)}
					}}
					)}
				>
				{ interpolatedStyles =>

					<div className={"CardsContainer" + (this.state.isLinking ? " isLinking" : "")}>
					{

						interpolatedStyles.map(o=>{
							return this.getComponent(o);
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


	getComponent(card) {

		let props = this.props;
		let cardData = card.data;
		let style = card.style;


		if(cardData.endCard) {
			return (
				<div 
				key="keyEnd"  
				className="CardEditor EndCard"
				onTouchTap={()=> this.onSelectCard(-1)}
				style = {{
					position: "absolute",
					transform: "translate3d(0px, "+style.y+"px, 0px)"
				}}
				>
				END OF DIALOGUE
				</div>)
		} else {
			return (
				<CardEditorDirect
				index={cardData.index}
				key={card.key} 
				card={cardData}
				style={style}
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