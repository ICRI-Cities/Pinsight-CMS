import { Component } from "react";
import LinkHandle from "./LinkHandle";
import ControlledInput from "./ControlledInput";

const ANSWER_LENGTH = 40;


export default class ButtonCombo extends Component {

	constructor(props) {
		super(props);
		this.state = {
			answerIndex: this.props.answerIndex,
			label: this.props.label,
			link: this.props.link
		};

		this.onLabelChange = this.onLabelChange.bind(this);
		this.onLinkClicked = this.onLinkClicked.bind(this);
		this.onSelectCard = this.onSelectCard.bind(this);

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

	onLinkClicked() {
		this.props.onLinking(this.props.card.id, this.state.answerIndex);
	}

	onSelectCard() {
		this.props.onSelectCard(this.props.card.id);
	}

	render() {
		let inputProps = {};
		const len = ANSWER_LENGTH - this.state.label.length;
		let errorText = +len > 0 ? len + " chars left" : len * -1 + " chars too long";

		const isLinking = this.props.isLinking;
		const isLinkingThisAnswer = this.props.selectedCardId == this.props.card.id && this.props.linkingAnswerIndex == this.state.answerIndex;
		const isFirst = this.props.answerIndex == 0;

		return (
			<div id={"answer"+this.props.answerIndex} onTouchTap={this.onSelectCard}>
				<div className="FieldContainer" style={{position:"relative"}} >
					<ControlledInput
					onChange={this.onLabelChange}
					label={this.props.label}
					/>
					<LinkHandle mystyle={ {left: isFirst ? "0" : "100%"} } onTouchTap={this.onLinkClicked} className="LinkHandle"/>	
				</div>
				<label style={{ color: len < 0 ? "red" : "#ddd" }}>
					{errorText}
				</label>
			</div>
			);
	}
}
