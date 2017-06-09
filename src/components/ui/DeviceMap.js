import { Component } from 'react'
import { GoogleMap, Marker, withGoogleMap, InfoWindow } from "react-google-maps";
import FlatButton from 'material-ui/FlatButton'
import { hashHistory } from 'react-router'
import DialoguePreview from './DialoguePreview'

import MoveIcon from 'material-ui/svg-icons/device/location-searching'
import PlayIcon from 'material-ui/svg-icons/av/play-arrow'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import ConfirmIcon from 'material-ui/svg-icons/navigation/check'


var paleMapStyle = [ { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#e9e9e9" }, { "lightness": 17 } ] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [ { "color": "#f5f5f5" }, { "lightness": 20 } ] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [ { "color": "#ffffff" }, { "lightness": 17 } ] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [ { "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 } ] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [ { "color": "#ffffff" }, { "lightness": 18 } ] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [ { "color": "#ffffff" }, { "lightness": 16 } ] }, { "featureType": "poi", "elementType": "geometry", "stylers": [ { "color": "#f5f5f5" }, { "lightness": 21 } ] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "color": "#dedede" }, { "lightness": 21 } ] }, { "elementType": "labels.text.stroke", "stylers": [ { "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 } ] }, { "elementType": "labels.text.fill", "stylers": [ { "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 } ] }, { "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] }, { "featureType": "transit", "elementType": "geometry", "stylers": [ { "color": "#f2f2f2" }, { "lightness": 19 } ] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [ { "color": "#fefefe" }, { "lightness": 20 } ] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [ { "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 } ] } ];


const GoogleMapComponent = withGoogleMap( props => {

	document.body.classList.add('googleMapped');

	let bounds = props.bounds;

	return(

		<GoogleMap
			ref={props.onMapLoad}
			defaultZoom={15}
			center={props.markers[0].position}
			onClick={props.onMapClick}
			defaultOptions={{ 
				styles: paleMapStyle, 
				disableDefaultUI: true,
				zoomControl: true,
				scrollwheel: false
			}}
		>
		{
			props.markers.map( (marker, index) => {

				let isCurrentMarker = props.currentMarker == marker;
				let draggable = isCurrentMarker && props.isDragging;
				let iconURL = "assets/images/pin-"+marker.color.toUpperCase().replace("#", "") + (draggable ? "-move" : "") +".png";

				var markerPos = new google.maps.LatLng(marker.position.lat, marker.position.lng);
				bounds.extend(markerPos);

				return (

					<Marker
						position = {markerPos}
						icon = {{
							url:  iconURL,
							scaledSize: new google.maps.Size(50, 68)
						}}
						ref= {isCurrentMarker ? props.onCurrentMarkerLoaded : null}
						draggable = {draggable}
						key = {index}
						defaultAnimation = "2"
						onClick = { () => props.onMarkerClick(marker) }
					>

						{ isCurrentMarker && props.isShowingInfo && (
							<InfoWindow
						  			onCloseClick={() => props.onMarkerClose(marker)}>
							    <div className="infowindow_content">
								  	<h2>{marker.name}</h2>
								  	<div className="infowindow_buttons">
									  	<FlatButton
									  			id="PlayButton"
									  			label="Play"
									  			labelPosition="before"
									  			onClick={ () => props.onPlayButtonClick(marker) }>
											<PlayIcon color="gray"/>
									    </FlatButton>
										<hr />
								  		<FlatButton
									  			id="EditButton"
									  			label="Edit"
									  			labelPosition="before"
									  			onClick={ () => hashHistory.push("/devices/"+marker.id) }>
											<EditIcon color="gray"/>
										</FlatButton>
										<hr />
									  	<FlatButton
									  			id="MoveButton"
									  			label="Move"
									  			labelPosition="before"
									  			onClick = { () => props.onMoveButtonClick(marker) }>
											<MoveIcon color="gray"/>
										</FlatButton>
								  	</div>
								</div>
							</InfoWindow>
						)}

					</Marker>
				)
			}

			)
		}
		</GoogleMap>

	)
});


export default class DeviceMap extends Component {

	constructor(props) {
		super(props);
	

		this.state = {
			currentMarker: null,
	        isPlayingDialogue: false,
	        isShowingInfo: false,
			isDraggingMarker: false
		};
	}   

	handleMapClick(event) {
		// Unused
	}

	handleMarkerClick(targetMarker) {
		// console.log("Opened the "+targetMarker.name+" infowindow")
		
		this.setState({
		    currentMarker: targetMarker,
		    isShowingInfo: true
	    });
	}

	handleMarkerClose(targetMarker) {
		this.setState({
		    currentMarker: null,
		    isShowingInfo: false
	    });
	}


	handlePlayButtonClick(targetMarker) {
		// console.log("Clicked on "+targetMarker.name+"'s play button")

		this.setState({
	        isPlayingDialogue: true
	    });
	}
	handlePlayCloseButtonClick() {

		// console.log("Clicked on "+this.state.currentMarker.name+"'s play close button")

		this.setState({
	        isPlayingDialogue: false
	    });
	}


	handleMoveButtonClick(targetMarker) {
		// console.log("Clicked on ", targetMarker.position)

		this.setState({
	        currentMarker: targetMarker,
		    isShowingInfo: false,
	        isDraggingMarker: true
	    });
	}


	handleMarkerConfirmMove() {
		var pos = this.markerComponent.getPosition();
		var lat = pos.lat();
		var lng = pos.lng();
		this.props.onChangeDevicePosition(this.state.currentMarker.id, lat,lng);

		this.setState({
	        currentMarker: null,
	        isDraggingMarker: false
	    });

	}


	getDialogues(device) {

		return Object.keys(device.dialogues).map(
			(val) => this.props.allDialogues[val] 
		);
	}


	onCurrentMarkerLoaded(markerComponent) {
		// console.log(markerComponent)
		this.markerComponent = markerComponent;
	}


	onMapLoad(mapElement) {
		console.log(mapElement)
		mapElement.fitBounds(this.bounds);
	}


	render() {

		var markers = [];
		for(var i in this.props.devices) {

			var device =  this.props.devices[i];
			markers.push(device);

		}
		
		this.bounds = new google.maps.LatLngBounds();

		return (
			<div id="DeviceMap-Map-Container">
				<GoogleMapComponent
					ref = "mygmap"
					containerElement = {
						<div style={{height:'100%'}} />
					}
					mapElement={
						<div style={{height:'100%'}} />
					}
					allCards={this.props.allCards}
					markers={markers}
					currentMarker={this.state.currentMarker}
					isShowingInfo = {this.state.isShowingInfo}
					isDragging = {this.state.isDraggingMarker}
					bounds = {this.bounds}
					onCurrentMarkerLoaded = {this.onCurrentMarkerLoaded.bind(this)}
					onMapClick={this.handleMapClick}
					onMarkerClick = { this.handleMarkerClick.bind(this) }
					onMarkerClose = { this.handleMarkerClose.bind(this) }
					onMoveButtonClick = { this.handleMoveButtonClick.bind(this) }
					onPlayButtonClick = { this.handlePlayButtonClick.bind(this) }
				/>
				{
					this.state.currentMarker && 
						<DialoguePreview 
							open={this.state.isPlayingDialogue} 
							allCards={this.props.allCards} 
							dialogues={this.getDialogues(this.state.currentMarker)} 
							onClosePreview={this.handlePlayCloseButtonClick.bind(this)} />
				}
				
				{
					this.state.isDraggingMarker &&
						<div id="DeviceMap-Map-Cover">
							<div id="DeviceMap-Map-Cover-Confirm">
								<p>Drag the pin where you'd like to move it.</p>
								<FlatButton
							  			id="ConfirmMoveButton"
							  			label="Confirm"
							  			labelPosition="before"
							  			secondary={true}
							  			onClick={ this.handleMarkerConfirmMove.bind(this) }>
									<ConfirmIcon color="#2196F3" />
								</FlatButton>
							</div>
						</div>
				}
			</div>
		);
	}
}