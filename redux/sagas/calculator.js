import { put, select  } from 'redux-saga/effects';
// import { calculatorActions } from '../actions/calculatorActions';

// import SalesLib from '../../lib/SalesLib';

export function * startCalculation(action) {
    console.log('saga --- action ')
    console.log( action )
    const { responseSuccess, responseFailure } = action;


    yield put(responseSuccess({}));

    // var items = yield select(state => state.cart.items);
    // try {
    //     addToCart(items, cartItem);
    //     // if (message) {
    //     //     yield put(messageActions.displayMessage({ ...message }));
    //     // }
    //     yield put(responseSuccess({ items }));
    // } catch(error) {
    //     yield put(messageActions.displayMessage({ title: 'Error', error: error.message }));
    //     yield put(responseFailure(error));
    // }
}
