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
        yield call(getUserInfo, userID);
        
        yield put(messageActions.displayMessage({
            title: 'Authorization',
            message: 'You have successfully logged in!'
        }));

    } catch (err) {
        yield put(responseFailure(err));
    }
};

export function * getUserInfo(action) {
    const { responseSuccess, responseFailure, data: { userID } } = action;
    try {
        const { res: userInfo, err } = yield call(api.getUserInfo, userID);
        if (err) throw err;
        yield put(userActions.setUserInfo({userInfo}));
    } catch (error) {
        yield put(responseFailure(error))
    }
}

export function * setUserInfo(action) {
    const { responseSuccess, responseFailure, data: { userInfo } } = action;
    try {

        const { subsidiary, shipmethod, shipping: { countryid } } = userInfo;
        userInfo.shipMethods = WLHelper.shipMethodGroup(subsidiary, shipmethod, countryid);
        userInfo.subsidiaryOptions = loadSubsidiaryOptions(userInfo);

        yield put(responseSuccess(userInfo));

        if (userInfo.cards.length > 0) {
            yield put(userActions.getCreditCard());
        }

        } catch (err) {
        yield put(responseFailure(err));
    }
}

export function * updateUserInfo(action) {
    const { responseSuccess, responseFailure, data: { request } } = action;
    try {
        var { res: status, err } = yield call(api.updateUserInfo, { request });
        if(err) throw err;
        let message = {
            message:'Your account was updated successfully'
        }
        yield put(messageActions.showNetworkError(message))
        
        yield put(responseSuccess(status));
        yield call(getUserInfo, {'data': { 'userID' : request.id}});
    } catch(error) {
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

        yield call(updateUserInfo, {request});
    
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
        
        yield call(updateUserInfo, {request});
    
    } catch(error) {
        yield put(responseFailure(error));
    }
}

function * getCreditCard(action) {
    const { responseSuccess, responseFailure } = action;
    try {
        const user = yield select(state => state.user);
        const creditCard = getDefaultOrFirstCreditCard(user);
        if(creditCard) {
            yield put(responseSuccess({creditCard}));
        }
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
        yield call(updateUserInfo, { request });

    } catch(error) {
        yield put(responseFailure(error));
    }
}

/*****************************/
/* General Address Functions */
/*****************************/

export function * addAddress(action) {
    const { responseSuccess, responseFailure, data: address, type } = action;
    try {
        const user = yield select(state => state.user);

        if(!user.id) {
            throw {message: 'No user id. Cannot add credit card', code: 0};
        }
        let request = {};
        if(type == 'shipping'){
            request.addShipAddress = true;
            request.shipping = user.shipping
        } else if ( type == 'billing'){
            request.addBillingAddress = true;
            request.billing = user.billing
        }

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