import { put, call, select } from 'redux-saga/effects';
import _isNumber from 'lodash/isNumber';
import _isEmpty from 'lodash/isEmpty';

import { userActions, userTypes } from '../actions/userActions';
import { messageActions } from '../actions/messageActions';
import * as api from '../../services/';
import {
    loadSubsidiaryOptions,
    getDefaultOrFirstCreditCard,

} from './UserUtils.js';

import WLHelper from '../../lib/WLHelper';

export function * loginUser (action) {
    const { responseSuccess, responseFailure, data: { username, password } } = action;
    try {
        const { res: userID } = yield call(api.login, username, password);
        yield put(userActions.getUserInfo({
            userID: user.id
        }));

        yield put(messageActions.displayMessage({
            title: 'Authorization',
            message: 'You have successfully logged in!'
        }));

        yield put(responseSuccess());
    } catch (err) {
        yield put(responseFailure(err));
    }
};

export function * getUserInfo(action) {
    console.log('action', action);
    const { responseSuccess, responseFailure,  data: { userID }} = action;
    try {
        const { res: userInfo } = yield call(api.getUserInfo, { userID });
        yield put(userActions.setUserInfo({ userInfo}));
        yield put(responseSuccess());
    } catch (error) {
        console.log('error', error);
        yield put(responseFailure(error))
    }
}

export function * setUserInfo(action) {
    const { responseSuccess, responseFailure, data: { userInfo } } = action;
    try {

        const { subsidiary, shipmethod, shipping: { countryid } } = userInfo;
        userInfo.shipMethods = WLHelper.shipMethodGroup(subsidiary, shipmethod, countryid);
        userInfo.subsidiaryOptions = loadSubsidiaryOptions(userInfo);
        const creditCard = getDefaultOrFirstCreditCard(userInfo);
        if(creditCard) {
            userInfo.selectedCard = creditCard;
        }

        yield put(responseSuccess(userInfo));

    } 
    catch (err) {
        console.log('error', err);
        yield put(responseFailure(err));
    }
}

export function * updateUserInfo(action) {
    const { responseSuccess, responseFailure, data: { request } } = action;
    try {

        const user = yield select(state => state.user);
        request.id = user.id;

        var { res, err } = yield call(api.updateUserInfo, {
            request
        });
        if(err) throw err;

        yield put(userActions.getUserInfo({
            userID: user.id
        }))

        yield put(responseSuccess());
    } catch(error) {
        console.log('error', error);
        yield put(responseFailure(error))
    }
}


export function * setShipMethod(action) {
    const { responseSuccess, responseFailure, data: shipmethod } = action;
    try {
        yield put(responseSuccess(shipmethod));
    } catch(error) {
        yield put(responseFailure(error));
    }
}

/*************************/
/* Credit Card Functions */
/*************************/

export function * addCreditCard(action) {
    const { responseSuccess, responseFailure, data: creditCard } = action;
    try {
        const user = yield select(state => state.user);

        if(!user.id) {
            throw {message: 'No user id. Cannot add credit card', code: 0};
        }
        let request = {};
        request.addCreditCard = true;
        request.id = user.id
        request.token = WLHelper.generateCreditToken(card);

        yield put(userActions.updateUserInfo({request}));
    
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * deleteCreditCard(action) {
    const { responseSuccess, responseFailure, data: creditCard } = action;
    try {
        const user = yield select(state => state.user);

        if(!user.id) {
            throw {message: 'No user id. Cannot delete credit card', code: 0};
        }

        let request = {};
        request.deleteCreditCard = true;
        request.id = user.id
        request.card = creditCard;
        
        yield put(userActions.updateUserInfo({request}));
    
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * setCreditCard(action) {
    const { responseSuccess, responseFailure, data: { creditCard }} = action;
    try {
        yield put(responseSuccess({ creditCard }));
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * setDefaultCreditCard(action) {
    const { responseSuccess, responseFailure, data: { creditCard} } = action;
    try {
        // Update default card in NetSuite
        let request = {};
        request.defaultCreditCard = true;
        request.card = creditCard;
        yield put(userActions.updateUserInfo({request}));

    } catch(error) {
        yield put(responseFailure(error));
    }
}

/*****************************/
/* General Address Functions */
/*****************************/

export function * addAddress(action) {
    const { responseSuccess, responseFailure, data: address } = action;
    try {
        const user = yield select(state => state.user);

        if(!user.id) {
            throw {message: 'No user id. Cannot add credit card', code: 0};
        }
        let request = {};
        request.addShipAddress = true;
        request.shipping = user.shipping

        yield call(updateUserInfo, {request});
    
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * editAddress(action) {
    const { responseSuccess, responseFailure, data: address } = action;
    try {
        const user = yield select(state => state.user);

        if(!user.id) {
            throw {message: 'No user id. Cannot add credit card', code: 0};
        }

        let request = {};
        request.id = user.id;
        request.editAddress = true;
        request.address = address

        yield call(updateUserInfo, {request});
    
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * deleteAddress(action) {
    const { responseSuccess, responseFailure, data: address } = action;
    try {
        const user = yield select(state => state.user);

        if(!user.id) {
            throw {message: 'No user id. Cannot add credit card', code: 0};
        }

        let request = {};
        request.id = user.id;
        request.deleteAddress = true;
        request.address = address;

        yield call(updateUserInfo, {request});
    
    } catch(error) {
        yield put(responseFailure(error));
    }
}

/******************************/
/* Shipping Address Functions */
/******************************/

export function * setShipAddress(action) {
    const { responseSuccess, responseFailure, data: { address }} = action;
    try {
        yield put(responseSuccess({address}));
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * setDefaultShipAddress(action) {
    const { responseSuccess, responseFailure, data: address } = action;
    try {
        const user = yield select(state => state.user);

        if(!user.id) {
            throw {message: 'No user id. Cannot set default ship address', code: 0};
        }

        let request = {};
        request.id = user.id;
        request.defaultBillAddress = true;
        request.address = address;

        yield call(updateUserInfo, {request});
    
    } catch(error) {
        yield put(responseFailure(error));
    }
}

/*****************************/
/* Billing Address Functions */
/*****************************/

export function * setBillAddress(action) {
    const { responseSuccess, responseFailure, data: { address }} = action;
    try {
        yield put(responseSuccess({address}));
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * setDefaultBillAddress(action) {
    const { responseSuccess, responseFailure, data: address } = action;
    try {
        const user = yield select(state => state.user);

        if(!user.id) {
            throw {message: 'No user id. Cannot set default bill address', code: 0};
        }

        let request = {};
        request.id = user.id;
        request.defaultBillAddress = true;
        request.address = address;

        yield call(updateUserInfo, {request});
    
    } catch(error) {
        yield put(responseFailure(error));
    }
}