import { Component } from "react";
import IconButton from "material-ui/IconButton";
import BackIcon from "material-ui/svg-icons/navigation/arrow-back";
import { Link } from "react-router";
import DialoguePreview from "./DialoguePreview";
import LinkHandle from "./LinkHandle"
import CardEditorDirect from "./CardEditorDirect";
import PlusIcon from "material-ui/svg-icons/content/add-circle";
import PlayIcon from "material-ui/svg-icons/av/play-arrow";
import FlatButton from "material-ui/FlatButton";
import {blue500, blueGrey200, blueGrey800} from 'material-ui/styles/colors'
import * as d3 from "d3";

class DialogueEditorDirect extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isPreviewing: false,
			isLinking: false,
			selectedCardId: null,
			linkingCardId: null,
			linkingTargetCardId: null,
			linkingAnswerIndex: null
		};

	}


	componentDidMount() {
		var h = document.querySelector(".CardEditor").offsetHeight;
		var w = document.querySelector(".CardEditor").offsetWidth;
		document.querySelector(".EndCard").style.height = h+"px";

		this.drawArrows();	
		window.addEventListener("resize", this.drawArrows.bind(this));
	}

	drawArrows() {
		let svg = d3.select(this.refs.svg);

		svg.selectAll(".arrowpath").remove();
		svg.attr("height",  document.querySelector(".DialogueEditorDirect").offsetHeight);
		this.props.cards.forEach(card => {

			var source = d3
			.select("#card" + card.id + " #answer0")
			.node()
			.getBoundingClientRect();

			var t0 = card.answers[0].link;
			var t1 = card.answers[1].link;
			let endCard = d3.select(".EndCard").node().getBoundingClientRect();

			let target0;
			let sy =  source.top + source.height *.2;
			let ty;

			if (t0 != -1) {
				target0 = d3
				.select("#card" + t0)
				.node()
				.getBoundingClientRect();
				ty =  target0.top + target0.height *.2;
			} else {
				target0 = endCard;
				ty =  target0.top + target0.height *.5;
			}

			
			this.appendLine(
				card,
				svg,
				source.left,
				sy + window.scrollY,
				ty + window.scrollY,
				false
				);

			source = d3
			.select("#card" + card.id + " #answer1")
			.node()
			.getBoundingClientRect();


			let target1;
			if (t1 != -1) {
				target1 = d3
				.select("#card" + t1)
				.node()
				.getBoundingClientRect();
				ty =  target1.top + target1.height *.2;
			} else {
				target1 = endCard;
				ty =  target1.top + target1.height *.5;
			}

			sy =  source.top + source.height *.2;

			this.appendLine(
				card,
				svg,
				source.right,
				sy + window.scrollY,
				ty + window.scrollY,
				true
				);
		});
	}

	appendLine(card, svg, sx, sy, ty, isRight) {


		svg
		.append("path")
		.attr("d", d => {
			return this.getLine(
				[{x: sx,y: sy},{x: sx + (isRight? 40:-40) ,y: ty}],
				isRight
				);
		})
		.attr("marker-end", "url(#lightarrow)")
		.style("stroke-width", 2)
		.attr("class", "arrowpath")
		.attr("data-index", isRight ? 1 : 0)
		.attr("id", "path" + card.id)
		.style("fill", "none")
		.style("stroke", blueGrey200 );
	}

	getLine(points, isRight) {
		const source = points[0];
		const target = points[1];
		const isAbove = target.y < source.y;

		let cornerX = source.x + (isRight ? 80 : -80) ;
		// calculating distance between cards to push link away from edge
		let push = (target.y - source.y) * 0.02;
		cornerX += push * (isRight ? 1 : -1) * (isAbove ? -1 : 1);
		// target.x += isRight ? 10 : -10;
		return ("M " +source.x +" " +source.y +" H " +cornerX +" L " +cornerX +" " +target.y +" L " +target.x +" " +target.y);
	}

	componentDidUpdate(prevProps, prevState) {
		// scroll to new card if just added
		if (this.props.cards.length != prevProps.cards.length) {
			let newCardId;
			for (var i = 0; i < this.props.cards.length; i++) {
				let c = this.props.cards[i];
				let cc;
				for (var k = 0; k < prevProps.cards.length; k++) {
					if (prevProps.cards[k] == c) {
						cc = prevProps.cards[k];
						break;
					}
				}
				if (cc == null) {
					newCardId = c.id;
					break;
				}
			}
			// let scrollToCard =document.querySelector("#card"+newCardId);
			// if(scrollToCard) {
			// //	this.doScrolling(scrollToCard.getBoundingClientRect().top-50, 500)
			// }
		}

		this.drawArrows();

		let svg = d3.select(this.refs.svg);
		let selectedCardId = this.state.selectedCardId;
		let linkingAnswerIndex = this.state.linkingAnswerIndex;
		if (selectedCardId) {
			svg
			.selectAll("svg .arrowpath")
			.attr("class", function(d) {
				var n = d3.select(this);
				var isLinking =
				n.attr("id") == "path" + selectedCardId &&
				+n.attr("data-index") == linkingAnswerIndex;
				return isLinking ? "blinking arrowpath" : "arrowpath";
			})
			.style("stroke", function(d) {
				var n = d3.select(this);
				var isLinking =
				n.attr("id") == "path" + selectedCardId &&
				+n.attr("data-index") == linkingAnswerIndex;
				return n.attr("id") == "path" + selectedCardId ? (isLinking ? blue500 : blueGrey800) : blueGrey200;
			})
			.attr("marker-end", function(d) {
				var n = d3.select(this);
				var isLinking =
				n.attr("id") == "path" + selectedCardId &&
				+n.attr("data-index") == linkingAnswerIndex;
				return n.attr("id") == "path" + selectedCardId ? (isLinking ? "url(#bluearrow)" : "url(#darkarrow)") : "url(#lightarrow)";
			});
		}
	}


	// ----------------- HANDLERS


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
		this.setState({
			selectedCardId: id
		});
	}

	onLinking(cardId, answerIndex) {
		if (this.state.isLinking) {
			this.resetLinking();
		} else {
			this.setState({
				isLinking: true,
				linkingCardId: cardId,
				linkingTargetCardId: this.props.allCards[cardId].answers[
				answerIndex
				].link,
				linkingAnswerIndex: answerIndex
			});
		}
	}

	doScrolling(elementY, duration) { 
		var startingY = window.pageYOffset  
		var diff = elementY - startingY  
		var start

		// Bootstrap our animation - it will get called right before next frame shall be rendered.
		window.requestAnimationFrame(function step(timestamp) {
			if (!start) start = timestamp
				var time = timestamp - start
			var percent = Math.min(time / duration, 1)

			window.scrollTo(0, startingY + diff * percent)

			if (time < duration) {
				window.requestAnimationFrame(step)
			}
		})
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
			linkingTargetCardId: null,
			linkingAnswerIndex: null
		});
	}

	render() {
		let svgStyle = {
			position: "absolute",
			pointerEvents: "none",
			top: 0
		};

		return (
			<div className="DialogueEditorDirect">

			<div className="DialogueEditorMenu">	
				<FlatButton
					style={{ color: "#333" }}
					label="preview"
					primary="true"
					icon={<PlayIcon color="#333" />}
					onTouchTap={this.onPreviewOpen.bind(this)}
				/>
			</div>

				<div className="DialogueHierarchy" ref="editorContainer">

				{ this.props.cards.map((card, i) => {
					return (
						<CardEditorDirect
							{...this.props}
							index={i}
							isLinking={this.state.isLinking}
							selectedCardId={this.state.selectedCardId}
							linkingAnswerIndex={
								this.state.linkingAnswerIndex
							}
							linkingCardId={this.state.linkingCardId}
							linkingTargetCardId={
								this.state.linkingTargetCardId
							}
							onLinking={this.onLinking.bind(this)}
							onSelectCard={this.onSelectCard.bind(this)}
							onLinkHandleClicked={this.onLinkHandleClicked.bind(this)}
							card={card}
						/>
					);
				})}

			<div className="CardEditor EndCard">
			 {this.state.isLinking &&
			 	<div>
			 	
				<LinkHandle linkingTargetCardId={this.state.linkingTargetCardId} linkingAnswerIndex= {0} card={{id:-1}} onTouchTap={() => this.props.onLinkHandleClicked(props.card.id)}/> 
				<LinkHandle linkingTargetCardId={this.state.linkingTargetCardId} linkingAnswerIndex= {1} card={{id:-1}} onTouchTap={() => this.props.onLinkHandleClicked(props.card.id)}/> 
				</div>
			}
			 Next dialogue 
			 </div>

				<svg style={svgStyle} width="100%" height="5000" ref="svg">
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
							<path d="M0,-5L10,0L0,5" fill={blue500} />
						</marker>

					</defs>
				</svg>

				<DialoguePreview
					open={this.state.isPreviewing}
					allCards={this.props.allCards}
					dialogues={[this.props.dialogue]}
					onClosePreview={this.onPreviewClose.bind(this)}
				/>

				</div>
			</div>
		);
	}
}

export default DialogueEditorDirect;