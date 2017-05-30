var RADIUS = 100;
var width = document.body.clientWidth;
var height = 2000;

const endCard = {
	title: "End",
	id: -1
}

const json = [
{
	title: "Card 1",
	id: 0,
	answers: [
	{t:"Answer a",link:1, clicks:6},
	{t:"Answer b",link:1, clicks:2}
	]
},

{
	title: "Card 2",
	id: 1,
	answers: [
	{t:"Hello",link:3, clicks:3},
	{t:"Answer b",link:2, clicks:4}
	]
},
{
	title: "Card 3",
	id: 2,
	answers: [
	{t:"Answer a",link:3, clicks:0},
	{t:"Answer b",link:3, clicks:1}
	]
},
{
	title: "Card 4",
	id: 3,
	answers: [
	{t:"Answer a",link:3, clicks:0},
	{t:"Answer b",link:3, clicks:1}
	]
},
{
	title: "Card 4",
	id: 4,
	answers: [
	{t:"Answer a",link:3, clicks:0},
	{t:"Answer b",link:3, clicks:1}
	]
},
{
	title: "Card 4",
	id: 5,
	answers: [
	{t:"Answer a",link:3, clicks:0},
	{t:"Answer b",link:3, clicks:1}
	]
}

]

const history = [
{
	type: "cardCreated",
	time: 100,
	cardId: 0  
},

{
	type: "cardCreated",
	time: 200,
	cardId: 1 
},
{
	type: "linkCreated",
	time: 100,
	cardId: 0,
	answerIndex: 0,
	link: 1
},
{
	type: "cardCreated",
	time: 200,
	cardId: 2
},
{
	type: "linkCreated",
	time: 100,
	cardId: 1,
	answerIndex: 0,
	link: 2
},
{
	type: "linkCreated",
	time: 100,
	cardId: 1,
	answerIndex: 1,
	link: 3
},
{
	type: "cardCreated",
	time: 200,
	cardId: 3
},
{
	type: "cardCreated",
	time: 200,
	cardId: 4
},
{
	type: "linkCreated",
	time: 100,
	cardId: 3,
	answerIndex: 1,
	link: 4
},
{
	type: "cardCreated",
	time: 200,
	cardId: 5
},
{
	type: "linkCreated",
	time: 100,
	cardId: 3,
	answerIndex: 0,
	link: 4
},
{
	type: "linkCreated",
	time: 100,
	cardId: 2,
	answerIndex: 1,
	link: 4
},
{
	type: "linkCreated",
	time: 100,
	cardId: 1,
	answerIndex: 1,
	link: 4
},
]
const getY = (d, i) => {
	const index = d.id == -1 ? currentData.length-1 : d.id;
	return index * RADIUS*2 + 250
}

var svg, nodes, links, linksLabel;
var linksData = [];
var currentData = [json[0], endCard];




var timelinePosition = 1;
var simulation = d3.forceSimulation()
.alphaTarget(0)
.force("charge", d3.forceCollide(80))
.force("x", d3.forceX(width/2))
.force("y", d3.forceY(getY))
.alphaTarget(1)



var line = d3.line()
.x(function(d) { return d.x; })
.y(function(d) { return d.y; })
.curve(d3.curveCardinal);

const next = () => {

	const currentAction = history[timelinePosition];

	switch(currentAction.type) {

		case "cardCreated":
		currentData.splice(currentData.length-1, 0, json[currentAction.cardId]);
		createEndLinks(json[currentAction.cardId])
		break;

		case "linkCreated":
		let found = false;
		const currentSource = currentData[currentAction.cardId];
		const currentAnswerIndex = currentAction.answerIndex;
		const currentTarget = currentAction.link == -1 ? currentData[currentData.length-1] : currentData[currentAction.link];
		// check if this card is not already linked
		linksData.forEach((d) => {
			if(d.source == currentSource && d.answerIndex == currentAnswerIndex) {
				d.target = currentTarget;
				found = true;
			}
		})
		
		if(!found) {
			linksData.push({
				answerIndex:currentAnswerIndex,
				source: currentSource,
				target: currentTarget
			});
		}
		break;
	}

	updateViz();


	timelinePosition++;
	if(timelinePosition < history.length) {
		setTimeout(next.bind(this), history[timelinePosition].time * 10)
	}


}


