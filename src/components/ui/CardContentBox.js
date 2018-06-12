import { Component } from "react";
import ImageUploader from './ImageUploader';
import FlatButton from "material-ui/FlatButton";

export default class CardContentBox extends Component {


	constructor(props) {
		super(props);
		this.state = {
			isFocused: false, 
			currentValue: props.card.title 
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);

	}

	

	handleChange(e){
		this.setState({ currentValue: e.target.value });
		this.props.onChangeTitle(e);
	}
	
	handleFocus(e){
		this.setState({ isFocused: true });
	}

	handleBlur(e){
		this.setState({ isFocused: false });
	}

	componentWillReceiveProps(nextProps){
		if (!this.state.isFocused){
			this.setState({ currentValue: nextProps.label });
		}
	}

	render() {
		const l = 140 - this.props.card.title.length;
		let errorText = +l >= 0 ? l + " chars left" : l * -1 + " chars too long";
		let isImage = this.props.card.isImage;

		return (
			<div className="CardContentTabs">
				<div className="CardContentTabsNav">
				<FlatButton className={!isImage ? "active" : ""} onTouchTap={()=>this.props.onChangeImageMode(false)} label="Text"/>
				<FlatButton className={isImage ? "active" : ""} onTouchTap={()=>this.props.onChangeImageMode(true)} label="Image"/>
				</div>
				<div className="CardContentTab" style={{display: isImage ? "none" : "block"}} >
					<textarea 
						onTouchTap={ this.props.onTouchTap}
						onChange={ this.handleChange}
						onFocus={ this.handleFocus}
						onBlur={ this.handleBlur}
						value={this.state.currentValue}
						rows="4"
					/>
					<label 
						style={{marginBottom: "2rem",color: this.props.card.title.length > 140	? "red"	: "#8fa3ae"}}
						>
						{errorText}
					</label>
				</div>
				<div className="CardContentTab ImageUploaderContainer" style={{display: isImage ? "block" : "none"}} >
				<ImageUploader {...this.props}/>
				</div>
			</div>
			)
	}
}