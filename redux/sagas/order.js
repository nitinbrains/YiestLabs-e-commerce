import { take, call, put, cancelled, takeEvery, all, fork, select  } from 'redux-saga/effects';

import * as api from 'services/';
import { orderActions } from 'appRedux/actions/orderActions';
import { cartActions } from 'appRedux/actions/cartActions';
import { messageActions } from 'appRedux/actions/messageActions';

import {
    changeShippingOption,
    incrementItemDate,
    decrementItemDate,
    initOrder,
    validateOrder
} from 'lib/OrderUtils';

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
            user: { id: user.id },
            items: cart.items
        });
        if (error) {
            throw error
        } else {
            yield put(responseSuccess(initOrder(order, user, cart)));
        }
    } catch (error) {
        if(error.status){
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            if(error.code == 0 ){
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showSnackbar({ title: 'Yeastman', message: error.message, variant:'error' }));
            } else if(error.code == -1){
                // Other error when we have error with code == -1
                yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));
            }
        }
        yield put(responseFailure(error));
    }
};

export function * placeOrder(action) {
    const { responseSuccess, responseFailure } = action;
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
            yield put(responseSuccess());
            yield put(cartActions.clearCart());
        }
    } catch (error) {
        if(error.status){
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            if(error.code == 0 ){
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showSnackbar({ title: 'Yeastman', message: error.message, variant:'error' }));
            } else if(error.code == -1){
                // Other error when we have error with code == -1
                yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));
            }
        }
        yield put(responseFailure(error));
    }
}

export function * resetOrder(action) {
    const { responseSuccess, responseFailure } = action;
    try {
        yield put(responseSuccess());
    } catch (error) {
        if(error.status){
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            if(error.code == 0 ){
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showSnackbar({ title: 'Yeastman', message: error.message, variant:'error' }));
            } else if(error.code == -1){
                // Other error when we have error with code == -1
                yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));
            }
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
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            if(error.code == 0 ){
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showSnackbar({ title: 'Yeastman', message: error.message, variant:'error' }));
            } else if(error.code == -1){
                // Other error when we have error with code == -1
                yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));
            }
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
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            if(error.code == 0 ){
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showSnackbar({ title: 'Yeastman', message: error.message, variant:'error' }));
            } else if(error.code == -1){
                // Other error when we have error with code == -1
                yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));
            }
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
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            if(error.code == 0 ){
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showSnackbar({ title: 'Yeastman', message: error.message, variant:'error' }));
            } else if(error.code == -1){
                // Other error when we have error with code == -1
                yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));
            }
        }
        yield put(responseFailure(error));
    }
}
