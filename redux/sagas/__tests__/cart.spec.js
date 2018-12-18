import { runSaga, storeIO } from 'redux-saga';
import { put, select, delay } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';

import {
    addCartItem,
    removeCartItem,
    updateCartItem
} from '../cart';
import cartSelectors from '../../selectors/cart.js';
import { cartActions } from '../../actions/cartActions';
import { cart } from '../../mocks';


describe('testing of cart sagas',() => {
    it('adding item to cart', () => {
        const cartItem = {
            MerchandiseID: 2425,
            Name: "WLP001 California Ale Yeast",
            OrderDetailQty: 1,
            details: "PurePitch® Nano",
            dispQuantity: 1,
            salesCategory: 3,
            type: 1,
        };
        const action = cartActions.addItem({ cartItem });
        return expectSaga(
            addCartItem, action
        ).withState({
            cart
        }).put(
            action.responseSuccess({ items: [cartItem] })
        ).run();
    });

    it('removing item from cart', () => {
        const cartItem = {
            MerchandiseID: 2425,
            Name: "WLP001 California Ale Yeast",
            OrderDetailQty: 1,
            details: "PurePitch® Nano",
            dispQuantity: 1,
            salesCategory: 3,
            type: 1,
        };
        const action = cartActions.removeItem(0);
        return expectSaga(
            removeCartItem, action
        ).withState({
            cart: {
                items: [cartItem]
            }
        }).put(
            action.responseSuccess({ items: [] })
        ).run();
    });

    it('updating cart item in cart', () => {
        const cartItem = {
            MerchandiseID: 2425,
            Name: "WLP001 California Ale Yeast",
            OrderDetailQty: 1,
            details: "PurePitch® Nano",
            dispQuantity: 1,
            salesCategory: 3,
            type: 1,
        };
        const action = cartActions.updateItem({ index: 0, quantity: 2 });
        return expectSaga(
            updateCartItem, action
        ).withState({
            cart: {
                items: [cartItem]
            }
        }).put(
            action.responseSuccess({ items: [ { ...cartItem, OrderDetailquantity: 2, dispQuantity: 2 } ] })
        ).run();
    })
})
