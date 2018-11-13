import { put, call } from 'redux-saga/effects';
import User from '../../lib/User';

import { userTypes } from '../actions/userActions';
import { messageActions } from '../actions/messageActions';
import * as api from '../../services/users';

export function * loginUser (action) {
    const { responseSuccess, responseFailure, data: { username, password } } = action;
    try {
        const { res: userId } = yield call(api.login, username, password);
        const { res: userInfo } = yield call(api.getUserInfo, userId);
        yield put(responseSuccess(User.setUser(userInfo)));
        yield put(messageActions.displayMessage({
            title: 'Authorization',
            message: 'You have successfully logged in!'
        }));

    } catch (err) {
        yield put(responseFailure(err));
    }
};

export function * setUserInfo (action) {
    const { responseSuccess, data: { userInfo } } = action;
    User.setUser(userInfo);
}

export function * setCreditCard(action) {
    const { responseSuccess, responseFailure, data } = action;
    try {
        yield put(responseSuccess(User.setCreditCard(data)));
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * addCreditCard(action) {
    const { responseSuccess, responseFailure, data: card } = action;

    try {
        const { cards, creditCard } = User.addCreditCard(card);
        yield put(responseSuccess({ cards, creditCard }));
    } catch(error) {
        yield put(responseFailure(err));
    }
}

export function * setShipMethod(action) {
    const { responseSuccess, responseFailure, data: { shipmethod } } = action;
    try {
        yield put(responseSuccess(User.setShipMethod(shipmethod)));
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * setShipAddress(action) {
    const { responseSuccess, responseFailure, data: { index } } = action;
    try {
        yield put(responseSuccess(User.setShipAddress(index)));
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * addShipAddress(action) {
    const { responseSuccess, responseFailure, data: { address } } = action;
    try {
        const { otherAddresses, shipping } = User.addShipAddress(address);
        yield put(responseSuccess({ otherAddresses, shipping }));
    } catch(error) {
        yield put(responseFailure(err));
    }
}

export function * setBillAddress(action) {
    const { responseSuccess, responseFailure, data } = action;
    try {
        yield put(responseSuccess(User.setBillAddress(data)));
    } catch(error) {
        yield put(responseFailure(err));
    }
}

export function * addBillAddress(action) {
    const { responseSuccess, responseFailure, data: address } = action;
    try {
        const { otherAddresses, billing } = User.addBillAddress(address);
        yield put(responseSuccess({ otherAddresses, billing }));
    } catch(error) {
        yield put(responseFailure(err));
    }
}
