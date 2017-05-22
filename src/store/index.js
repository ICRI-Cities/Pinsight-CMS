import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import C from '../constants'
import appReducer from './reducers'


const consoleMessages = store => next => action => {

	let result

	console.groupCollapsed(`dispatching action => ${action.type}`)
	console.log(action)
	console.log(store.getState())
	console.groupEnd()
	result = next(action);
	
	return result

}

export default (initialState={}) => {
	return applyMiddleware(thunkMiddleware,consoleMessages)(createStore)(appReducer, initialState)
}



