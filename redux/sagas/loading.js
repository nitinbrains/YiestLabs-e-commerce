import { take, call, put, cancelled, takeEvery, all, fork, select  } from 'redux-saga/effects';

export function * startLoading(action) {
    const { responseSuccess, responseFailure } = action;
    try {
        yield put(responseSuccess());
    } catch (error) {
        if(error.status){
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            if(err.code == 0 ){
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showSnackbar({ title: 'Yeastman', message: error.message, variant:'error' }));        
            } else if(err.code == -1){
                // Other error when we have error with code == -1
                yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));                
            }
        }
        yield put(responseFailure(error));
    }
}


export function * stopLoading(action) {
    const { responseSuccess, responseFailure } = action;
    try {
        yield put(responseSuccess());
    } catch (error) {
        if(error.status){
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            if(err.code == 0 ){
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showSnackbar({ title: 'Yeastman', message: error.message, variant:'error' }));        
            } else if(err.code == -1){
                // Other error when we have error with code == -1
                yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));                
            }
        }
        yield put(responseFailure(error));
    }
}


