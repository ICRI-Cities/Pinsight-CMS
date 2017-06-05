import React from 'react';
import {TransitionMotion, spring} from 'react-motion';



export default class TestList extends React.Component {
	
	constructor() {
		super();
		this.state = {
			items: [{key: 'a', c:"#ddd"}, {key: 'b', c:"#ddbaba"}, {key: 'c',c:"#eeddbb"}],
		}
	}

	componentDidMount() {
		setTimeout(()=> {
			this.setState({items: [{key: 'a', c:"#ddd"}, {key: 'c',c:"#eeddbb"}]});

			setTimeout(()=>{
				this.setState({items:[{key: 'a', c:"#ddd"}, {key: 'b', c:"#ddbaba"}, {key: 'c',c:"#eeddbb"}]})
			}, 1000);

		}, 1000);
	}




	willLeave(d) {
		// triggered when c's gone. Keeping c until its width/height reach 0.
		return {size: spring(0), y: d.data.y};
	}

	willEnter(d) {
		return {size: 0, y: d.data.y};
	}

	render() {
		return (
			<TransitionMotion
			willEnter={this.willEnter.bind(this)}
			willLeave={this.willLeave.bind(this)}
			styles={this.state.items.map((item,i) => ({
				key: item.key,
				data: {y:i*200},
				style: {size: spring(1), y:spring(i*200)},
			}))}>
			{interpolatedStyles =>
				// first render: a, b, c. Second: still a, b, c! Only last one's a, b.
				<div>
				{interpolatedStyles.map(config => {
					return <div key={config.key} style={{
						position:"absolute",
						width: 100, 
						height: 100,
						transformOrigin: "top center",
						top: config.style.y,
						transform: "scale("+config.style.size+")",
						border: '1px solid'}} />
					})}
				</div>
			}
			</TransitionMotion>
			);
	}
}