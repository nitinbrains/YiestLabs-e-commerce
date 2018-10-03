import { take, call, put, cancelled, takeEvery, all, fork, select  } from 'redux-saga/effects'


function fetchUserInfo(userId)
{
	return fetch(`/get-user-info?userId=${userId}`)
    .then(response => response.json())
    .then(UserInfo => UserInfo)
    .catch(error => {
        console.log('error', error);
        return {error};
    });
}


function fetchUserID(username, password)
{
    return fetch(`/get-user-id?username=${username}&password=${password}`)
    .then(response => response.json())
    .then(result => {
    	if(result.error) throw result.error;
    	return fetchUserInfo(result);
    })
    .then(UserInfo => UserInfo)
    .catch(error => {
    	console.log('error', error)
    });
}
function* authorize(username, password) {
	try {
		const UserInfo = yield call(fetchUserID, username, password);
		yield put({type: "LOGIN_SUCCESS", username, password});
		yield put({type: "SET_USER_INFO", UserInfo });

	} 
	catch(error){
		yield put({type: "THROW_ERROR", error})
	}
}

export function* loginWatcher(){
	while (true) {
		const {username, password} = yield take("LOGIN_REQUEST")
		const state = yield select(state => state.user);

		// fork return a Task object
		const task = yield fork(authorize, username, password)
		const action = yield take(["LOGOUT", "LOGIN_ERROR"])
		
		if (action.type === "LOGOUT")
			yield cancel(task)
	} 
}
