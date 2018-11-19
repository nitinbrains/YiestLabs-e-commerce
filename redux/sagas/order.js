import { call, put  } from 'redux-saga/effects'
import * as api from '../../services/order';
import { orderActions } from '../actions/orderActions';

import Checkout from '../../lib/Checkout';
import Cart from '../../lib/Cart';
import User from '../../lib/User';


export function * prepareOrder(action) {
    const { responseSuccess, responseFailure } = action;
    try {
        const cart = Cart.getCart();
        const user = User.getUser();
        var { res: order, error } = yield call(api.prepareOrder, {
            calcShip: true,
            userId: user.id,
            shipMethod: user.shipMethod,
            items: cart.items
        });

        if (error) {
            yield put(responseFailure(error));
        } else {
            order = Checkout.initOrder(order, user);
            yield put(responseSuccess(order));
        }
    } catch (error) {
        yield put(responseFailure(error));
    }
};


export function * setShippingOption(action) {
    const { responseSuccess, responseFailure, data: option } = action;
    try {
        Checkout.setShippingOption(option);
        const items = Checkout.getItems();
        yield put(responseSuccess(option));
        yield put(order.setItems({ items }));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

export function * incrementShipDate(action) {
    const { responseSuccess, responseFailure, data: item } = action;
    try {
        Checkout.incrementItemDate(option);
        yield put(order.setItems({ items: Checkout.getItems() }));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

export function * decrementShipDate(action) {
    const { responseSuccess, responseFailure, data: item } = action;
    try {
        Checkout.decrementItemDate(item);
        Checkout.incrementItemDate(option);
        yield put(order.setItems({ items: Checkout.getItems() }));
    } catch (error) {
        yield put(responseFailure(error));
    }
}
