import React from 'react'
import {
	createStore,
	applyMiddleware,
	combineReducers,
	compose
} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from "redux-saga";
import { all } from 'redux-saga/effects'

//actions
import {
	loginWatcher,
	inventoryWatcher, 
	cartWatcher
} from './index';

//reducers
import userReducer from './reducers/user';
import inventoryReducer from './reducers/inventory';
import cartReducer from './reducers/cart';

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
function* rootSaga() {
	yield all([
		loginWatcher(),
		inventoryWatcher(),
		cartWatcher()
	])
}

const globalReducer = combineReducers({
	user: userReducer,
	inventory: inventoryReducer,
	cart: cartReducer
});

const sagaMiddleware = createSagaMiddleware();

function initializeStore (initialState = initialState) {
	let store = createStore(globalReducer, initialState, composeWithDevTools(applyMiddleware(sagaMiddleware)));
	sagaMiddleware.run(rootSaga);
	return store; 
}

const isServer = typeof window === 'undefined'
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

function getOrCreateStore (initialState) {
	// Always make a new store if server, otherwise state is shared between requests
	if (isServer) {
		return initializeStore(initialState)
	}

	// Create store if unavailable on the client and set it on the window object
	if (!window[__NEXT_REDUX_STORE__]) {
		window[__NEXT_REDUX_STORE__] = initializeStore(initialState)
	}
	return window[__NEXT_REDUX_STORE__]
}

export default (App) => {
	return class AppWithRedux extends React.Component {
		static async getInitialProps (appContext) {
			// Get or Create the store with `undefined` as initialState
			// This allows you to set a custom default initialState
			const reduxStore = getOrCreateStore()

			// Provide the store to getInitialProps of pages
			appContext.ctx.reduxStore = reduxStore

			let appProps = {}
			if (typeof App.getInitialProps === 'function') {
				appProps = await App.getInitialProps(appContext)
			}

			return {
				...appProps,
				initialReduxState: reduxStore.getState()
			}
		}

		constructor (props) {
			super(props)
			this.reduxStore = getOrCreateStore(props.initialReduxState)
		}

		render () {
			return <App {...this.props} reduxStore={this.reduxStore} />
		}
	}
}
