/* global fetch */
import { all, takeLatest, takeEvery } from 'redux-saga/effects';

// User actions
import { userTypes } from '../actions/userActions';
// Cart actions
import { cartTypes } from '../actions/cartActions';

import { getInventory } from '../actions/inventory'; // refactor this
// User sagas
import { loginUser } from './users';
// Cart sagas
import { updateItem, addCartItem } from './cart';

function * rootSaga () {
    yield all([
        // USERS
        takeLatest(userTypes.USER_LOGIN_ATTEMPT, loginUser),
        // refactor this
        // INVENTORY
        takeEvery("STORE_REQUEST", getInventory),
        // CART
        takeEvery(cartTypes.ADD_ITEM_ATTEMPT, addCartItem),
        takeEvery(cartTypes.UPDATE_ITEM_ATTEMPT, updateItem)
    ]);
};

export default rootSaga;
