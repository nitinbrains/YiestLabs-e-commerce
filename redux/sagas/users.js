import { put, call, select } from 'redux-saga/effects';
import _isNumber from 'lodash/isNumber';
import _isEmpty from 'lodash/isEmpty';

import { userActions, userTypes } from '../actions/userActions';
import { messageActions } from '../actions/messageActions';
import * as api from '../../services/users.js';
import {
    loadSubsidiaryOptions,
    getDefaultOrFirstCreditCard,
} from './UserUtils.js';

import WLHelper from '../../lib/WLHelper';

export function * loginUser (action) {
    const { responseSuccess, responseFailure, data: { username, password } } = action;
    try {
        const { res: userID, err } = yield call(api.login, username, password);
        if(err) throw err;

        const { res: userInfo, error } = yield call(api.getUserInfo, userID);
        if(error) throw error;

        yield put(messageActions.displayMessage({
            title: 'Authorization',
            message: 'You have successfully logged in!',
            variant:'success'
        }));

        yield put(responseSuccess());

    } catch (err) {
        if(error.status){
            yield put(messageActions.showNetworkError({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            if(err.code == 0 ){
                yield put(messageActions.showNetworkError({ title: 'Yeastman', error: error.message, variant:'error' }));        
            } else if(err.code == -1){
                yield put(messageActions.showNetworkError({ title: 'Error', error: error.message, variant:'error' }));                
            }
            // yield put(messageActions.displayMessage({ title: 'Error', error: error.message }));        
        }
        yield put(responseFailure(err));
    }
};

export function * getUserInfo(action) {
    const { responseSuccess, responseFailure,  data: { userID }} = action;
    try {
        console.log('userID', userID);
        const { res: userInfo } = yield call(api.getUserInfo, { userID });
        console.log('userInfo', userInfo);
        yield put(userActions.setUserInfo({ userInfo}));
        yield put(responseSuccess());
    } catch (error) {
        console.log('error', error);
        if(error.status){
            yield put(messageActions.showNetworkError({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            yield put(messageActions.showNetworkError({ title: 'Error', error: error.message, variant:'error' }));        
            // yield put(messageActions.displayMessage({ title: 'Error', error: error.message }));        
        }
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

        if (userInfo.cards.length > 0) {
            yield put(userActions.setCreditCard(userInfo));
        }

        } catch (err) {
        if(error.status){
            yield put(messageActions.showNetworkError({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            yield put(messageActions.showNetworkError({ title: 'Error', error: error.message, variant:'error' }));
            // yield put(messageActions.displayMessage({ title: 'Error', error: error.message }));        
        }
        yield put(responseFailure(err));
    }
}

export function * updateUserInfo(action) {
    const { responseSuccess, responseFailure, data: { request } } = action;
    try {
        const user = yield select(state => state.user);
        request.id = user.id;

        var { res, error } = yield call(api.updateUserInfo, {
            request
        });

        if(error) throw error;

        yield put(userActions.getUserInfo({
            userID: user.id
        }))

    } catch(error) {
        if(error.status){
            yield put(messageActions.showNetworkError({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            yield put(messageActions.showNetworkError({ title: 'Error', error: error.message, variant:'error' }));        
            // yield put(messageActions.displayMessage({ title: 'Error', error: error.message }));        
        }
        yield put(responseFailure(error));
    }
}

export function * getOrderHistory(action) {
    const { responseSuccess, responseFailure } = action;
    try {

        var user = yield select(state => state.user);

        var request = {};
        request.id = user.id;

        var { res: { orderHistory }, error } = yield call(api.getOrderHistory, {
            request
        });
        if(error) throw error;

        yield put(responseSuccess({ orderHistory }));
    } catch(error) {
        if(error.status){
            yield put(messageActions.showNetworkError({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            yield put(messageActions.showNetworkError({ title: 'Error', error: error.message, variant:'error' }));        
            // yield put(messageActions.displayMessage({ title: 'Error', error: error.message }));        
        }
        yield put(responseFailure(error));
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
        if(error.status){
            yield put(messageActions.showNetworkError({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            yield put(messageActions.showNetworkError({ title: 'Error', error: error.message, variant:'error' }));        
            // yield put(messageActions.displayMessage({ title: 'Error', error: error.message }));        
        }
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
    const { responseSuccess, responseFailure, data: { address }} = action;
    try {
        const user = yield select(state => state.user);

        if(!user.id) {
            throw {message: 'No user id. Cannot add Address', code: 0};
        }
        let request = {};
        request.addAddress = true;
        request.address = address
        yield put(userActions.updateUserInfo({request}))
    
    } catch(error) {
        if(error.status){
            yield put(messageActions.showNetworkError({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            yield put(messageActions.showNetworkError({ title: 'Error', error: error.message, variant:'error' }));        
            // yield put(messageActions.displayMessage({ title: 'Error', error: error.message }));        
        }
        yield put(responseFailure(error));
    }
}

export function * editAddress(action) {
    const { responseSuccess, responseFailure, data: { address }} = action;
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
    console.log(action,'asd')
    try {
        const user = yield select(state => state.user);

        if(!user.id) {
            throw {message: 'No user id. Cannot set default ship address', code: 0};
        }

        let request = {};
        request.id = user.id;
        request.defaultShipAddress = true;
        request.address = address;

        yield put(userActions.updateUserInfo({request}))
    
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

        yield put(userActions.updateUserInfo({request}))        
    
    } catch(error) {
        yield put(responseFailure(error));
    }
}