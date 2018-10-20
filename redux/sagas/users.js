import { put, call } from 'redux-saga/effects';

import * as api from '../../services/users';

export function * loginUser (action) {
    const { responseSuccess, responseFailure, data: { username, password } } = action
    try {
        const { res: userId } = yield call(api.login, username, password);
        const { res } = yield call(api.getUserInfo, userId);
        yield put(responseSuccess(res));
    } catch (err) {
        yield put(responseFailure(err));
    }
};
