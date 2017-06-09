import { Component } from "react";
import { List, ListItem } from "material-ui/List";
import { Link } from "react-router";
import update from "immutability-helper";
import TextField from "material-ui/TextField";

import IconButton from "material-ui/IconButton";
import FlatButton from "material-ui/FlatButton";
import EditIcon from "material-ui/svg-icons/image/edit";
import DeleteIcon from "material-ui/svg-icons/navigation/close";
import PinIcon from "material-ui/svg-icons/communication/location-on";
import DragIcon from "material-ui/svg-icons/editor/drag-handle";
import PreviewIcon from "material-ui/svg-icons/av/play-arrow";
import DataIcon from "material-ui/svg-icons/av/equalizer";

import DialoguePreview from "./DialoguePreview";
import NewDialoguePrompt from "./NewDialoguePrompt";
import Dialog from "material-ui/Dialog";

import RaisedButton from "material-ui/RaisedButton";
import { lightBlue500 } from "material-ui/styles/colors";

import {
	SortableContainer,
	SortableElement,
	SortableHandle,
	arrayMove
} from "react-sortable-hoc";


const OFFLINE_TRESHOLD = 100000;
class DeviceEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			existingDialoguePrompt: false,
			renamingDialogue: null,
			renamePrompt: false,
			online: false,
			previewPrompt: false
		};
		
		this.setOnlineStatus = this.setOnlineStatus.bind(this);
		this.onlineStatusChanged = this.onlineStatusChanged.bind(this);
		this.checkOnlineInterval =0;
	}

	componentDidMount() {
		// establish a realtime connection to detect changes of online status in devices
		this.stopListening();
		this.checkOnlineInterval = setInterval(this.setOnlineStatus, 3000);
		console.log('/devices/'+this.props.device.id+"/lastScreenChanged")
		window.database.ref('/devices/'+this.props.device.id+"/lastScreenChanged").on('value', this.onlineStatusChanged)	
	}

	componentWillUnmount() {
		clearInterval(this.checkOnlineInterval);
		this.stopListening();
	}

	stopListening() {
		window.database.ref('/devices/'+this.props.device.id).off('child_changed', this.onlineStatusChanged)	
	}

	setOnlineStatus() {
		let isOnline  = this.lastChanged ? (new Date() -  this.lastChanged < OFFLINE_TRESHOLD ) : false;
		console.log("last screen changed on device",this.lastChanged)
		if(isOnline != this.state.online) {
			this.setState({
				online: isOnline
			})
		}

	}
	onlineStatusChanged(s) {
		this.lastChanged = new Date(s.val());
		console.log(s.val())
		this.setOnlineStatus();
		console.log(this.lastChanged)
	}

	onSortEnd({ oldIndex, newIndex }) {
		var dialoguesArray = Object.keys(this.props.dialogues).map((key)=> {
			// make a copy
			return Object.assign({}, this.props.dialogues[key]);
		})

		// ensure dialogues are esorted by order
		dialoguesArray.sort((a,b)=>(a.order-b.order));
		
		// remove moved dialogue
		var d = dialoguesArray.splice(oldIndex, 1);

		// add moved dialogue in new position
		dialoguesArray.splice(newIndex, 0, d[0]);

		// create new dialogues object
		var newDialogues = {};
		for (var i = 0; i < dialoguesArray.length; i++) {
			dialoguesArray[i].order = i;
			newDialogues[dialoguesArray[i].id] = dialoguesArray[i]; 
		}
		this.props.onChangeDialoguesOrder(newDialogues);

	}

	onRenamedDialogue() {		
		
		const title = this.refs["renameTextField"].input.value;
		this.props.onRenameDialogue(this.state.renamingDialogue, title);
		this.setState({
			renamingDialogue: null,
			renamePrompt: false
		});

	}

	onChosenDialogue(dialogueId) {

		// set the order of the new dialogue
		let newOrder = this.props.dialogues.length;
		
		// if the device is new it may not have dialogues set up, in that case create an empty object first
		if (this.props.device.dialogues == null) this.props.device.dialogues = {};

		this.props.onChangeDialoguesOrder(
			update(this.props.device.dialogues, {
				[dialogueId]: { $set: { id: dialogueId, order: newOrder } }
			})
			);

		this.setState({
			existingDialoguePrompt: false
		});
	}

	onClosePreview() {
		this.setState({
			previewPrompt: false,
			previewedDialogue: null
		});
	}

	onPreviewDialogue(dialogue) {
		this.setState({
			previewPrompt: true,
			previewedDialogue: dialogue
		});
	}

	onRenameDialogue(dialogue) {
		this.setState({
			renamePrompt: true,
			renamingDialogue: dialogue
		});
	}

	onCloseEdit() {
		this.setState({
			renamePrompt: false,
			renamingDialogue: null
		});
	}


	render() {
		const props = this.props;

		let dialogues = props.dialogues;
		let deviceDialoguesList;
		let dialoguePrompt;

		let getCancelButton = (key) => (
			<FlatButton
			label="Cancel"
			secondary={true}
			onTouchTap={()=> {
				this.setState({ [key]: false })
			}}
			/>
			)


		if (dialogues.length == 0) {
			deviceDialoguesList = <p>There are no dialogues on this device</p>;
		} else {

			const DragHandle = SortableHandle(() => (
				<div className="handle"><DragIcon /></div>
				));

			const SortableItem = SortableElement(({ dialogue }) => {
				return (
					<li className="ListItem">
					<DragHandle />
					<Link
					style={{ marginLeft: 10 }}
					activeClassName="active"
					to={
						"/dialogues/" +
						props.device.id +
						"/" +
						dialogue.id
					}
					>
					{dialogue.title}
					</Link>
					<div className="ignoreHandle buttons">
					<EditIcon
					onTouchTap={()=>this.onRenameDialogue(dialogue)}
					/>
					<DeleteIcon
					onTouchTap={() =>
						this.props.onDeleteDialogueFromDevice(dialogue.id)}
						/>
						<PreviewIcon
						onTouchTap={() =>
							this.onPreviewDialogue(dialogue)}
							/>
							<Link	
							to={
								"/dialogues/" +dialogue.id+"/viz"
							}
							>
							<DataIcon/>
							</Link>

							</div>
							</li>
							);
			});

			const SortableList = SortableContainer(({ items }) => {
				return (
					<ul className="List">
					{items.map((dialogue, index) => (
						<SortableItem
						key={`item-${index}`}
						index={index}
						dialogue={dialogue}
						/>
						))}
					</ul>
					);
			});

			deviceDialoguesList = (
				<div className="PinContentList">
				<SortableList
				items={dialogues}
				onSortEnd={this.onSortEnd.bind(this)}
				lockAxis="y"
				useDragHandle={true}
				/>
				</div>
				);
		}

		if (!props.allDialogues) {
			dialoguePrompt = <br />;
		} else {
			
			const allDialogues = Object.keys(props.allDialogues).map(d => {
				return props.allDialogues[d];
			});

			dialoguePrompt = (
				<div className="AddExistingDialogue">
				
				<FlatButton
				label="Add existing dialogue"
				secondary={true}
				onTouchTap={() =>
					setTimeout(
						() =>
						this.setState({
							existingDialoguePrompt: true
						}),
						200
						)}
					/>

					<Dialog
					title="Select a dialogue"
					modal={true}
					open={this.state.existingDialoguePrompt}
					actions={[getCancelButton("existingDialoguePrompt")]}
					autoScrollBodyContent={true}
					>

					<div className="AllDialoguesList">
					<List>
					{allDialogues.map((dialogue, i) => (
						<ListItem
						primaryText={dialogue.title}
						key={i}
						onClick={() => this.onChosenDialogue(dialogue.id)}
						/>
						))}
					</List>
					</div>
					</Dialog>
					</div>
					);
		}

		return (
			<div id="DialogueAdmin">

			<div id="DialogueAdminHeader">
			<div className="DialogueAdminDescript">
			<h2>Content on this pin</h2>
			<p>Drag items to change their order</p>
			</div>
			<div>
			<RaisedButton
			id="PushToDeviceButton"
			primary={true}
			disabled = {!this.state.online}
			onClick={this.props.onRefreshDevice}
			label={this.state.online ? "Update this pin" : "pin is offline"}
			/>
			</div>
			</div>
			
			{deviceDialoguesList}

			<div className="BottomButtonContainer">
			{dialoguePrompt}
			<DialoguePreview
			open={this.state.previewPrompt}
			allCards={this.props.allCards}
			dialogues={[this.state.previewedDialogue]}
			onClosePreview={this.onClosePreview.bind(this)}
			/>
			<NewDialoguePrompt
			{...this.props}
			onSubmit={this.props.onAddNewDialogue}
			/>
			</div>

			<Dialog
			title="Rename dialogue"
			modal={true}
			open={this.state.renamePrompt}
			actions={[
				getCancelButton("renamePrompt"),
				<FlatButton
				label="Submit"
				primary={true}
				onTouchTap={this.onRenamedDialogue.bind(this)}
				/>
				]}
				>

				<TextField hintText="Hint Text" defaultValue={this.state.renamingDialogue ? this.state.renamingDialogue.title : ""} ref="renameTextField" />

				</Dialog>
				</div>
				);
	}
}
export default DeviceEditor;
