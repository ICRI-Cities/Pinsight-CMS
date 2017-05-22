import { Component } from 'react'
import ButtonCombo from './ButtonCombo'


export class ButtonEditor extends Component {

	constructor(props) {
		super(props);
	}


	render() {

		const answers = this.props.card.answers;
		return (
			<div className="ButtonEditor">
			{
				answers.map((answer, i) => 
					<div  key={i} className="ButtonCombo" >
					<ButtonCombo  {...this.props} answerIndex = {i} label={answer.label} link={answer.link}/>
					</div>
					)
			}
			</div>
			)
	}
}

export default ButtonEditor;
