import { take, call, put, cancelled, takeEvery, all, fork, select  } from 'redux-saga/effects'

export function* messageWatcher(){
	while (true) {
		const { error } = yield take("THROW_ERROR");
		if(error.code != undefined && parseInt(error.code) == 0)
		{
			yield put({type: "DISPLAY_ERROR", error})
		}
		console.log('error', error);
	} 
}
