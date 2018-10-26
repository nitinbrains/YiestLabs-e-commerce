import { take, call, put, cancelled, takeEvery, all, fork, select  } from 'redux-saga/effects'

function* errorMessage(action) {
	const { error } = action;
	var message = {
		details: error.message,
		type: "error",
		code: error.code
	}
	if(error.code != undefined && parseInt(error.code) == 0)
	{
		yield put({type: "SHOW_MESSAGE", message});
	}
}

function* infoMessage(action) {
	const { message } = action;
	message.type = "info";
	yield put({type: "SHOW_MESSAGE", message});
}

function* successMessage(action) {
	const { message } = action;
	message.type = "success";
	yield put({type: "SHOW_MESSAGE", message});
}


function* closeMessage(action) {
	const { index } = action;
	yield put({type: "HIDE_MESSAGE", index});
}

function* errorWatcher() {
	yield takeEvery("SHOW_ERROR", errorMessage);
}

function* infoWatcher() {
	yield takeEvery("SHOW_INFO", infoMessage);
}

function* successWatcher() {
	yield takeEvery("SHOW_SUCCESS", successMessage);
}

function* closeMessageWatcher() {
	yield takeEvery("CLOSE_MESSAGE", closeMessage)
}

export function* messageWatcher(){
    yield all([
        errorWatcher(),
		infoWatcher(),
		successWatcher(),
		closeMessageWatcher()
    ])
}
