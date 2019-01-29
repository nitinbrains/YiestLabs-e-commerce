import { take, call, put, cancelled, takeEvery, all, fork, select  } from 'redux-saga/effects';
import * as api from '../../services/';
import { orderActions } from '../actions/orderActions';
import { messageActions } from '../actions/messageActions';

import {
    changeShippingOption,
    incrementItemDate,
    decrementItemDate,
    initOrder,
    validateOrder
} from './OrderUtils';

const replace = (arr, newItem) => arr.map(
    (item) => item.Name === newItem.Name ? newItem : item
);

/****** Sagas logic ********/

export function * prepareOrder(action) {
    const { responseSuccess, responseFailure } = action;
    try {
        const cart = yield select(state => state.cart);
        const user = yield select(state => state.user);

        var { res: order, error } = yield call(api.prepareOrder, {
            calcShip: true,
            user: user,
            items: cart.items
        });
        if (error) {
            throw error
        } else {
            yield put(responseSuccess(initOrder(order, user)));
        }
    } catch (error) {
        if(error.status){
            yield put(messageActions.showNetworkError({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            yield put(messageActions.showNetworkError({ title: 'Error', error: error.message, variant:'error' }));        
            // yield put(messageActions.displayMessage({ title: 'Error', error: error.message }));        
        }
        yield put(responseFailure(error));
    }
};

export function * placeOrder(action) {
    const { responseSuccess, responseFailure, data: option } = action;
    try {
        var order = yield select(state => state.order);
        const user = yield select(state => state.user);

        var request = validateOrder(order, user);
        var { res: order, error } = yield call(api.placeOrder, {
            request
        });

        if (error) {
            throw error
        } else {
            yield put(responseSuccess(initOrder(order, user)));
        }
    } catch (error) {
        if(error.status){
            yield put(messageActions.showNetworkError({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            yield put(messageActions.showNetworkError({ title: 'Error', error: error.message, variant:'error' }));        
            // yield put(messageActions.displayMessage({ title: 'Error', error: error.message }));        
        }
        yield put(responseFailure(error));
    }
}

export function * setShippingOption(action) {
    const { responseSuccess, responseFailure, data: option } = action;
    try {
        var order = yield select(state => state.order);
        const user = yield select(state => state.user);

        const items = changeShippingOption(order, user, option);
        yield put(responseSuccess(option));
        yield put(orderActions.setItems({ items }));
    } catch (error) {
        if(error.status){
            yield put(messageActions.showNetworkError({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            yield put(messageActions.showNetworkError({ title: 'Error', error: error.message, variant:'error' }));        
            // yield put(messageActions.displayMessage({ title: 'Error', error: error.message }));        
        }
        yield put(responseFailure(error));
    }
}

export function * incrementShipDate(action) {
    const { responseSuccess, responseFailure, data: item } = action;
    try {
        const order = yield select(state => state.order);
        const user = yield select(state => state.user);
        yield put(orderActions.setItems({ items: replace(
            order.items,
            incrementItemDate(order, user, item)
        )}));
    } catch (error) {
        if(error.status){
            yield put(messageActions.showNetworkError({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            yield put(messageActions.showNetworkError({ title: 'Error', error: error.message, variant:'error' }));        
            // yield put(messageActions.displayMessage({ title: 'Error', error: error.message }));        
        }
        yield put(responseFailure(error));
    }
}

export function * decrementShipDate(action) {
    const { responseSuccess, responseFailure, data: item } = action;
    try {
        const order = yield select(state => state.order);
        const user = yield select(state => state.user);
        yield put(orderActions.setItems({ items: replace(
            order.items,
            decrementItemDate(order, user, item)
        )}));
    } catch (error) {
        if(error.status){
            yield put(messageActions.showNetworkError({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            yield put(messageActions.showNetworkError({ title: 'Error', error: error.message, variant:'error' }));        
            // yield put(messageActions.displayMessage({ title: 'Error', error: error.message }));        
        }
        yield put(responseFailure(error));
    }
}
