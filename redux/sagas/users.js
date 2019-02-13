import { put, call, select } from "redux-saga/effects";
import _isNumber from "lodash/isNumber";
import _isEmpty from "lodash/isEmpty";

import { userActions, userTypes } from "../actions/userActions";
import { messageActions } from "../actions/messageActions";
import * as api from "../../services/users.js";
import { loadSubsidiaryOptions, getDefaultOrFirstCreditCard } from "../../lib/UserUtils.js";

import WLHelper from "../../lib/WLHelper";

export function* loginUser(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { username, password }
    } = action;
    try {
        const { res, err } = yield call(api.login, username, password);
        if(err) throw err;
        let {userID} = res;
        yield put(responseSuccess());
        if(res.error && res.error.code === 0 ){
            yield put(messageActions.showBanner({
                title: 'Yeastman', 
                message: res.error.message, 
                variant:'error',
            }));        
        } else if (!_isEmpty(userID)){
            userID = Number(userID)
            yield put(userActions.getUserInfo({userID, isLogin:true}));
        }else{
            yield put(messageActions.showBanner({
                title: 'Error', 
                message: "Something went wrong", 
                variant:'error',
            })); 
        }
        
    } catch (err) {
        if(error.status){
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            if(err.code == 0 ){
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showBanner({ title: 'Yeastman', message: error.message, variant:'error' }));        
            } else if(err.code == -1){
                // Other error when we have error with code == -1
                yield put(messageActions.showBanner({ title: 'Error', message: error.message, variant:'error' }));                
            }
        }
        yield put(responseFailure(error));
    }
}

export function* getUserInfo(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { userID, isLogin }
    } = action;
    try {
        const { res: userInfo, error } = yield call(api.getUserInfo, { userID });
        if(error) throw error;
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
        sessionStorage.setItem('isLoggedin', true)
        yield put(userActions.setUserInfo({ userInfo}));
        yield put(responseSuccess());
        if(isLogin){
            yield put(messageActions.showBanner({
                title: 'Authorization',
                message: 'You have successfully logged in!',
                variant:'success',
            }));
        }
    } catch (error) {
        if(error.status){
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            if(err.code == 0 ){
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showBanner({ title: 'Yeastman', message: error.message, variant:'error' }));        
            } else if(err.code == -1){
                // Other error when we have error with code == -1
                yield put(messageActions.showBanner({ title: 'Error', message: error.message, variant:'error' }));                
            }
        }
        yield put(responseFailure(error));
    }
}

export function* setUserInfo(action) {
    const {
        responseSuccess, 
        responseFailure, 
        data: { userInfo }
    } = action;
    try {
        const { subsidiary, shipmethod, shipping: { countryid }} = userInfo;
        userInfo.shipMethods = WLHelper.shipMethodGroup(subsidiary, shipmethod, countryid);
        userInfo.subsidiaryOptions = loadSubsidiaryOptions(userInfo);
        yield put(responseSuccess(userInfo));

        } catch (error) {
            if(error.status){
                // show network error is any regaring with api status
                yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));
            } else {
                if(error.code == 0 ){
                    // Yeastman error when we have error with code == 0
                    yield put(messageActions.showBanner({ title: 'Yeastman', message: error.message, variant:'error' }));        
                } else if(error.code == -1){
                    // Other error when we have error with code == -1
                    yield put(messageActions.showBanner({ title: 'Error', message: error.message, variant:'error' }));                
                }
            }
        yield put(responseFailure(error));
    }
}

export function* updateUserInfo(action) {
    const { 
        responseSuccess, 
        responseFailure, 
        data: { request }
    } = action;
    try {
        const user = yield select(state => state.user);
        
        request.id = user.id;

        var { res, error } = yield call(api.updateUserInfo, {
            request
        });
        
        if (error){
            yield put(messageActions.showBanner({
                title: 'Yeastman', 
                message: "Error: error updating your account" + error,
                variant:'error' 
            }));
            throw error;
        } else {
            yield put(messageActions.showBanner({
                title: 'Yeastman', 
                message: "Your account information has been successfully updated",
                variant:'success' 
            }));
        }
                
        
        yield put(userActions.getUserInfo({
            userID: user.id
        }))

    } catch(error) {
        if(error.status){
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            if(err.code == 0 ){
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showBanner({ title: 'Yeastman', message: error.message, variant:'error' }));        
            } else if(err.code == -1){
                // Other error when we have error with code == -1
                yield put(messageActions.showBanner({ title: 'Error', message: error.message, variant:'error' }));                
            }
        }
        yield put(responseFailure(error));
    }
}

