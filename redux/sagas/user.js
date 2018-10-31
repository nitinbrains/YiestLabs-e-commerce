import { take, call, put, cancelled, takeEvery, takeLatest, all, fork, select  } from 'redux-saga/effects'
import axios from 'axios'

// custom
import { host } from '../../config.server'
import Utils from '../../lib/Utils';
import User from '../../lib/User';

function* setUserInfo(action) {
    var { UserInfo } = action;
    UserInfo = User.setUser(UserInfo);
    yield put({type: "USER_INFO", UserInfo });
}

function* setCreditCard(action) {
    const { index } = action;

    try {
        var creditCard = User.setCreditCard(index);
        yield put({type: "CREDIT_CARD", creditCard});
    } catch(error) {
        yield put({ type: "SHOW_ERROR", error });
    }

}

function* setShipMethod(action) {
    try {
        const { shipmethod } = action;
        User.setShipMethod(shipmethod);
        yield put({type: "SHIP_METHOD_SET", shipmethod});
    } catch(error) {
        yield put({ type: "SHOW_ERROR", error });
    }
}

function* setShipAddress(action) {
    const { index } = action;

    try {
        var address = User.setShipAddress(index);
        yield put({type: 'SHIP_ADDRESS_SET', address});
    } catch(error) {
        yield put({ type: "SHOW_ERROR", error });
    }
}

function* setBillAddress(action) {
    const { index } = action;

    try {
        var address = User.setBillAddress(index);
        yield put({type: 'BILL_ADDRESS_SET', address});
    } catch(error) {
        yield put({ type: "SHOW_ERROR", error });
    }
}

function* addShipAddress(action) {
    const { address } = action;

    try {
        var { otherAddresses, shipping } = User.addShipAddress(address);
        yield put({type: "SHIP_ADDRESS_ADD", otherAddresses, shipping});
    } catch(error) {
        yield put({ type: "SHOW_ERROR", error });
    }
}

function* addBillAddress(action) {
    const { address } = action;

    try {
        var { otherAddresses, billing } = User.addBillAddress(address);
        yield put({type: "BILL_ADDRESS_ADD", otherAddresses, billing});
    } catch(error) {
        yield put({ type: "SHOW_ERROR", error });
    }
}

function* addCreditCard(action) {
    const { card } = action;

    try {
        var { cards, creditCard } = User.addCreditCard(card);
        yield put({type: "CREDIT_CARD_ADD", cards, creditCard});
    } catch(error) {
        yield put({ type: "SHOW_ERROR", error });
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
    .then(UserInfo => ({UserInfo}))
    .catch(error => {
        return {error};
    });
}

function* authorize(action) {
    const {username, password} = action;
    const {error, UserInfo} = yield call(fetchUserID, username, password);

    if (error)
        yield put({type: "SHOW_ERROR", error});
    else {
        var message = {details: "You have successfully logged in!"};
        yield put({type: "SHOW_SUCCESS", message});
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

function* addBillAddressWatcher() {
    yield takeEvery("ADD_BILL_ADDRESS", addBillAddress);
}

function* addShipAddressWatcher() {
    yield takeEvery("ADD_SHIP_ADDRESS", addShipAddress);
}

function* addCreditCardWatcher() {
    yield takeEvery("ADD_CREDIT_CARD", addCreditCard);
}

export function* userWatcher(){
    yield all([
        loginWatcher(),
        userInfoWatcher(),
        creditCardWatcher(),
        shippingMethodWatcher(),
        shippingAddressWatcher(),
        billingAddressWatcher(),
        addBillAddressWatcher(),
        addShipAddressWatcher(),
        addCreditCardWatcher()
    ])
}
