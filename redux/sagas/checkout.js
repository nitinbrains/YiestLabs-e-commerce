import { take, call, put, cancelled, takeLatest, all, fork, select  } from 'redux-saga/effects'
import axios from 'axios'

// custom
import { host } from '../../config.server'
import Checkout from '../../lib/Checkout';

function fetchPrepareOrderAPI(request)
{
    return axios.post(`${host}/prepare-order`, {request})
    .then(result => {
    	if(result.data.error) throw result.data.error;
        console.log('result', result.data);
        return {order: result.data}
    })
    .catch(error => {
        console.log('error', error);
        return {error};
    });
}


function *prepareOrder(){

    const state = yield select();
    var request = {};
    request.calcShip = true;
    request.userId = state.user.id;
    request.shipMethod = state.user.shipMethod;
    request.items = state.cart.items;

    const { order, error } = yield call(fetchPrepareOrderAPI, request);

    if(error) {
        yield put({ type: "THROW_ERROR", error });
    }
    else {
    	Checkout.initOrder(order, state.user);
    	yield put({type: "SET_ORDER", order});
    }
}

function* prepareOrderWatcher(){
	yield takeLatest("PREPARE_ORDER", prepareOrder)
}

export function* checkoutWatcher() {
  	yield all([
    	prepareOrderWatcher(),
  	])
}