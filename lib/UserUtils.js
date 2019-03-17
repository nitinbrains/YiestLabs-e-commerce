import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import _size from 'lodash/size';
import _get from 'lodash/get';

import Utils from './Utils';
import WLHelper from './WLHelper';

export const setDefaultCreditCard = (user, newDefault) => {
    return user.card.map(card => {
        if(card.id === newDefault.id) {
            card.default = true;
        }
        else if(card.default)
        {
            card.default = true;
        }
        return card;
    })
}

export const addCreditCard = (user, card) => {

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
    user.otherCards.push(card);
    user.card = card;
    return { creditCard: user.card, cards: user.otherCards };
}

export const loadSubsidiaryOptions = (user) => {

    if(!user) return;

    let subsidiaryOptions = [];

    for (let i = 0; i < user.connectedaccounts.length; i++)
    {
        let value = parseInt(user.connectedaccounts[i].subsidiaryid);
        subsidiaryOptions.push(value);
    }

    // WL
    if(!subsidiaryOptions.includes(2)) {
        subsidiaryOptions.push(-2);
    }

    // 
    if(!subsidiaryOptions.includes(5)) {
        subsidiaryOptions.push(-5);
    }

    if(!subsidiaryOptions.includes(7)) {
        subsidiaryOptions.push(-7);
    }

    return subsidiaryOptions;
}
