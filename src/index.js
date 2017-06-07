
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import * as firebase from 'firebase'
import update from 'immutability-helper'
import injectTapEventPlugin from 'react-tap-event-plugin';

import storeFactory from './store'
import routes from './routes'
import {changeCard} from './actions'
import {dialogues} from './store/reducers'
import C from './constants'
import {getData} from './actions'
import './stylesheets/ui.scss'


injectTapEventPlugin()


const store = storeFactory({isUpdating:true});

// TODO this shouldn't be global :)
window.store = store;
window.DEBUG = false;
window.React = React;



const initDatabase = () => {

	const FIREBASECONFIG = {
		apiKey: "AIzaSyA7UKA-SJUE5zeNSuC6ghzZAwpiMhIZpaA",
		authDomain: "pinsight-cf45d.firebaseapp.com",
		databaseURL: "https://pinsight-cf45d.firebaseio.com/",
		storageBucket: 'gs://pinsight-cf45d.appspot.com'
	};
	firebase.initializeApp(FIREBASECONFIG)

	// TODO this shouldn't be global :)
	window.database = firebase.database()
	window.storage = firebase.storage()

	store.dispatch(getData());

	// TODO CAN
	// list all the responses of dialogue 0
	// https://firebase.google.com/docs/reference/js/firebase.database.Query#ref
	


}



initDatabase();



render(
	<Provider store={store}>
	{routes}
	</Provider>
	,
	document.getElementById('react-container')
	)