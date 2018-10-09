import { take, call, put, cancelled, takeEvery, all, fork, select  } from 'redux-saga/effects'
import axios from 'axios'

// custom
import { host } from '../../config.server'
import Store from '../../lib/Store'

function fetchInventoryAPI(classFilters)
{
    return axios.get(`${host}/get-inventory?classFilters=${JSON.stringify(classFilters)}`)
    .then(result => {
        if(result.data.error) throw result.data.error;
        return {items: result.data.items}
    })
    .catch(error => {
        console.log('error', error);
        return {error};
    });
}


function *getInventory(action){

    const { index, getAll } = action;
    const classFilters = Store.getClassFilters(index, getAll);

    const { items, error } = yield call(fetchInventoryAPI, classFilters)

    if (items) {
            Store.addIndicesLoaded();
            yield put({ type: "STORE_SUCCESS", items})
    }
    else
        yield put({ type: "THROW_ERROR", error })
    
}


export function* storeWatcher(){
	yield takeEvery("STORE_REQUEST", getInventory)
}
