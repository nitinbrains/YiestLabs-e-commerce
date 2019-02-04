import { put, select  } from 'redux-saga/effects';
import { messageActions } from '../actions/messageActions';
import cartSelectors from '../selectors/cart.js';

import {
    addToCart,
    changeItemQuantity
} from '../../lib/CartUtils';

export function * addCartItem(action) {
    const { responseSuccess, responseFailure, data: { cartItem } } = action;
    try {
        const items = yield select(cartSelectors.items);
        addToCart(items, cartItem);
        yield put(responseSuccess({ items }));
    } catch(error) {
        yield put(messageActions.displayMessage({ title: 'Error', error: error.message }));
        yield put(responseFailure(error));
    }
}

export function * removeCartItem(action) {
    const { responseSuccess, responseFailure, data: index } = action;
    try {
        const items = yield select(state => state.cart.items);
        items.splice(index, 1);
        yield put(responseSuccess({ items }));
    } catch(error) {
        if(error.status){
            yield put(messageActions.showNetworkError({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            yield put(messageActions.showNetworkError({ title: 'Error', error: error.message, variant:'error' }));        
            // yield put(messageActions.displayMessage({ title: 'Error', error: error.message }));        
        }
        yield put(responseFailure(error));
    }
}

export function * updateCartItem(action) {
    const { responseSuccess, responseFailure, data: { index, quantity } } = action;
    var items = yield select(state => state.cart.items);
    try {
        changeItemQuantity(items, index, quantity);
        yield put(responseSuccess({ items }));
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