export function* createUser(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { userInfo }
    } = action;
    try {
        
        var request = Object.assign({}, userInfo);
        request.creditToken = WLHelper.generateCreditToken(creditCard);
		request.nonce = Utils.uuid();
        
        const res = yield call(api.createNetSuiteAccount, {request});
        if (res.error) throw error;

        request = {};
        request.id = res.id;
        const { res: result, error } = yield call(api.createYeastmanAccount, {request});

        yield put(userActions.setUserInfo({ userInfo}));
        yield put(responseSuccess());

        // TO-DO: Redirect user to store

    } catch(error) {
        if(error.status){
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            if(error.code == 0 ){
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showBanner({ title: 'Yeastman', message: error.message, variant:'error' }));        
            } else if(error.code == -1){
                // Other error when we have error with code == -1
                yield put(messageActions.showBanner({ title: 'Error', message: error.message, variant:'error' }));                
            }
        }
        yield put(responseFailure(error));
    }
}

export function* getOrderHistory(action) {
    const { responseSuccess, responseFailure } = action;
    try {
        const user = yield select(state => state.user);

        if (!user.id) {
            throw { message: "No user id. Cannot get order history", code: 0 };
        }

        var request = {};
        request.id = user.id;

        var {
            res: { orderHistory },
            error
        } = yield call(api.getOrderHistory, { request });
        if (error) throw error;

        yield put(responseSuccess({ orderHistory }));
    } catch(error) {
        if(error.status){
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            if(err.code == 0 ){
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showBanner({ title: 'Yeastman', message: error.message, variant:'error' }));        
            } else if(err.code == -1){
                // Other error when we have error with code == -1
                yield put(messageActions.showBanner({ title: 'Error', message: error.message, variant:'error' }));                
            }
        }
        yield put(responseFailure(error));
    }
}

