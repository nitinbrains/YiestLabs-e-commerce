/* global fetch */
import { all, takeLatest, takeEvery } from 'redux-saga/effects';

// User actions
import { userTypes } from '../actions/userActions';
// refactor this
import { getInventory } from '../actions/inventory';
import { changeQuantity, addCartItem, deleteFromCart } from '../actions/cart';

// User sagas
import { loginUser } from './users';

function * rootSaga () {
    yield all([
        // USERS
        takeLatest(userTypes.USER_LOGIN_ATTEMPT, loginUser),
        // refactor this
        // INVENTORY
        takeEvery("STORE_REQUEST", getInventory),
        // CART
        takeEvery("CHANGE_QUANTITY", changeQuantity),
        takeEvery("ADD_TO_CART", addCartItem),
        takeEvery("DELETE_FROM_CART", deleteFromCart)
    ]);
};

export default rootSaga;
