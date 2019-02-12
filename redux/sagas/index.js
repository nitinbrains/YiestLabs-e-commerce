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
    getUserInfo,
    setUserInfo,
    updateUserInfo,
    createUser,
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
} from './users';

// Cart sagas
import { updateCartItem, addCartItem, removeCartItem } from './cart';

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
    searchItem,
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
    changeStartingGravity,
    changeTargetPitchRate,
    changeVolume,
    changeViability,
    changeCellCount
 } from './calculator';

function * rootSaga () {
    yield all([
        // USERS
        takeLatest(userTypes.USER_LOGIN_ATTEMPT, loginUser),
        takeLatest(userTypes.GET_USER_INFO_ATTEMPT, getUserInfo),
        takeLatest(userTypes.SET_USER_INFO_ATTEMPT, setUserInfo),
        takeLatest(userTypes.UPDATE_USER_INFO_ATTEMPT, updateUserInfo),
<<<<<<< HEAD
        takeLatest(userTypes.CREATE_USER_ATTEMPT, createUSer),
=======
        takeLatest(userTypes.CREATE_USER_ATTEMPT, createUser),
>>>>>>> 396d880dcd45bf37aa88acd6d6840c7350f9cab5
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
        takeEvery(inventoryTypes.SEARCH_INVENTORY_ATTEMPT, searchItem),
        takeEvery(inventoryTypes.CHANGE_CATEGORY_ATTEMPT, changeCategory),
        takeEvery(inventoryTypes.SWITCH_TO_HOMEBREW_ATTEMPT, switchToHomebrew),
        takeEvery(inventoryTypes.SWITCH_TO_PROFESSIONAL_ATTEMPT, switchToProfessional),
        // CART
        takeEvery(cartTypes.ADD_ITEM_ATTEMPT, addCartItem),
        takeEvery(cartTypes.REMOVE_ITEM_ATTEMPT, removeCartItem),
        takeEvery(cartTypes.UPDATE_ITEM_ATTEMPT, updateCartItem),
        // ORDER
        takeLatest(orderTypes.PREPARE_ORDER_ATTEMPT, prepareOrder),
        takeLatest(orderTypes.PLACE_ORDER_ATTEMPT, placeOrder),
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
        takeLatest(calculatorTypes.CHANGE_GRAV_UNIT_ATTEMPT, changeGravUnit),
        
        takeLatest(calculatorTypes.CHANGE_STARTING_GRAVITY_ATTEMPT, changeStartingGravity),
        takeLatest(calculatorTypes.CHANGE_TARGET_PITCH_RATE_ATTEMPT, changeTargetPitchRate),
        takeLatest(calculatorTypes.CHANGE_VOLUME_ATTEMPT, changeVolume),
        takeLatest(calculatorTypes.CHANGE_VIABILITY_ATTEMPT, changeViability),
        takeLatest(calculatorTypes.CHANGE_CELL_COUNT_ATTEMPT, changeCellCount)
    ]);
};

export default rootSaga;