export function* setShipMethod(action) {
    const { 
        responseSuccess, 
        responseFailure, 
        data: { shipmethod }
    } = action;
    try {
        yield put(responseSuccess(shipmethod));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

/*************************/
/* Credit Card Functions */
/*************************/

export function* addCreditCard(action) {
    const { 
        responseSuccess, 
        responseFailure, 
        data: { creditCard }
    } = action;
    try {
        const user = yield select(state => state.user);

        if (!user.id) {
            yield put(messageActions.showBanner({
                title: 'Yeastman', 
                message: "No user id. Cannot add credit card",
                variant:'error' 
            }));
            throw { message: "No user id. Cannot add credit card", code: 0 };
        }

        let request = {};
        request.addCreditCard = true;
        request.token = WLHelper.generateCreditToken(creditCard);

        yield put(userActions.updateUserInfo({ request }));
        yield put(messageActions.showBanner({ title: 'Yeastman', message: error.message, variant:'error' }));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

export function* deleteCreditCard(action) {
    const { 
        responseSuccess, 
        responseFailure, 
        data: { creditCard }
    } = action;
    try {
        const user = yield select(state => state.user);

        if (!user.id) {
            yield put(messageActions.showBanner({
                title: 'Yeastman', 
                message: "No user id. Cannot delete credit card",
                variant:'error' 
            }));
            throw { message: "No user id. Cannot delete credit card", code: 0 };
        }

        let request = {};
        request.deleteCreditCard = true;
        request.card = creditCard;

        yield put(userActions.updateUserInfo({ request }));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

export function* setCreditCard(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { creditCard }
    } = action;
    try {
        yield put(responseSuccess({ creditCard }));
    } catch(error) {
        if(error.status){
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            if(err.code == 0 ){
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showBanner({ title: 'Yeastman', message: error.message, variant:'error' }));        
            } else if(err.code == -1){
                // Other error when we have error with code == -1
                yield put(messageActions.showBanner({ title: 'Error', message: error.message, variant:'error' }));                
            }
        }
        yield put(responseFailure(error));
    }
}

export function* setDefaultCreditCard(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { creditCard }
    } = action;
    try {
        const user = yield select(state => state.user);

        if (!user.id) {
            throw { message: "No user id. Cannot set default card", code: 0 };
        }

        // Update default card in NetSuite
        let request = {};
        request.defaultCreditCard = true;
        request.card = creditCard;
        yield put(userActions.updateUserInfo({ request }));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

/*****************************/
/* General Address Functions */
/*****************************/

export function* addAddress(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { address }
    } = action;
    try {
        const user = yield select(state => state.user);

        if (!user.id) {
            yield put(messageActions.showBanner({ 
                title: 'Yeastman', 
                message: "No user id. Cannot add Address",
                variant:'error' 
            }));
            throw { message: "No user id. Cannot add Address", code: 0 };
        }

        let request = {};
        request.addAddress = true;
        request.address = address
        yield put(userActions.updateUserInfo({request}))
    
    } catch(error) {
        if(error.status){
            // show network error is any regaring with api status
            yield put(messageActions.showSnackbar({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            if(err.code == 0 ){
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showBanner({ title: 'Yeastman', message: error.message, variant:'error' }));        
            } else if(err.code == -1){
                // Other error when we have error with code == -1
                yield put(messageActions.showBanner({ title: 'Error', message: error.message, variant:'error' }));                
            }
        }
        yield put(responseFailure(error));
    }
}

export function* editAddress(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { address }
    } = action;
    try {
        const user = yield select(state => state.user);

        if (!user.id) {
            yield put(messageActions.showBanner({ 
                title: 'Yeastman', 
                message: "No user id. Cannot edit Address",
                variant:'error' 
            }));
            throw { message: "No user id. Cannot edit address", code: 0 };
        }

        let request = {};
        request.editAddress = true;
        request.address = address;

        yield put(userActions.updateUserInfo({ request }));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

export function* deleteAddress(action) {
    const { 
        responseSuccess, 
        responseFailure, 
        data: { address }
    } = action;
    try {
        const user = yield select(state => state.user);

        if (!user.id) {
            yield put(messageActions.showBanner({ 
                title: 'Yeastman', 
                message: "No user id. Cannot delete Address",
                variant:'error' 
            }));
            throw { message: "No user id. Cannot delete Address", code: 0 };
        }

        let request = {};
        request.deleteAddress = true;
        request.address = address;

        yield put(userActions.updateUserInfo({ request }));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

/******************************/
/* Shipping Address Functions */
/******************************/

export function* setShipAddress(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { address }
    } = action;
    try {
        yield put(responseSuccess({ address }));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

export function* setDefaultShipAddress(action) {
    const { 
        responseSuccess, 
        responseFailure, 
        data: { address }
    } = action;
    try {
        const user = yield select(state => state.user);

        if (!user.id) {
            yield put(messageActions.showBanner({ 
                title: 'Yeastman', 
                message: "No user id. Cannot set default ship address",
                variant:'error' 
            }));
            throw { message: "No user id. Cannot set default ship address", code: 0 };
        }

        let request = {};
        request.defaultShipAddress = true;
        request.address = address;

        yield put(userActions.updateUserInfo({ request }));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

/*****************************/
/* Billing Address Functions */
/*****************************/

export function* setBillAddress(action) {
    const {
        responseSuccess,
        responseFailure,
        data: { address }
    } = action;
    try {
        yield put(responseSuccess({ address }));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

export function* setDefaultBillAddress(action) {
    const { responseSuccess, responseFailure, data: { address }} = action;
    try {
        const user = yield select(state => state.user);

        if (!user.id) {
            yield put(messageActions.showBanner({ 
                title: 'Yeastman', 
                message: "No user id. Cannot set default bill address",
                variant:'error' 
            }));
            throw { message: "No user id. Cannot set default bill address", code: 0 };
        }

        let request = {};
        request.id = user.id;
        request.defaultBillAddress = true;
        request.address = address;

        yield put(userActions.updateUserInfo({ request }));
    } catch (error) {
        yield put(responseFailure(error));
    }
}
