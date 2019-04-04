/* global fetch */
import { all, takeLatest, takeEvery } from 'redux-saga/effects';

// User actions
import { userTypes } from 'appRedux/actions/userActions';
// Cart actions
import { cartTypes } from 'appRedux/actions/cartActions';
// Order actions
import { orderTypes } from 'appRedux/actions/orderActions';
// Inventory actions
import { inventoryTypes } from 'appRedux/actions/inventoryActions';

import { loadingTypes } from 'appRedux/actions/loadingActions';

// Loading sagas
import { 
    startLoading,
    stopLoading
} from './loading';

// User sagas
import {
    loginUser,
    getUserInfo,
    setUserInfo,
    updateUserInfo,
    createUser,
    changeSubsidiary,
    addSubsidiary,
    getOrderHistory,
    setShipMethod,
    addCreditCard,
    deleteCreditCard,
    setCreditCard,
    setDefaultCreditCard,
    addAddress,
    editAddress,
    deleteAddress,
    setShipAddress,
    setDefaultShipAddress,
    setBillAddress,
    setDefaultBillAddress
} from './user';

// Cart sagas
import { 
    updateCartItem, 
    addCartItem, 
    removeCartItem,
    clearCart
} from './cart';

// Order sagas
import {
    prepareOrder,
    placeOrder,
    setShippingOption,
    incrementShipDate,
    decrementShipDate,
} from './order';

// Inventory sagas
import {
    getInventory,
    getItemAvailability,
    toggleHomebrew
 } from './inventory';


function * rootSaga () {
    yield all([
        // LOADING
        takeEvery(loadingtypes.START_LOADING_ATTEMPT, startLoading),
        takeEvery(loadingtypes.STOP_LOADING_ATTEMPT, stopLoading),
            // USERS
        takeLatest(userTypes.USER_LOGIN_ATTEMPT, loginUser),
        takeLatest(userTypes.GET_USER_INFO_ATTEMPT, getUserInfo),
        takeLatest(userTypes.SET_USER_INFO_ATTEMPT, setUserInfo),
        takeLatest(userTypes.UPDATE_USER_INFO_ATTEMPT, updateUserInfo),
        takeLatest(userTypes.CREATE_USER_ATTEMPT, createUser),
        takeLatest(userTypes.CHANGE_SUBSIDIARY_ATTEMPT, changeSubsidiary),
        takeLatest(userTypes.ADD_SUBSIDIARY_ATTEMPT, addSubsidiary),
        takeLatest(userTypes.GET_ORDER_HISTORY_ATTEMPT, getOrderHistory),
        takeLatest(userTypes.SET_SHIP_METHOD_ATTEMPT, setShipMethod),
        takeLatest(userTypes.ADD_CREDIT_CARD_ATTEMPT, addCreditCard),
        takeLatest(userTypes.DELETE_CREDIT_CARD_ATTEMPT, deleteCreditCard),
        takeLatest(userTypes.SET_CREDIT_CARD_ATTEMPT, setCreditCard),
        takeLatest(userTypes.SET_DEFAULT_CREDIT_CARD_ATTEMPT, setDefaultCreditCard),
        takeLatest(userTypes.ADD_ADDRESS_ATTEMPT, addAddress),
        takeLatest(userTypes.EDIT_ADDRESS_ATTEMPT, editAddress),
        takeLatest(userTypes.DELETE_ADDRESS_ATTEMPT, deleteAddress),
        takeLatest(userTypes.SET_SHIP_ADDRESS_ATTEMPT, setShipAddress),
        takeLatest(userTypes.SET_DEFAULT_SHIP_ADDRESS_ATTEMPT, setDefaultShipAddress),
        takeLatest(userTypes.SET_BILL_ADDRESS_ATTEMPT, setBillAddress),
        takeLatest(userTypes.SET_DEFAULT_BILL_ADDRESS_ATTEMPT, setDefaultBillAddress),
        // INVENTORY
        takeEvery(inventoryTypes.GET_INVENTORY_ATTEMPT, getInventory),
        takeEvery(inventoryTypes.GET_ITEM_AVAILABILITY_ATTEMPT, getItemAvailability),
        takeLatest(inventoryTypes.TOGGLE_HOMEBREW_ATTEMPT, toggleHomebrew ),
        // CART
        takeEvery(cartTypes.ADD_ITEM_ATTEMPT, addCartItem),
        takeEvery(cartTypes.REMOVE_ITEM_ATTEMPT, removeCartItem),
        takeEvery(cartTypes.UPDATE_ITEM_ATTEMPT, updateCartItem),
        takeEvery(cartTypes.CLEAR_CART_ATTEMPT, clearCart),
        // ORDER
        takeLatest(orderTypes.PREPARE_ORDER_ATTEMPT, prepareOrder),
        takeLatest(orderTypes.PLACE_ORDER_ATTEMPT, placeOrder),
        takeLatest(orderTypes.SET_SHIPPING_OPTION_ATTEMPT, setShippingOption),
        takeLatest(orderTypes.INCREMENT_SHIP_DATE_ATTEMPT, incrementShipDate),
        takeLatest(orderTypes.DECREMENT_SHIP_DATE_ATTEMPT, decrementShipDate)
    ]);
};

export default rootSaga;
