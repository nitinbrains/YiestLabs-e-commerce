import { put, call, select, take, all } from 'redux-saga/effects';

import * as api from '../../services/users';

export function * loginUser (action) {
    console.log('loginUser', action);
    const { responseSuccess, responseFailure, data: { username, password } } = action
    try {
        const { res: userId } = yield call(api.login, username, password);
        console.log('call', api.getUserInfo, userId);
        const { res } = yield call(api.getUserInfo, userId);
        console.log('responseSuccess', res);
        yield put(responseSuccess(res));
    } catch (err) {
        console.log('responseFailure', err);
        yield put(responseFailure(err));
    }
};
