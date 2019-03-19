import { take, call, put, cancelled, takeEvery, all, fork, select  } from 'redux-saga/effects';
import { messageActions } from 'appRedux/actions/messageActions';
import { inventoryActions } from 'appRedux/actions/inventoryActions';

import * as api from 'services/';

export function * getInventory (action) {
    const { responseSuccess, responseFailure, data: { search } } = action;
    try {
        yield put(messageActions.hideSnackbar({}))
        const { res: { items, error }} = yield call(api.getInventory);       
        if( error ) {
            throw error
        } else if(items){
            yield put(responseSuccess({ items })); 
            yield put(messageActions.hideSnackbar())   
        }
    } catch (error) {
        yield put(responseFailure(error));
        if(error.status){
            yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));        
            // yield put(messageActions.displayMessage({ title: 'Error', error: error.message }));        
        }
    }
};

export function * getItemAvailability (action) {
    const { responseSuccess, responseFailure, data: { itemID } } = action;
    try {
        const { res: { availability, error }} = yield call(api.getItemAvailability, {
            itemID
        }); 
        
        if( error ) {
            throw error
        } else if(availability) {
            yield put(responseSuccess({availability}));
        }
    } catch (error) {
        yield put(responseFailure(error));
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
    }
};