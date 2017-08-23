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

		let inputStyle = {border: '1px solid #ddd', borderBottom: '2px solid #ddd', width: '100%', fontSize:".8rem" };
		let textareaStyle = {padding:0, border: '1px solid #ddd', marginTop:0, borderBottom: '2px solid #ddd', width: '100%', fontSize:".9rem" };
		let properties = {
			onTouchTap: this.props.onTouchTap,
			onChange: this.handleChange.bind(this),
			onFocus: this.handleFocus.bind(this),
			onBlur: this.handleBlur.bind(this),
			value: this.state.currentValue
		}
		let component =  <input type="text" {...properties} style = {inputStyle}/>
		return component;
	}
}
