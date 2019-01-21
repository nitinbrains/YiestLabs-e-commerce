import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import _size from 'lodash/size';
import _get from 'lodash/get';

import Utils from '../../lib/Utils';
import WLHelper from '../../lib/WLHelper';

export const changesWereMade = (currentState, reduxState) => {

    var request = new Object();
    request.selectedShipping = {};
    request.selectedBilling = {};

    if(!currentState.id) {
        throw { message: 'User does not have an id', code: 0};
    }

    request.id = currentState.id;

    if (currentState.email !== reduxState.email) {
        if(!currentState.email) {
            throw {message: 'Please enter an email', code: 0};
        }
        else if(!Utils.ValidateEmail(currentState.email))
        {
            throw {message: 'Please enter a valid email', code: 0};
        }
        request.email = currentState.email;
    }
    
    if (currentState.phone !== reduxState.phone) {
        if(!currentState.phone) {
            throw {message: 'Please enter an email', code: 0};
        }
        else {
            const phone = Utils.stripChars(currentState.phone);

            if(!phone)
            {
                throw {message: 'Please enter a valid phone number', code: 0};
            }
            request.phone = phone;
        } 
    }

    if(currentState.currency != reduxState.currency)
    {
        request.currency = currentState.currency;
    }

    if(currentState.vat != reduxState.vat)
    {
        request.vat = currentState.vat;
    }

    if(currentState.shipmethod != parseInt(reduxState.shipmethod))
    {
        request.shipmethod = currentState.shipmethod;
    }

    if(!_isEqual(currentState.selectedShipping, reduxState.selectedShipping)) {
        request.shipChange = true;
        request.selectedShipping.id = currentState.selectedShipping.id;
        request.selectedShipping.attn = currentState.selectedShipping.attn;

    
        request.selectedShipping.addressee = currentState.selectedShipping.addressee;

        if(!currentState.selectedShipping.address1)
        {
            throw {message: 'Please enter a shipping address on line 1', code: 0};
        }
        request.selectedShipping.address1 = currentState.selectedShipping.address1;
        request.selectedShipping.address2 = currentState.selectedShipping.address2;
        request.selectedShipping.address3 = currentState.selectedShipping.address3;

        if(!currentState.selectedShipping.city)
        {
            throw {message: 'Please enter a city for your shipping address', code: 0};
        }
        request.selectedShipping.city = currentState.selectedShipping.city;
        request.selectedShipping.zip = currentState.selectedShipping.zip;
        request.selectedShipping.countryid = currentState.selectedShipping.countryid;

        if(!WLHelper.validateZipCode(request.selectedShipping.countryid, request.selectedShipping.zip))
        {
            throw {message: "Cannot update, shipping zipcode invalid for selected country", code: 0};
        }
    }

    if(!_isEqual(currentState.selectedBilling, reduxState.selectedBilling)) {
        request.billChange = true;
        request.selectedBilling.id = currentState.selectedBilling.id;
        request.selectedBilling.attn = currentState.selectedBilling.attn;

        if(!currentState.selectedBilling.addressee)
        {
            throw {message: 'Please enter a billing addressee', code: 0};

        }
        request.selectedBilling.addressee = currentState.selectedBilling.addressee;

        if(!currentState.selectedBilling.address1)
        {
            throw {message: 'Please enter a value for your billing address', code: 0};
        }
        request.selectedBilling.address1 = currentState.selectedBilling.address1;
        request.selectedBilling.address2 = currentState.selectedBilling.address2;
        request.selectedBilling.address3 = currentState.selectedBilling.address3;

        if(!currentState.selectedBilling.city)
        {
            throw {message: 'Please enter a city for your billing address', code: 0};
        }
        request.selectedBilling.city = currentState.selectedBilling.city;
        request.selectedBilling.zip = currentState.selectedBilling.zip;
        request.selectedBilling.countryid = currentState.selectedBilling.countryid;

        if(!WLHelper.validateZipCode(request.selectedBilling.countryid, request.selectedBilling.zip))
        {
            throw {message: "Cannot update, billing zipcode invalid for selected country", code: 0};
        }
    }

    return request;
}

export const getDefaultOrFirstCreditCard = (user) => {
    if (user.cards.length > 0) {
        const defaultCard = user.cards.find(c => c.default);
        if (defaultCard) {
            return defaultCard;
        } else {
            return user.cards[0];
        }
    }
    return null;
}

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
    user.cards.push(card);
    user.selectedCard = card;
    return { creditCard: user.selectedCard, cards: user.cards };
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
