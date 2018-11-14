import { put, select  } from 'redux-saga/effects';
import { messageActions } from '../actions/messageActions';

import Cart from '../../lib/Cart';

export function * addCartItem(action) {
    const { responseSuccess, responseFailure, data: { item, volIdIndex, quantity } } = action;
    try {
        const { message, items } = Cart.addItem(item, volIdIndex, quantity);
        if (message) {
            yield put(messageActions.displayMessage({ ...message }));
        }
        yield put(responseSuccess({ items }));
    } catch(error) {
        yield put(messageActions.displayMessage({ title: 'Error', error: error.message }));
        yield put(responseFailure(error));
    }
}

export function * removeCartItem(action) {
    const { responseSuccess, responseFailure, data: index } = action;
    try {
        const items = Cart.removeItem(index);
        yield put(responseSuccess({ items }));
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * updateCartItem(action) {
    const { responseSuccess, responseFailure, data: { index, quantity } } = action;
    try {
        const items = Cart.changeItemQuantity(index, quantity);
        yield put(responseSuccess({ items }));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

