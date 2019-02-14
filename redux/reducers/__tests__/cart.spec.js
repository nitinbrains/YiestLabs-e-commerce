import cartReducer from '../cartReducer';
import { cartTypes } from 'appRedux/actions/cartActions';
import { cart } from '../../mocks';

const cartItem = {
    MerchandiseID: 2425,
    Name: "WLP001 California Ale Yeast",
    OrderDetailQty: 1,
    details: "PurePitch® Nano",
    dispQuantity: 1,
    salesCategory: 3,
    type: 1,
};

describe('testing of cart reducer',() => {

    it('add item success set items to cart', () => {
        return expect(cartReducer(cart, {
            type: cartTypes.ADD_ITEM_SUCCESS,
            data: { items: [cartItem] }
        })).toEqual({
            ...cart,
            items: [cartItem]
        });
    });

    it('update item success set items to cart', () => {
        return expect(cartReducer({ ...cart, items: [ cartItem ] }, {
            type: cartTypes.UPDATE_ITEM_SUCCESS,
            data: { items: [{ ...cartItem, MerchandiseID: 1 }] }
        })).toEqual({
            ...cart,
            items: [{ ...cartItem, MerchandiseID: 1 }]
        });
    });

    it('remove item success set items to cart', () => {
        return expect(cartReducer({ ...cart, items: [ cartItem, cartItem] }, {
            type: cartTypes.REMOVE_ITEM_SUCCESS,
            data: { items: [cartItem] }
        })).toEqual({
            ...cart,
            items: [cartItem]
        });
    });

    it('clear cart attempt set cart to initial state', () => {
        return expect(cartReducer({ ...cart, items: [ cartItem, cartItem] }, {
            type: cartTypes.CLEAR_CART_ATTEMPT,
            data: { items: [cartItem] }
        })).toEqual({
            items: []
        });
    });
});
