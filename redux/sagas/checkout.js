import { take, call, put, cancelled, takeLatest, all, fork, select  } from 'redux-saga/effects'
import axios from 'axios'

// custom
import { host } from '../../config.server'
import Checkout from '../../lib/Checkout';
import User from '../../lib/User';
import Cart from '../../lib/Cart';

function fetchPrepareOrderAPI(request) {
    return axios.post(`${host}/prepare-order`, {request})
    .then(result => {
    	if(result.data.error) throw result.data.error;
        return {result: result.data}
    })
    .catch(error => {
        console.log('error', error);
        return {error};
    });
}


function *prepareOrder() {

    // const items = Cart.getCart();
    // const user = User.getUser();
    // var request = {};
    // request.calcShip = true;
    // request.userId = user.id;
    // request.shipmethod = user.shipmethod;
    // request.items = items;
    //
    // const { result, error } = yield call(fetchPrepareOrderAPI, request);
    //
    // if(error) {
    //     yield put({ type: "SHOW_ERROR", error });
    // }
    // else {
    //     console.log('result', result);
    // 	var order = Checkout.initOrder(result);
    // 	yield put({type: "SET_ORDER", order});
    // }

    var result = {
        calcShip: true,
        itemSubtotal: 510,
        items: [
            {
                MerchandiseID: 2313,
                Name: "WLP001 California Ale Yeast",
                OrderDetailquantity: 2,
                Warehouse: 9,
                details: "PurePitch® 2L",
                dispQuantity: 2,
                pricePerUnit: 255,
                salesCategory: 3,
                shipDate: "2018-11-20T01:14:25.000Z",
                type: 1,
            },
            {
                MerchandiseID: 2314,
                Name: "WLP002 English Ale Yeast",
                OrderDetailquantity: 2,
                Warehouse: 9,
                details: "PurePitch® 2L",
                dispQuantity: 2,
                pricePerUnit: 255,
                salesCategory: 3,
                shipDate: "2018-11-22T01:14:25.000Z",
                type: 1,
            }
        ],
        orderSubtotal: 586.5,
        shipmethod: "2789",
        shippingSubtotal: 76.5,
        transitTimes: {
            '4': {daysInTransit: 5, daysInTransitRange: 0},
            '2787': {daysInTransit: 1, daysInTransitRange: 0},
            '2788': {daysInTransit: 1, daysInTransitRange: 0},
            '2789': {daysInTransit: 2, daysInTransitRange: 0},
            '2790': {daysInTransit: 3, daysInTransitRange: 0},
            '2791': {daysInTransit: 5, daysInTransitRange: 0},
            '2792': {daysInTransit: 5, daysInTransitRange: 0},
            '2794': {daysInTransit: 2, daysInTransitRange: 0},
            '2841': {daysInTransit: 5, daysInTransitRange: 3},
            '2842': {daysInTransit: 3, daysInTransitRange: 3},
            '2843': {daysInTransit: 5, daysInTransitRange: 3},
            '2844': {daysInTransit: 3, daysInTransitRange: 3},
            '2845': {daysInTransit: 5, daysInTransitRange: 0},
            '2846': {daysInTransit: 1, daysInTransitRange: 0},
            '2847': {daysInTransit: 4, daysInTransitRange: 3},
            '2848': {daysInTransit: 5, daysInTransitRange: 3},
            '2849': {daysInTransit: 3, daysInTransitRange: 3},
            '2850': {daysInTransit: 3, daysInTransitRange: 0},
            '3469': {daysInTransit: 1, daysInTransitRange: 0},
            '3470': {daysInTransit: 1, daysInTransitRange: 0},
            '3471': {daysInTransit: 1, daysInTransitRange: 0},
            '3472': {daysInTransit: 2, daysInTransitRange: 0},
            '3475': {daysInTransit: 5, daysInTransitRange: 3},
            '3511': {daysInTransit: 1, daysInTransitRange: 0},
            '3609': {daysInTransit: 0, daysInTransitRange: 3},
            '13300': {daysInTransit: 3, daysInTransitRange: 3},
            '13320': {daysInTransit: 5, daysInTransitRange: 3},
            '13332': {daysInTransit: 2, daysInTransitRange: 0}
        },
        userId: 43148,
        version: "2.3.7",
    };

	var order = Checkout.initOrder(result);
	yield put({type: "SET_ORDER", order});

}

function* shippingOption(action) {
    const { option } = action;
    Checkout.setShippingOption(option);
    const items = Checkout.getItems();
    yield put({type: "SHIPPING_OPTION", option});
    yield put({type: "ITEMS", items});
}

function* incrementShipDate(action) {
    const { item } = action;
    Checkout.incrementItemDate(item);
    const items = Checkout.getItems();
    yield put({type: "ITEMS", items});
}

function* decrementShipDate(action) {
    const { item } = action;
    Checkout.decrementItemDate(item);
    const items = Checkout.getItems();
    yield put({type: "ITEMS", items});
}

function* prepareOrderWatcher() {
	yield takeLatest("PREPARE_ORDER", prepareOrder);
}

function* shippingOptionWatcher() {
    yield takeLatest("SET_SHIPPING_OPTION", shippingOption);
}

function* incrementShipDateWatcher() {
    yield takeLatest("INCREMENT_SHIP_DATE", incrementShipDate);
}

function* decrementShipDateWatcher() {
    yield takeLatest("DECREMENT_SHIP_DATE", decrementShipDate);
}

export function* checkoutWatcher() {
  	yield all([
    	prepareOrderWatcher(),
        shippingOptionWatcher(),
        incrementShipDateWatcher(),
        decrementShipDateWatcher()
  	])
}
