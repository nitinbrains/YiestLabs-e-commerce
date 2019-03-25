import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import _size from 'lodash/size';
import _get from 'lodash/get';
import _filter from 'lodash/filter';

import WLHelper from './WLHelper';
import SalesLib from './SalesLib';

export const prepareUserInfo = userInfo => {
    const { 
        subsidiary, 
        connectedaccounts, 
        shipmethod, 
        shipping: { 
            countryid 
    }} = userInfo;
    userInfo.shipMethods = WLHelper.shipMethodGroup(subsidiary, shipmethod, countryid);
    userInfo.subsidiaryOptions = loadSubsidiaryOptions(connectedaccounts);
    userInfo.currencyOptions = loadCurrencyOptions(subsidiary);
};

const loadSubsidiaryOptions = connectedaccounts => {

    let subsidiaryOptions = [];

    for (let i = 0; i < connectedaccounts.length; i++)
    {
        let value = parseInt(connectedaccounts[i].subsidiaryid);
        subsidiaryOptions.push(value);
    }

    // USA
    if(!subsidiaryOptions.includes(2)) {
        subsidiaryOptions.push(-2);
    }

    // HK
    if(!subsidiaryOptions.includes(5)) {
        subsidiaryOptions.push(-5);
    }

    // CPH
    if(!subsidiaryOptions.includes(7)) {
        subsidiaryOptions.push(-7);
    }

    return subsidiaryOptions;
}

const loadCurrencyOptions = subsidiary => {

    let currencyOptions = [];

    if(subsidiary == 7){
        currencyOptions = _filter(SalesLib.CURRENCY_MAP, {subsidiary});
    }
   
    return currencyOptions;

}
