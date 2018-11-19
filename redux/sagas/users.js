import { put, call } from 'redux-saga/effects';
import User from '../../lib/User';

import { userTypes } from '../actions/userActions';
import { messageActions } from '../actions/messageActions';
import * as api from '../../services/users';

export function * loginUser (action) {
    const { responseSuccess, responseFailure, data: { username, password } } = action;
    try {
        const { res: userId } = yield call(api.login, username, password);
        const { res: userInfo } = yield call(api.getUserInfo, userId);
        user.shipMethods = Utils.shipMethodGroup(userInfo);
        setCreditCard(userInfo);
        yield put(responseSuccess(userInfo));
        yield put(messageActions.displayMessage({
            title: 'Authorization',
            message: 'You have successfully logged in!'
        }));

    } catch (err) {
        yield put(responseFailure(err));
    }
};

export function * setCreditCard(action) {
    const { responseSuccess, responseFailure, data } = action;
    try {
        yield put(responseSuccess(setCC(data)));
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * addCreditCard(action) {
    const { responseSuccess, responseFailure, data: card } = action;

    try {
        const { cards, creditCard } = addCC(card);
        yield put(responseSuccess({ cards, creditCard }));
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * setShipMethod(action) {
    const { responseSuccess, responseFailure, data: { shipmethod } } = action;
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

export function * addShipAddress(action) {
    const { responseSuccess, responseFailure, data: address } = action;
    try {
        var user = yield select(state => state.user);
        const { otherAddresses, shipping } = addShip(user, address);
        yield put(responseSuccess({ otherAddresses, shipping }));
    } catch(error) {
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
        var user = yield select(state => state.user);
        const { otherAddresses, billing } = addBill(user, address);
        yield put(responseSuccess({ otherAddresses, billing }));
    } catch(error) {
        yield put(responseFailure(error));
    }
}


/****** Business Logic ******/

function setCC(user, index) {

    // get default or first card in users account if card not specified

    if(index) {
        user.selectedCard = user.cards[index];
    }
    else if(user.cards.length > 0)
    {
        var defaultCard = user.cards.find(c => c.default);
        if(defaultCard)
        {
            user.selectedCard = defaultCard;
        }
        else
        {
            user.selectedCard = user.cards[0];
        }
    }
    else {
        return null
    }

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

    var expireDate = new Date(card.expireYear, card.expireMonth, 1, 0, 0, 0, 0);
    var today = new Date();

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
