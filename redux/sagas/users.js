import { put, call, select } from 'redux-saga/effects';
import _isNumber from 'lodash/isNumber';

import { userActions, userTypes } from '../actions/userActions';
import { messageActions } from '../actions/messageActions';
import * as api from '../../services/users';

import WLHelper from '../../lib/WLHelper';

export function * loginUser (action) {
    const { responseSuccess, responseFailure, data: { username, password } } = action;
    try {
        const { res: userID } = yield call(api.login, username, password);
        const { res: userInfo } = yield call(api.getUserInfo, userID);

        const { subsidiary, shipmethod, shipping: { countryid } } = userInfo;
        userInfo.shipMethods = WLHelper.shipMethodGroup(subsidiary, shipmethod, countryid);
        userInfo.subsidiaryOptions = loadSubsidiaryOptions(userInfo);

        yield put(responseSuccess(userInfo));
        if (userInfo.cards.length > 0) {
            yield put(userActions.setCreditCard());
        }
        yield put(messageActions.displayMessage({
            title: 'Authorization',
            message: 'You have successfully logged in!',
            variant:'success'
        }));
    } catch (err) {
        if(error.status){
            yield put(messageActions.showNetworkError({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            yield put(messageActions.showNetworkError({ title: 'Error', error: error.message, variant:'error' }));        
            // yield put(messageActions.displayMessage({ title: 'Error', error: error.message }));        
        }
        yield put(responseFailure(err));
    }
};

export function * setUserInfo(action) {
    const { responseSuccess, responseFailure, data: { userInfo } } = action;
    try {

        const { subsidiary, shipmethod, shipping: { countryid } } = userInfo;
        userInfo.shipMethods = WLHelper.shipMethodGroup(subsidiary, shipmethod, countryid);
        userInfo.subsidiaryOptions = loadSubsidiaryOptions(userInfo);

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

export function * setCreditCard(action) {
    const { responseSuccess, responseFailure, data } = action;
    try {
        const user = yield select(state => state.user);
        const creditCard = setCC(user, data);

        yield put(responseSuccess({creditCard}));
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

export function * addCreditCard(action) {
    const { responseSuccess, responseFailure, data: card } = action;
    try {
        const user = yield select(state => state.user);
        const { cards, creditCard } = addCC(user, card);
        yield put(responseSuccess({ cards, creditCard }));
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

export function * setShipAddress(action) {
    const { responseSuccess, responseFailure, data } = action;
    try {
        yield put(responseSuccess(data));
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * updateUserInfo(action) {
    const { responseSuccess, responseFailure, data } = action;
    try {
        yield put(responseSuccess(data));
    } catch(error) {
        yield put(responseFailure(error))
    }
}

export function * addShipAddress(action) {
    const { responseSuccess, responseFailure, data: address } = action;
    try {
        const user = yield select(state => state.user);
        const { otherAddresses, shipping } = addShip(user, address);
        yield put(responseSuccess({ otherAddresses, shipping }));
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

export function * setBillAddress(action) {
    const { responseSuccess, responseFailure, data } = action;
    try {
        yield put(responseSuccess(data));
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * addBillAddress(action) {
    const { responseSuccess, responseFailure, data: address } = action;
    try {
        let user = yield select(state => state.user);
        const { otherAddresses, billing } = addBill(user, address);
        yield put(responseSuccess({ otherAddresses, billing }));
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


/****** Business Logic ******/

function setCC(user, index) {

    // get default or first card in users account if card not specified
    let creditCard
    if (_isNumber(index)) {
        creditCard = user.cards[index];
    } else if (user.cards.length > 0) {
        const defaultCard = user.cards.find(c => c.default);
        if (defaultCard) {
            creditCard = defaultCard;
        } else {
            creditCard = user.cards[0];
        }
    }
    return creditCard;
}

function addShip(user, address) {
    user.otherAddresses.push(address);
    user.shipping = address;
    user.shipping.id = 1; // TESTING
    return { shipping: user.shipping, otherAddresses: user.otherAddresses };
}

function addBill(user, address) {
    user.otherAddresses.push(address);
    user.billing = address;
    user.billing.id = 1;  // TESTING
    return { billing: user.billing, otherAddresses: user.otherAddresses };

}

function addCC(user, card) {

    let expireDate = new Date(card.expireYear, card.expireMonth, 1, 0, 0, 0, 0);
    let today = new Date();

    if(!card.name) {
        throw {message: 'Please enter a name for the credit card', code: 0};
    } else if (!card.number) {
        throw {message: 'Please enter a credit card number', code: 0};
    } else if (!card.expireMonth) {
        throw {message: 'Please enter an expiration month for the credit card', code: 0};
    } else if (!card.expireYear) {
        throw {message: 'Please enter an expiration year for the credit card', code: 0};
    } else if(expireDate < today){
        throw {message: 'Your credit card expiration date has already passed', code: 0};
    }

    card.id = 1 // TESTING
    user.cards.push(card);
    user.selectedCard = card;
    return { creditCard: user.selectedCard, cards: user.cards };
}

function loadSubsidiaryOptions(user) {

    if(!user) return;

    let subsidiaryOptions = [];
    let cph = false, hk = false;

    for (let i = 0; i < user.connectedaccounts.length; i++)
    {
        let value = parseInt(user.connectedaccounts[i].subsidiaryid);

        if(value == 5)
        {
            hk = true;
        }
        else if(value == 7)
        {
            cph = true;
        }

        let label = WLHelper.getSubsidiaryLabel(value);
        subsidiaryOptions.push({label: label, value: value});
    }

    if(!cph)
    {
        subsidiaryOptions.push({label: 'Create WL Copenhagen Account', value: -7});
    }

    if(!hk)
    {
        subsidiaryOptions.push({label: 'Create WL Hong Kong Account', value: -5});
    }

    return subsidiaryOptions;
}