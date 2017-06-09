import { Component } from 'react'
import {line, curveBasis} from 'd3-shape';
import {select} from 'd3-selection';
import {extent} from 'd3-array';
import {scaleLinear} from 'd3-scale';


const RADIUS = 100;
const CARD_WIDTH = 400;
const CARD_HEIGHT = 300;
const linkPathFn = line().x(function(d) { return d.x; }).y(function(d) { return d.y; }).curve(curveBasis);

class DialogueViz extends Component {


	constructor(props) {
		super(props);
		this.drawArrows = this.drawArrows.bind(this);
	}

	componentWillMount() {

		if(this.props.responses == null || this.props.responses[this.props.dialogue.id] == null) {
			this.props.getResponsesData();
		}
	}


	findCardIndex(id) {
		if(id == -1) return this.props.cards.length;
		for (var i = 0; i < this.props.cards.length; i++) {
			if(this.props.cards[i].id == id) return i;
		}
	}

	componentWillReceiveProps(nextProps) {

		if(!nextProps.responses || !nextProps.responses[this.props.dialogue.id] || !nextProps.cards) return;
		

		nextProps.cards.forEach((card)=> {

			// set links index
			card.answers[0].linkIndex = this.findCardIndex(card.answers[0].link);
			card.answers[1].linkIndex = this.findCardIndex(card.answers[1].link);
			if(card.answers[0].clicks == null) card.answers[0].clicks = 0;
			if(card.answers[1].clicks == null) card.answers[1].clicks = 0;
			
			let dialogueResponses = nextProps.responses[this.props.dialogue.id];

			// aggregate respones per card
			for(var i in dialogueResponses) {
				if(dialogueResponses[i].cardId == card.id) {
					card.answers[dialogueResponses[i].value].clicks++;
				}
			}
		})
	}

	componentDidMount() {
		window.addEventListener("resize", this.drawArrows)
		
	}

	componentDidUpdate() {
		this.drawArrows();
	}

	drawArrows() {
		this.width = document.body.clientWidth;
		const height = (this.props.cards.length+1)*CARD_HEIGHT + 100;
		const self = this;

		let c0= extent(this.props.cards, (d)=>d.answers[0].clicks);
		let c1= extent(this.props.cards, (d)=>d.answers[1].clicks);
		let myextent = extent(c0.concat(c1));
		let strokeScale = scaleLinear().domain(myextent).range([1,4]);

		const svg = select(this.svg)
		.attr("width", this.width)
		.attr("height", height);

		const links = this.props.cards.filter((d)=>  d.answers != null);

		let paths = svg
		.selectAll(".link0")
		.data(links)

		paths
		.enter()
		.append("path")
		.attr("class", "link0")
		.attr("marker-end", "url(#arrow)")
		.style("fill","none")
		.style("stroke", "#333")
		.style("stroke-width",function(d){return strokeScale(d.answers[0].clicks)})
		.attr("marker-end", "url(#darkarrow)")
		.merge(paths)
		.attr("d", function(d,i){ return linkPathFn(self.getPoints(d, i,0))});

	 	paths = svg
		.selectAll(".link1")
		.data(links)

		paths
		.enter()
		.append("path")
		.attr("class", "link1")
		.attr("marker-end", "url(#arrow)")
		.style("fill","none")
		.style("stroke", "#333")
		.style("stroke-width",function(d){return strokeScale(d.answers[1].clicks)})
		.attr("marker-end", "url(#darkarrow)")
		.merge(paths)
		.attr("d", function(d,i){ return linkPathFn(self.getPoints(d, i,1))});




	}

	getY(i){
		return i * CARD_HEIGHT + 100;
	}

	getPoints(card, sourceIndex, answerIndex) {
		const targetIndex = card.answers[answerIndex].linkIndex;
		const isRight = answerIndex == 1;
		const isAbove = targetIndex < sourceIndex;
		let cornerX = isRight ? 60 : -60;

		let sx = this.width /2 +  (isRight ? CARD_WIDTH/2 : -CARD_WIDTH/2);
		let sy = this.getY(sourceIndex) + CARD_HEIGHT*.8;
		let ty = this.getY(targetIndex) + CARD_HEIGHT*.2;

		// calculating distance between cards to push link away from edge
		let push = (targetIndex - sourceIndex) * 40;
		if(isAbove) {
		} else {
			cornerX += push * (isRight ? 1 : -1)
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


	render() {
		if(!this.props.responses || !this.props.responses[this.props.dialogue.id]) return <div>loading</div>

			return  (
				<div style={{background:"#ddd"}}>
				<div ref={(el)=>this.container=el} style={{width: 600, position: "relative", margin: "auto"}}>

				{ this.props.cards.map((card,i)=>(

					<div key={card.id} className="node" style={{width:CARD_WIDTH, height:CARD_HEIGHT*.9, position: "absolute", left: "50%", transform: "translate(-50%, " + this.getY(i) +"px)"}} >
					<p style={{textAlign: "center"}}>{card.title}</p>
					<div className= "answers">
					<p style={{textAlign: "left"}}>{card.answers[0].label + " (" +card.answers[0].clicks +")"}</p>
					<p style={{textAlign: "right"}}>{card.answers[1].label + " (" +card.answers[1].clicks +")"}</p>
					</div>
					</div>

					))}

				<div className="node" style={{width:CARD_WIDTH,height:CARD_HEIGHT*.9, position: "absolute", left: "50%", transform: "translate(-50%, " + this.getY(this.props.cards.length) +"px)"}} >
				<p>End</p>
				</div>

				</div>


				<svg style={{position:"absolute", top:0}} ref={(svg)=> {this.svg = svg;} } width="100%" height="5000">
				<defs>
				<marker
				id="darkarrow"
				markerWidth="5"
				markerHeight="5"
				viewBox="0 -5 10 10"
				orient="auto"
				>
				<path d="M0,-5L10,0L0,5" fill={"#333"} />
				</marker>

				</defs>



				</svg>

				</div>
				)

	}
}




export default DialogueViz