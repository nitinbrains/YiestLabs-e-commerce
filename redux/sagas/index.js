/* global fetch */
import { all, takeLatest, takeEvery } from 'redux-saga/effects';

// User actions
import { userTypes } from '../actions/userActions';
// Cart actions
import { cartTypes } from '../actions/cartActions';
// Inventory actions
import { inventoryTypes } from '../actions/inventoryActions';

// User sagas
import { loginUser } from './users';
// Cart sagas
import { updateItem, addCartItem } from './cart';
// Inventory sagas
import { getInventory } from './inventory';

function * rootSaga () {
    yield all([
        // USERS
        takeLatest(userTypes.USER_LOGIN_ATTEMPT, loginUser),
        // INVENTORY
        takeEvery(inventoryTypes.GET_INVENTORY_ATTEMPT, getInventory),
        // CART
        takeEvery(cartTypes.ADD_ITEM_ATTEMPT, addCartItem),
        takeEvery(cartTypes.UPDATE_ITEM_ATTEMPT, updateItem)
    ]);
};

export default rootSaga;
