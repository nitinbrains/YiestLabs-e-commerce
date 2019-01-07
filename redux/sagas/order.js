import { take, call, put, cancelled, takeEvery, all, fork, select  } from 'redux-saga/effects';
import * as api from '../../services/order';
import { orderActions } from '../actions/orderActions';
import { messageActions } from '../actions/messageActions';

import {
    changeShippingOption,
    incrementItemDate,
    decrementItemDate,
    initOrder
} from './orderUtils';

const replace = (arr, newItem) => arr.map(
    (item) => item.Name === newItem.Name ? newItem : item
);



/****** Sagas logic ********/

export function * prepareOrder(action) {
    const { responseSuccess, responseFailure } = action;
    try {
        const cart = yield select(state => state.cart);
        const user = yield select(state => state.user);

        var { res: order, err } = yield call(api.prepareOrder, {
            calcShip: true,
            userID: user.id,
            shipMethod: user.shipmethod,
            items: cart.items
        });
        if (err) {
            throw err
        } else {
            yield put(responseSuccess(initOrder(order, user)));
        }
    } catch (error) {
        yield put(responseFailure(error));
        yield put(messageActions.showNetworkError(error))
    }
};


export function * setShippingOption(action) {
    const { responseSuccess, responseFailure, data: option } = action;
    try {
        var checkout = yield select(state => state.checkout);
        const user = yield select(state => state.user);

        const items = changeShippingOption(checkout, user, option);
        yield put(responseSuccess(option));
        yield put(orderActions.setItems({ items }));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

export function * incrementShipDate(action) {
    const { responseSuccess, responseFailure, data: item } = action;
    try {
        const checkout = yield select(state => state.checkout);
        const user = yield select(state => state.user);
        yield put(orderActions.setItems({ items: replace(
            checkout.items,
            incrementItemDate(checkout, user, item)
        )}));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

export function * decrementShipDate(action) {
    const { responseSuccess, responseFailure, data: item } = action;
    try {
        const checkout = yield select(state => state.checkout);
        const user = yield select(state => state.user);
        yield put(orderActions.setItems({ items: replace(
            checkout.items,
            decrementItemDate(checkout, user, item)
        )}));
    } catch (error) {
        yield put(responseFailure(error));
    }
}
