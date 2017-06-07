import {Component} from 'react'
import {hashHistory} from 'react-router'
import AppBar from 'material-ui/AppBar'
import {Link} from 'react-router'
import Dialog from 'material-ui/Dialog'

import IconButton from 'material-ui/IconButton';
import LoadIcon from 'material-ui/svg-icons/action/cached';
import DoneIcon from 'material-ui/svg-icons/action/done';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import FlatButton from 'material-ui/FlatButton'

import LoadingIndicator from './LoadingIndicator';
import NotificationBar from './NotificationBar';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {red500,blue500,blueGrey700} from 'material-ui/styles/colors'



const BackButton = (props) => (
	<IconButton id="AppIconButton" {...props}>
		<BackIcon id="AppBackIconButton" color="white"/>
	</IconButton>
)

export default class App extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			open: false
		}
	}

	onBackClicked() {
		if(this.props.params.device != null) {
			if(this.props.params.dialogue != null) {
				hashHistory.push("/devices/"+ this.props.params.device);
			} else {
				hashHistory.push("/");
			}
		} else {
			hashHistory.push("/");
		}
	}

	handleClose(b) {
		this.setState({open: false});
		if(b) {
			hashHistory.push("/");
		}
	}

	getComponent() {
		if(this.props.hasLoaded) {
			return (
				this.props.children
				)
		} else {
			return (
				<p id="LoadingFirebase">Loading</p>
				)
		}
	}


	render() {

		const actions = [
			<FlatButton
				label="Cancel"
				primary={false}
				onTouchTap={() => this.handleClose(false)}
			/>,
			<FlatButton
				label="Ok"
				primary={true}
				keyboardFocused={true}
				onTouchTap={() => this.handleClose(true)}
			/>,
		];

		let iconStyle = {
			color: '#fff',
			marginTop: 10,
			marginRight: 10
		} 

		let iconElement = ()=> {
			if (this.props.params.device == null && this.props.params.dialogues == null) {
				return <br/>
			} else {
				return ! this.props.isUpdating ? <p style={{fontSize: ".8rem", marginTop:16, color:"#fff"}}>All saved</p> : <LoadIcon style={iconStyle} className="loadingIcon"/>;
			}
		}

		// Determine which device and thus which primary colour
		let primaryColor = () => {
			if ( this.props.hasLoaded )
				if ( this.props.params.device 
						&& this.props.allDevices )
					return { background: this.props.allDevices[this.props.params.device].color }
				else
					return { background: blueGrey700 }
		}

		const muiTheme = getMuiTheme({
			palette: {
				primary1Color: blueGrey700,
				primary2Color: blueGrey700,
				accent1Color: blue500,
				secondaryTextColor: blue500,
				textColor: blueGrey700,
				pickerHeaderColor: blueGrey700
			},
			appBar: {
				height: 50,
			}
		});


		return (

			<MuiThemeProvider muiTheme={muiTheme}>
				<div id="App">

					<AppBar id="AppBar" 
						style={primaryColor()}
						title={this.props.title}  
						iconElementRight={iconElement()} 
						iconElementLeft={this.props.icon ? <BackButton onTouchTap={this.onBackClicked.bind(this)}/> : null} 
					/>

					<div id="AppComponent">
						{ this.getComponent() }
					</div>
					
					<LoadingIndicator hasLoaded={this.props.hasLoaded}/>
					<NotificationBar hasUpdated={this.props.hasUpdated}/>
				
				</div>
			</MuiThemeProvider>
		)
	}
}