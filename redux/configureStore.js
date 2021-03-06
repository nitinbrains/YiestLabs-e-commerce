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
import { createLogger } from 'redux-logger'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 

//reducers
import { rootReducer } from './reducers';
import rootSaga from './sagas';

const middleware = [];
const sagaMiddleware = createSagaMiddleware();

middleware.push(sagaMiddleware);

if (process.env.NODE_ENV !== "production") {
    middleware.push(
      createLogger({
        collapsed: true
      })
    );
   }

const initializeStore = (initialState = initialState, isServer) => {

    const persistConfig = {
        key: 'root',
        storage,
        whitelist: ['user', 'cart']
    };
    const persistedReducer = isServer ? rootReducer : persistReducer(persistConfig, rootReducer);
    let store = createStore(
        persistedReducer,
        initialState,
        composeWithDevTools(
            applyMiddleware(thunk, ...middleware)
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
