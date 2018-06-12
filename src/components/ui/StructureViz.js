import { Component } from 'react'
import {select, event} from 'd3-selection';
import {extent} from 'd3-array';
import {drag} from 'd3-drag';
import {scaleLinear} from 'd3-scale';
import {force, forceSimulation, forceLink} from 'd3-force';

class ResponseViz extends Component {


	constructor(props) {
		super(props);
	}


	componentDidMount() {

		var data = this.props.cards;
		var width = window.document.body.clientWidth;
		var height = window.document.body.clientHeight;
		var svg = select(this.svg).attr("width", width).attr("height", height)

		var simulation = forceSimulation()
		.force("link", forceLink().id(function(d) { return d.id; }).strength(0))

		var links = [];


		for (var i = 0; i < data.length; i++) {
			for (var k = 0; k < 2; k++) {
				links.push({
					source: data[i].id,
					target: data[i].answers[k].link,
				})
			}
		}


		startGraph(data)


		function timeline(data) {

			var extent = extent(data, (d)=>d.createdAt);
			var myscale = scaleLinear().domain(extent).range([0,1000])

			var node = svg.append("g")
			.attr("class", "nodes")
			.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
			.attr("r", 5)
			.attr("cy", 200)
			.attr("cx", (d)=>{
				return myscale(d.createdAt || myscale.domain()[0])
			})
		}

		function startGraph(data) {

			data.push({
				id: -1
			})

			var link = svg.append("g")
			.attr("class", "links")
			.selectAll("line")
			.data(links)
			.enter().append("line")
			.style("stroke", "#999")
			.attr("marker-end", "url(#darkarrow)")
			.attr("stroke-width", function(d) { return Math.sqrt(d.value); });

			var node = svg.append("g")
			.attr("class", "nodes")
			.selectAll("g")
			.data(data)
			.enter()
			.append("g")
			.attr("transform", (d, i)=>{
				d.x = width/2;
				d.y =  i *50 + 100;
				return `translate(${d.x}, ${d.y})`
			})
			.call(drag()
				.on("start", dragstarted)
				.on("drag", dragged)
				.on("end", dragended));


			node
			.append("circle")
			.attr("r", 5)
			.attr("fill", (d,i )=> {
				return (i ==0 ? "red" : (d.id !=-1 ? "#ddd" : '#00c7ff'))
			})

			node
			.append("text")
			.text(d=>d.title)
			.attr("transform", `translate(10,0)`)
			.style("font-size", ".5rem")
			
			
			

			simulation
			.nodes(data)
			.on("tick", ticked);

			simulation.force("link")
			.links(links);

			function ticked() {
				link
				.attr("x1", function(d) { return d.source.x; })
				.attr("y1", function(d) { return d.source.y; })
				.attr("x2", function(d) { 
					var n = normalize(d.source,d.target);
					return n.x  + d.source.x
				})
				.attr("y2", function(d) { 
					var n = normalize(d.source,d.target);
					return n.y + d.source.y
				});

				node
				.attr("transform", (d)=>{
					return `translate(${d.x}, ${d.y})`
				})
			}
		}

		function normalize(a,b) {
			var dx =b.x - a.x
			var dy =b.y - a.y
			var d = Math.sqrt(dx*dx + dy*dy);
			return {x: dx/d *(d-10),  y: dy/d *(d-10)}
		}

		function dragstarted(d) {
			console.log(d)

			if (!event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		}

		function dragged(d) {
			d.fx = event.x;
			d.fy = event.y;
		}

		function dragended(d) {
			if (!event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		}

	}


	render() {

		return  (
			<div style={{background:"#ddd"}}>



			<svg style={{position:"absolute", top:0}} ref={(svg)=> {this.svg = svg;} } >
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




export default ResponseViz