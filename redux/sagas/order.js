import { call, put  } from 'redux-saga/effects'
import * as api from '../../services/order';

import Checkout from '../../lib/Checkout';
import User from '../../lib/User';


export function * prepareOrder(action) {
    const { responseSuccess, responseFailure } = action;

    try {
        const cart = Cart.getCart();
        const user = User.getUser();
        
        const { res: order, error } = yield call(api.prepareOrder, {
            calcShip: true,
            userId: user.id,
            shipMethod: user.shipMethod,
            items: cart.items
        });

        if (error) {
            yield put(responseFailure(error));
        } else {
            Checkout.initOrder(order, user);
            yield put(responseSuccess(order));
        }    
    } catch (error) {
        yield put(responseFailure(error));
    }
};
