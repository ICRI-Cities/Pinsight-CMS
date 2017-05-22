import React from 'react'
import {IndexRoute, Router, Route, hashHistory} from 'react-router'

import AppContainer from './components/containers/AppContainer'
import {Whoops404} from './components/Whoops404'
import DeviceEditorContainer from './components/containers/DeviceEditorContainer'
import DialogueEditorContainer from './components/containers/DialogueEditorContainer'
import Home from './components/containers/HomeContainer'


const routes = (
	<Router history={hashHistory}>
	<Route path="/" component = {AppContainer}>

		<IndexRoute component={Home} />

		<Route path="dialogues/:device/:dialogue" component = {DialogueEditorContainer} />
		<Route path="devices/:device" component = {DeviceEditorContainer} />

		<Route path="*" component={Whoops404}/>
		
	</Route>
	</Router>
	)

export default routes 

