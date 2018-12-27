/* global fetch */
import { all, takeLatest, takeEvery } from 'redux-saga/effects';

// User actions
import { userTypes } from '../actions/userActions';
// Cart actions
import { cartTypes } from '../actions/cartActions';
// Order actions
import { orderTypes } from '../actions/orderActions';
// Inventory actions
import { inventoryTypes } from '../actions/inventoryActions';
// Calculator actions
import { calculatorTypes } from '../actions/calculatorActions';

// User sagas
import {
    loginUser,
    setUserInfo,
    setCreditCard,
    addCreditCard,
    setShipMethod,
    setShipAddress,
    setBillAddress,
    addShipAddress,
    addBillAddress
} from './users';

// Cart sagas
import { updateCartItem, addCartItem, removeCartItem } from './cart';

// Order sagas
import {
    prepareOrder,
    setShippingOption,
    incrementShipDate,
    decrementShipDate
} from './order';
// Inventory sagas

import {
    getInventory,
    changeCategory,
    switchToHomebrew,
    switchToProfessional
 } from './inventory';

// Calculator Sags
import { 
    calculatePacks,
    toggleHomebrew,
    changeType,
    changeTempValue,
    changeTempUnit,
    changeVolValue,
    changeVolUnit,
    changeGravValue,
    changeGravUnit,
 } from './calculator';

function * rootSaga () {
    yield all([
        // USERS
        takeLatest(userTypes.USER_LOGIN_ATTEMPT, loginUser),
        takeLatest(userTypes.SET_CREDIT_CARD_ATTEMPT, setCreditCard),
        takeLatest(userTypes.SET_USER_INFO_ATTEMPT, setUserInfo),
        takeLatest(userTypes.ADD_CREDIT_CARD_ATTEMPT, addCreditCard),
        takeLatest(userTypes.SET_BILL_ADDRESS_ATTEMPT, setBillAddress),
        takeLatest(userTypes.ADD_BILL_ADDRESS_ATTEMPT, addBillAddress),
        takeLatest(userTypes.SET_SHIP_METHOD_ATTEMPT, setShipMethod),
        takeLatest(userTypes.SET_SHIP_ADDRESS_ATTEMPT, setShipAddress),
        takeLatest(userTypes.ADD_SHIP_ADDRESS_ATTEMPT, addShipAddress),
        // INVENTORY
        takeEvery(inventoryTypes.GET_INVENTORY_ATTEMPT, getInventory),
        takeEvery(inventoryTypes.CHANGE_CATEGORY_ATTEMPT, changeCategory),
        takeEvery(inventoryTypes.SWITCH_TO_HOMEBREW_ATTEMPT, switchToHomebrew),
        takeEvery(inventoryTypes.SWITCH_TO_PROFESSIONAL_ATTEMPT, switchToProfessional),
        // CART
        takeEvery(cartTypes.ADD_ITEM_ATTEMPT, addCartItem),
        takeEvery(cartTypes.REMOVE_ITEM_ATTEMPT, removeCartItem),
        takeEvery(cartTypes.UPDATE_ITEM_ATTEMPT, updateCartItem),
        // ORDER
        takeLatest(orderTypes.PREPARE_ORDER_ATTEMPT, prepareOrder),
        takeLatest(orderTypes.SET_SHIPPING_OPTION_ATTEMPT, setShippingOption),
        takeLatest(orderTypes.INCREMENT_SHIP_DATE_ATTEMPT, incrementShipDate),
        takeLatest(orderTypes.DECREMENT_SHIP_DATE_ATTEMPT, decrementShipDate),
        // CALCULATOR
        takeLatest(calculatorTypes.CALCULATE_PACKS_ATTEMPT, calculatePacks ),
        takeLatest(calculatorTypes.TOGGLE_HOMEBREW_ATTEMPT, toggleHomebrew ),
        takeLatest(calculatorTypes.CHANGE_TYPE_ATTEMPT, changeType),
        takeLatest(calculatorTypes.CHANGE_TEMP_VALUE_ATTEMPT, changeTempValue),
        takeLatest(calculatorTypes.CHANGE_TEMP_UNIT_ATTEMPT, changeTempUnit),
        takeLatest(calculatorTypes.CHANGE_VOL_VALUE_ATTEMPT, changeVolValue),
        takeLatest(calculatorTypes.CHANGE_VOL_UNIT_ATTEMPT, changeVolUnit),
        takeLatest(calculatorTypes.CHANGE_GRAV_VALUE_ATTEMPT, changeGravValue),
        takeLatest(calculatorTypes.CHANGE_GRAV_UNIT_ATTEMPT, changeGravUnit)
    ]);
};

export default rootSaga;
