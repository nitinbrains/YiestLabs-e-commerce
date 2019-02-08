import { take, call, put, cancelled, takeEvery, all, fork, select  } from 'redux-saga/effects';
import { messageActions } from '../actions/messageActions';
import { inventoryActions } from '../actions/inventoryActions';

import {
    filterItems,
} from '../../lib/InventoryUtils';

import * as api from '../../services/';

export function * getInventory (action) {
    const { responseSuccess, responseFailure, data: { search } } = action;
    try {
        yield put(messageActions.hideSnackbar({}))
        const { res: { items, error }} = yield call(api.getInventory);       
        if( error ) {
            throw error
        } else if(items){
            var category = 1;
            const itemsToShow = filterItems(items, category, null, false)
            yield put(responseSuccess({ items, itemsToShow, category })); 
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

export function * changeCategory(action) {
    const { responseSuccess, responseFailure, data: { category } } = action;
    try {
        const inventory = yield select(state => state.inventory);
        const itemsToShow = filterItems(inventory.items, category, null, false, false);
        yield put(responseSuccess({ itemsToShow, category }));
    } catch(error) {
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

export function * searchForStrain(action) {
    const { responseSuccess, responseFailure, data: { searchTerm } } = action;
    try {
        const inventory = yield select(state => state.inventory);
        const itemsToShow = filterItems(inventory.items, null, searchTerm, false, false);
        yield put(responseSuccess({ itemsToShow }));
    } catch(error) {
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

export function * switchToHomebrew(action) {
    const { responseSuccess, responseFailure } = action;
    try {
        const inventory = yield select(state => state.inventory);
        const itemsToShow = filterItems(inventory.items, null, null, false, true);
        yield put(responseSuccess({ itemsToShow }));
    } catch(error) {
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

export function * switchToProfessional(action) {
    const { responseSuccess, responseFailure } = action;
    try {
        const inventory = yield select(state => state.inventory);
        const category = inventory.category;
        const itemsToShow = filterItems(inventory.items, category, null, false, true);
        yield put(inventoryActions.changeCategory({
            category: category
        }));
    } catch(error) {
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
export function * searchItem(action) {
    const { responseSuccess, responseFailure, data: { category, search } } = action;
    try {
        const inventory = yield select(state => state.inventory);
        const itemsToShow = filterItems(inventory.items, category, search, false, false);
        yield put(responseSuccess({ itemsToShow, category }));
    } catch(error) {
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