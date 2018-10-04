import { take, call, put, cancelled, takeEvery, all, fork, select  } from 'redux-saga/effects'
import axios from 'axios';
import { host } from '../../config.server'

function fetchUserInfo(userId)
{
    return axios.post(`${host}/get-user-info`, {userId})
    .then(result => {
        if(result.data.error) throw result.data.error;
        return {UserInfo: result.data}
    })
    .catch(error => {
        return {error};
    });
}


function fetchUserID(username, password)
{
    return axios.post(`${host}/get-user-id`, {username, password})
    .then(result => {
        if(result.data.error) throw result.data.error;
        console.log('fetch User ID', result);
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

    if (error) 
         yield put({type: "THROW_ERROR", error});
    else {

        yield put({type: "HIDE_ERROR"});
        yield put({type: "LOGIN_SUCCESS", username, password});
        yield put({type: "SET_USER_INFO", UserInfo });
    }
}

export function* loginWatcher(){
    yield takeEvery("LOGIN_REQUEST", authorize);
}