const updateViz = () => {


	var gs = svg
	.selectAll(".node")
	.data(currentData, (d) => d.id)
	.enter()
	.append("g")
	.attr("class", "node")
	.style("transform", (d) => {
		d.x = width/2;
		d.y = getY(d);
		return "translate("+ d.x +"px, " + d.y +"px)"
	})
	.call(d3.drag()
		.on("start", dragstarted)
		.on("drag", dragged)
		.on("end", dragended));
	
	svg
	.selectAll(".node")
	.transition()
	.style("transform", (d) => {
		d.x = width/2;
		d.y = getY(d);
		return "translate("+ d.x +"px, " + d.y +"px)"
	})

	gs
	.append("circle")
	.attr("class", "card")
	.style("fill", (d)=>d.id == -1 ? "#bbb" : "#ddd")
	.attr("r", 0)
	.transition()
	.attr("r", RADIUS*.93)
	// .on('mouseover', function() {
		// 	svg.selectAll(".linkLabel").style("opacity", 1)
		// })
		// .on('mouseout', function() {
			// 	svg.selectAll(".linkLabel").style("opacity", 0)
			// })


			gs
			.append("text")
			.text(function(d) {return d.title})
			.attr("text-anchor", "middle")
			.attr("y", -50)


			gs
			.each(function(d) {
				if(d.answers) {
					d3.select(this)
					.append("text")
					.text(d.answers[0].t)
					.attr("text-anchor", "middle")
					.attr("x", -50)
					.attr("y", 20)

					d3.select(this)
					.append("text")
					.text(d.answers[1].t)
					.attr("text-anchor", "middle")
					.attr("x", 50)
					.attr("y", 20)
				}
			})


			svg
			.selectAll(".link")
			.data(linksData)
			.enter()
			.append("path")
			.attr("class", "link")
			.attr("marker-end", "url(#arrow)")
			.style("stroke-width",4)

			svg
			.selectAll(".link")	
			.transition()
			.attr("d", function(d) {return linkArc(getLinkPositions(d),d.answerIndex)})


			svg
			.selectAll(".linkLabel")
			.data(linksData)
			.enter()
			.append("text")
			.attr("class", "linkLabel")
			.text(function(d) {return d.clicks})





			// simulation.nodes(currentData);
			// simulation.alpha(1).restart();


			// window.requestAnimationFrame(ticked)
		}






		const linkArc = (points, d) => {
			var source = points[0];
			var target = points[1];
			var largeArcFlag = d == 0 ? 0 : 1;
			largeArcFlag = source.y < target.y ?  d ? 1 :0  : d ? 0 : 1
			var dx = target.x - source.x,
			dy = target.y - source.y,
			dr = Math.sqrt(dx * dx + dy * dy) * .25;
			return "M" + source.x + "," + source.y + "A" + dr + "," + dr + " 0 0, "  + largeArcFlag + " " + target.x + "," + target.y;
		}

		const getLinkPositions = (d) => {
			var xoffset = d.answerIndex == 0 ? -50 : 50;
			var sourceX = d.source.x+xoffset;
			var sourceY = d.source.y + RADIUS/2;
			var targetX = d.target.x + xoffset;
			var targetY = d.target.y -RADIUS*1.618/2;
			return [{x:sourceX, y:sourceY}, {x:targetX, y:targetY}]
		}

		const dragstarted = (d) => {
			if (!d3.event.active) simulation.alphaTarget(1).restart();
			d3.event.subject.fx = d3.event.subject.x;
			d3.event.subject.fy = d3.event.subject.y;
		}

		const dragged = (d) => {
			d3.event.subject.fx = d3.event.x;
			d3.event.subject.fy = d3.event.y;
		}

		const dragended = (d) => {
			if (!d3.event.active) simulation.alphaTarget(0);
			d3.event.subject.fx = null;
			d3.event.subject.fy = null;
		}

		const ticked = () => {

			svg.selectAll(".node").style("transform", function(d) {return "translate("+d.x+"px, "+d.y+"px)" })
			window.requestAnimationFrame(ticked)
		}

		const init = () => {
			svg = d3.select("body").append("svg")
			.attr("width", width)
			.attr("height", height);

			svg
			.append("defs")
			.append("marker")
			.attr("id", "arrow")
			.attr("viewBox", "0 -5 10 10")
			.attr("markerWidth", 3)
			.attr("markerHeight", 3)
			.attr("orient", "auto")
			.append("path")
			.attr("fill", "rgba(0,0,0,.5)")
			.attr("d", "M0,-5L10,0L0,5");

			createEndLinks(currentData[0])

			next();

		}
		const createEndLinks = (d) => {
			linksData.push({
				answerIndex:0,
				source: d,
				target:currentData[currentData.length-1]
			});
			linksData.push({
				answerIndex:1,
				source: d,
				target:currentData[currentData.length-1]
			});
		}

		init();
