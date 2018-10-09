import { take, call, put, cancelled, takeEvery, all, fork, select  } from 'redux-saga/effects'

// custom
import Cart from '../../lib/Cart';

function* displayMessage(message) {
    yield put({type: "DISPLAY_MESSAGE", message});
}

function* changeQuantity(action) {
    const { index, quantity } = action;
    const items = Cart.changeItemQuantity(index, quantity);
    yield put({ type: "QUANTITY_CHANGE", items})
}

function* addItem(action) {
    
    try {
        const { item, volIdIndex, quantity } = action;
        const { message, items } = Cart.addItem(item, volIdIndex, quantity);

        if (message) 
            yield fork(displayMessage, message)

        else 
            yield put({type: "ADD_ITEM", items}); 
    } 
    catch(error) {
        yield put({type: "THROW ERROR", error});
    }
}

function* removeItem(action) {
    const { index } = action;
    const items = Cart.removeItem(index);
    yield put({ type: "REMOVE_ITEM", items});   
}

function* changeQuantityWatcher() {
    yield takeEvery("CHANGE_QUANTITY", changeQuantity)
}

function* addItemWatcher() {
    yield takeEvery("ADD_TO_CART", addItem)
}

function* removeItemWatcher() {
    yield takeEvery("REMOVE_FROM_CART", removeItem)
}


export function* cartWatcher() {
  yield all([
    changeQuantityWatcher(),
    addItemWatcher(),
    removeItemWatcher()
  ])
}
