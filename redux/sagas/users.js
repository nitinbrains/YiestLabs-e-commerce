import { put, call } from 'redux-saga/effects';
import User from '../../lib/User';

import { userTypes } from '../actions/userActions';
import * as api from '../../services/users';

export function * loginUser (action) {
    const { responseSuccess, responseFailure, data: { username, password } } = action;
    try {
        const { res: userId } = yield call(api.login, username, password);
        const { res: UserInfo } = yield call(api.getUserInfo, userId);
        User.setUser(UserInfo);
        UserInfo.shipMethods = User.getShipMethods();
        yield put(responseSuccess(UserInfo));
    } catch (err) {
        yield put(responseFailure(err));
    }
};

export function * setUserInfo (action) {
    const { data: { userInfo } } = action;
    User.setUser(userInfo);
}



export function * setCreditCard (action) {
    const { responseSuccess, responseFailure, data: { card } } = action;
    try {
        User.setCreditCard(card);
        const user = User.getUser();
        yield put(responseSuccess({card}));
    } catch (err) {
        yield put(responseFailure(err));
    }
}
