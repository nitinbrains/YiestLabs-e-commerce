import { take, call, put, cancelled, takeEvery, takeLatest, all, fork, select  } from 'redux-saga/effects'
import axios from 'axios'

// custom
import { host } from '../../config.server'
import Utils from '../../lib/Utils';
import User from '../../lib/User';

function* setUserInfo(action) {
    const { UserInfo } = action;
    User.setUser(UserInfo);
    UserInfo.shipMethods = User.getShipMethods();
    yield put({type: "USER_INFO", UserInfo });
}

function* setCreditCard(action) {
    const { card } = action;

    try {
        User.setCreditCard(card);
        const user = User.getUser();
        yield put({type: "CREDIT_CARD", card});
    } catch(err) {
        yield put({ type: "THROW_ERROR", err });
    }

}

function* setShipMethod(action) {
    try {
        const { shipmethod } = action;
        User.setShipMethod(shipmethod);
        yield put({type: "SHIP_METHOD", shipmethod});
    } catch(err) {
        yield put({ type: "THROW_ERROR", err });
    }
}

function* setShipAddress(action) {
    const { index } = action;

    try {
        var address = User.setShipAddress(index);
        yield put({type: 'SHIP_ADDRESS', address});
    } catch(err) {
        yield put({ type: "THROW_ERROR", err });
    }
}

function* setBillAddress(action) {
    const { index } = action;

    try {
        var address = User.setBillAddress(index);
        yield put({type: 'BILL_ADDRESS', address});
    } catch(err) {
        yield put({ type: "THROW_ERROR", error });
    }
}

function fetchUserInfo(userId) {
    return axios.post(`${host}/get-user-info`, {userId})
    .then(result => {
        if(result.data.error) throw result.data.error;
        return {UserInfo: result.data}
    })
    .catch(error => {
        return {error};
    });
}

function fetchUserID(username, password) {
    return axios.post(`${host}/get-user-id`, {username, password})
    .then(result => {
        if(result.data.error) throw result.data.error;
        return fetchUserInfo(result.data);
    })
    .then(UserInfo => UserInfo)
    .catch(error => {
        return {error};
    });
}

function* authorize(action) {
    const {username, password} = action;
    const {error, UserInfo} = yield call(fetchUserID, username, password);

    if (error)
        yield put({type: "THROW_ERROR", error});
    else {

        yield put({type: "HIDE_ERROR"});
        yield put({type: "LOGIN_SUCCESS", username, password});
        yield call(setUserInfo, UserInfo);

    }
}

function* userInfoWatcher() {
    yield takeEvery("SET_USER_INFO", setUserInfo);
}

function* loginWatcher() {
    yield takeEvery("LOGIN_REQUEST", authorize);
}

function* creditCardWatcher() {
    yield takeEvery("SET_CREDIT_CARD", setCreditCard);
}

function* shippingMethodWatcher() {
    yield takeEvery("SET_SHIP_METHOD", setShipMethod);
}

function* shippingAddressWatcher() {
    yield takeEvery("SET_SHIP_ADDRESS", setShipAddress);
}

function* billingAddressWatcher() {
    yield takeEvery("SET_BILL_ADDRESS", setBillAddress);
}

export function* userWatcher(){
    yield all([
        loginWatcher(),
        userInfoWatcher(),
        creditCardWatcher(),
        shippingMethodWatcher(),
        shippingAddressWatcher(),
        billingAddressWatcher()
    ])
}
