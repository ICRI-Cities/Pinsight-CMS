import { Component } from "react";
import { List, ListItem } from "material-ui/List";
import { Link } from "react-router";
import update from "immutability-helper";
import Paper from "material-ui/Paper";

import IconButton from "material-ui/IconButton";
import FlatButton from "material-ui/FlatButton";
import EditIcon from "material-ui/svg-icons/image/edit";
import DeleteIcon from "material-ui/svg-icons/navigation/close";
import PinIcon from "material-ui/svg-icons/communication/location-on";
import DragIcon from "material-ui/svg-icons/editor/drag-handle";
import PreviewIcon from "material-ui/svg-icons/av/play-arrow";

import DialoguePreview from "./DialoguePreview";
import NewDialoguePrompt from "./NewDialoguePrompt";
import Dialog from "material-ui/Dialog";

import RaisedButton from "material-ui/RaisedButton";
import { blue500 } from "material-ui/styles/colors";

import {
	SortableContainer,
	SortableElement,
	SortableHandle,
	arrayMove
} from "react-sortable-hoc";

class DeviceEditor extends Component {
	constructor(props) {
		super(props);

		this.state = {
			existingDialoguePrompt: false,
			previewPromptOpen: false,
			snackbarOpen: false
		};
	}

	onLeave(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		console.log(e);
	}

	onEnd(evt) {
		evt.preventDefault();
		evt.stopPropagation();
	}

	onSortEnd({ oldIndex, newIndex }) {
		console.log(oldIndex, newIndex)
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
		this.props.onChangeDialogues(newDialogues);

	}

	onChosenDialogue(dialogueId) {

		// set the order of the new dialogue
		let newOrder = this.props.dialogues.length;
		
		// if the device is new it may not have dialogues set up, in that case create an empty object first
		if (this.props.device.dialogues == null) this.props.device.dialogues = {};

		this.props.onChangeDialogues(
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
			previewPromptOpen: false,
			previewedDialogue: null
		});
	}

	onPreviewDialogue(dialogue) {
		this.setState({
			previewPromptOpen: true,
			previewedDialogue: dialogue
		});
	}

	onEditDialogue(dialogue) {
		this.setState({
			editPromptOpen: true,
			editedDialogue: dialogue
		});
	}

	onCloseEdit() {
		this.setState({
			editPromptOpen: false,
			editedDialogue: null
		});
	}


	render() {
		const props = this.props;

		let dialogues = props.dialogues;
		let deviceDialoguesList;
		let dialoguePrompt;

		if (!props.device.dialogues) {
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
							style={{ fontSize: ".8rem", marginLeft: 10 }}
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
								onTouchTap={this.onEditDialogue.bind(this)}
							/>
							<DeleteIcon
								onTouchTap={() =>
									this.props.onDeleteDialogueFromDevice(dialogue.id)}
							/>
							<PreviewIcon
								onTouchTap={() =>
									this.onPreviewDialogue(dialogue)}
							/>

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
			const actions = [
				<FlatButton
					label="Cancel"
					secondary={true}
					onTouchTap={() =>
						this.setState({ existingDialoguePrompt: false })}
				/>
			];

			dialoguePrompt = (
				<div className="AddExistingDialogue">
					<FlatButton
						label="Add existing dialogue"
						labelColor={blue500}
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
						actions={actions}
						autoScrollBodyContent={true}
					>
						<div className="AllDialoguesList">
							<List>
								{allDialogues.map((dialogue, i) => (
									<ListItem
										primaryText={dialogue.title}
										key={i}
										onClick={() =>
											this.onChosenDialogue(dialogue.id)}
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
					<RaisedButton
						id="PushToDeviceButton"
						labelColor="#fff"
						backgroundColor={blue500}
						onClick={this.props.onRefreshDevice}
						label="Update this pin"
					/>
				</div>
				{deviceDialoguesList}

				<div className="BottomButtonContainer">
					{dialoguePrompt}
					<DialoguePreview
						open={this.state.previewPromptOpen}
						allCards={this.props.allCards}
						dialogues={[this.state.previewedDialogue]}
						onClosePreview={this.onClosePreview.bind(this)}
					/>
					<NewDialoguePrompt
						{...this.props}
						onSubmit={this.props.onAddNewDialogue}
					/>
				</div>
			</div>
		);
	}
}
export default DeviceEditor;
