import React from 'react'
import {
    createStore,
    applyMiddleware,
    combineReducers,
    compose
} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from "redux-saga";
import { all } from 'redux-saga/effects';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 

//reducers
import { rootReducer } from './reducers';
import rootSaga from './sagas';

//reducers
// import userReducer from './reducers/user';
// import storeReducer from './reducers/store';
// import cartReducer from './reducers/cart';
// import checkoutReducer from './reducers/checkout';
// import messageReducer from './reducers/message';

// // single entry point to start all Sagas at once
// function* rootSaga() {
// 	yield all([
// 		userWatcher(),
// 		storeWatcher(),
// 		cartWatcher(),
// 		checkoutWatcher(),
// 		messageWatcher()
// 	])
// }

// const globalReducer = combineReducers({
//	user: userReducer,
// 	store: storeReducer,
// 	cart: cartReducer,
// 	checkout: checkoutReducer,
// 	message: messageReducer
// });

const sagaMiddleware = createSagaMiddleware();

const initializeStore = (initialState = initialState, isServer) => {

    const persistConfig = {
        key: 'root',
        storage,
        whitelist: ['cart']
    };
    const persistedReducer = isServer ? rootReducer : persistReducer(persistConfig, rootReducer);
    let store = createStore(
        persistedReducer,
        initialState,
        composeWithDevTools(
            applyMiddleware(thunk, sagaMiddleware)
        )
    );
    sagaMiddleware.run(rootSaga);
    return {
        store,
        persistor: isServer ? null : persistStore(store)
    }
}

const isServer = typeof window === 'undefined';
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

function getOrCreateStore (initialState) {
    // Always make a new store if server, otherwise state is shared between requests
    const { store, persistor } = initializeStore(initialState, isServer);
    if (isServer) {
    	return {
    		store, persistor
    	};
    } else if (!window[__NEXT_REDUX_STORE__]) {
        window[__NEXT_REDUX_STORE__] = store;
    }
    return {
    	store,
    	persistor
    };
}

export default (App) => {
    return class AppWithRedux extends React.Component {
        static async getInitialProps (appContext) {
            // Get or Create the store with `undefined` as initialState
            // This allows you to set a custom default initialState
            const { store, persistor } = getOrCreateStore()

            // Provide the store to getInitialProps of pages
            appContext.ctx.reduxStore = store

            let appProps = {}
            if (typeof App.getInitialProps === 'function') {
                appProps = await App.getInitialProps(appContext)
            }

            return {
                ...appProps,
                persistor,
                initialReduxState: store.getState()
            }
        }

        constructor (props) {
            super(props)
            const { store, persistor } = getOrCreateStore(props.initialReduxState);
            this.reduxStore = store;
            this.persistor = persistor;
        }

        render () {
            return <App {...this.props} reduxStore={this.reduxStore} persistor={this.persistor} />
        }
    }
}
