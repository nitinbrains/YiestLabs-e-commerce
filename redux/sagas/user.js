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


function* setCreditCard() {
    const { card } = action;
    User.setCreditCard(card);
    const user = User.getUser();
    yield put({type: "SET_CREDIT_CARD", card});
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
        console.log('error', error)
        return {error};
    });
}

function* authorize(action) {
    const {username, password} = action;
    const {error, UserInfo} = yield call(fetchUserID, username, password);
    console.log('UserInfo', UserInfo);

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

function *creditCardWatcher() {
    yield takeEvery("SET_CREDIT_CARD", setCreditCard);
}

export function* userWatcher(){
    yield all([
        loginWatcher(),
        userInfoWatcher(),
        creditCardWatcher(),
    ])
}
