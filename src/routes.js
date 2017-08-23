import React from 'react'
import {IndexRoute, Router, Route, hashHistory} from 'react-router'

import AppContainer from './components/containers/AppContainer'
import {Whoops404} from './components/Whoops404'
import DeviceEditorContainer from './components/containers/DeviceEditorContainer'
import DialogueEditorContainer from './components/containers/DialogueEditorContainer'
import Home from './components/containers/HomeContainer'
import DialogueListContainer from './components/containers/DialogueListContainer'
import ResponseVizContainer from './components/containers/ResponseVizContainer'
import StructureVizContainer from './components/containers/StructureVizContainer'


const routes = (
	<Router history={hashHistory}>
	
	<Route path="/" component = {AppContainer}>

		<IndexRoute component={Home} />

		<Route path="dialogues" component = {DialogueListContainer} />
		<Route path="dialogues/:dialogue/viz" component = {ResponseVizContainer} />
		<Route path="dialogues/:dialogue/structure" component = {StructureVizContainer} />
		<Route path="dialogues/:device/:dialogue/viz" component = {ResponseVizContainer} />
		<Route path="dialogues/:device/:dialogue" component = {DialogueEditorContainer} />
		<Route path="dialogues/:dialogue" component = {DialogueEditorContainer} />
		<Route path="devices/:device" component = {DeviceEditorContainer} />

		<Route path="*" component={Whoops404}/>
		
	</Route>

	</Router>
	)

export default routes 

