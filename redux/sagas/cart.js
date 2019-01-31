import { put, select  } from 'redux-saga/effects';
import { messageActions } from '../actions/messageActions';
import cartSelectors from '../selectors/cart.js';

import SalesLib from '../../lib/SalesLib';

export function * addCartItem(action) {
    const { responseSuccess, responseFailure, data: { cartItem } } = action;
    try {
        const items = yield select(cartSelectors.items);
        addToCart(items, cartItem);
        yield put(responseSuccess({ items }));
    } catch(error) {
        yield put(messageActions.displayMessage({ title: 'Error', error: error.message }));
        yield put(responseFailure(error));
    }
}

export function * removeCartItem(action) {
    const { responseSuccess, responseFailure, data: index } = action;
    try {
        const items = yield select(state => state.cart.items);
        items.splice(index, 1);
        yield put(responseSuccess({ items }));
    } catch(error) {
        if(error.status){
            // show network error is any regaring with api status
            yield put(messageActions.showNetworkError({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            if(err.code == 0 ){
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showNetworkError({ title: 'Yeastman', message: error.message, variant:'error' }));        
            } else if(err.code == -1){
                // Other error when we have error with code == -1
                yield put(messageActions.showNetworkError({ title: 'Error', message: error.message, variant:'error' }));                
            }
        }
        yield put(responseFailure(error));
    }
}

export function * updateCartItem(action) {
    const { responseSuccess, responseFailure, data: { index, quantity } } = action;
    var items = yield select(state => state.cart.items);
    try {
        changeItemQuantity(items, index, quantity);
        yield put(responseSuccess({ items }));
    } catch (error) {
        if(error.status){
            // show network error is any regaring with api status
            yield put(messageActions.showNetworkError({ title: 'Error', message: error.message, variant:'error' }));
        } else {
            if(err.code == 0 ){
                // Yeastman error when we have error with code == 0
                yield put(messageActions.showNetworkError({ title: 'Yeastman', message: error.message, variant:'error' }));        
            } else if(err.code == -1){
                // Other error when we have error with code == -1
                yield put(messageActions.showNetworkError({ title: 'Error', message: error.message, variant:'error' }));                
            }
        }
        yield put(responseFailure(error));
    }
}


/* ------------- Business Logic ------------- */

function addToCart(items, cartItem) {
    // Check if item already exists in Cart
    const matchIndex = items.findIndex(item => item.MerchandiseID === cartItem.MerchandiseID && item.details === cartItem.details);
    if (items[matchIndex]) {
        items[matchIndex].OrderDetailQty += cartItem.OrderDetailQty;
        items[matchIndex].dispQuantity += cartItem.dispQuantity;
        // manageBlends(itemRef, matchIndex);
    } else {
        items.push(cartItem);
        // manageBlends(itemRef, Cart.length-1);
    }

}

function changeItemQuantity(items, index, quantity) {
    try {
        if(0 > index || index >= items.length) {
            throw { message: 'index out of bounds', code: 0}
        }

        quantity = parseInt(quantity);
        if(isNaN(quantity)){
            items[index].dispQuantity = '';
            items[index].OrderDetailquantity = '';
        }
        else {
            items[index].dispQuantity = quantity;

            if(items[index].type == 5){
                items[index].OrderDetailquantity = items[index].size * quantity;
            } else {
                items[index].OrderDetailquantity = quantity;
            }
        }
    }
    catch(error) {
        console.log('error in changeItemQuantity', error);
        return { error };
    }
}

// function manageBlends(itemRef, cartIndex, volId)
// {
//     if(parseInt(itemRef.strainCategory) == 5) //blend sacch
//     {
//         if(volId == 3 && items[cartIndex].OrderDetailQty < 10)
//         {
//             var qty = parseInt(items[cartIndex].OrderDetailQty);
//             items.splice(cartIndex, 1);

//             var purchasePacks = [
//                 {'count':0, 'pack':'10Bbl / HL, 2000 ml yeast'},
//                 {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'},
//                 {'count':0, 'pack':'Nano, 500 ml yeast'},
//                 {'count':0, 'pack':'Homebrew, 40 ml yeast'}
//             ];
//             var amountPacks = getOptimalAmount([0.5, 1.5, 2], totalVol, {});
//             purchasePacks[0].count = amountPacks["2.0"];
//             purchasePacks[1].count = amountPacks["1.5"];
//             purchasePacks[2].count = amountPacks["0.5"];

//             addToCartPR(itemRef, purchasePacks);
//         }

//         var multiplier = (volId == 0 ? 0.5 : (volId == 1 ? 1.5 : 2));
//         if(Cart[cartIndex].OrderDetailQty * multiplier >= 10)
//         {
//             Cart[cartIndex].MerchandiseID = itemRef.volID[3];
//             Cart[cartIndex].OrderDetailQty = Cart[cartIndex].OrderDetailQty * multiplier;
//             Cart[cartIndex].details = Cart[cartIndex].OrderDetailQty + 'L Custom Pour';
//         }
//     }
// }
