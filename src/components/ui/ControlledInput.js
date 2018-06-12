import { Component } from 'react'

export default class ControlledInput extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isFocused: false, 
			currentValue: this.props.label 
		}
	}


	handleChange(e){
		this.setState({ currentValue: e.target.value });
		this.props.onChange(e);
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

		let style = {border: '1px solid #ddd', width: '100%', fontSize:".8rem" };
		let properties = {
			onTouchTap: this.props.onTouchTap,
			onChange: this.handleChange.bind(this),
			onFocus: this.handleFocus.bind(this),
			onBlur: this.handleBlur.bind(this),
			value: this.state.currentValue
		}
		let component =  <input type="text" {...properties} style = {style}/>
		return component;
	}
}
