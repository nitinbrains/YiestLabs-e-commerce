import { createReducer } from '../../helpers/reduxHelpers';
import { cartTypes } from '../actions/cartActions';

export const initialState = {
    items: []
};

const addOrUpdate = (items, newItem, isUpdate = false) => {
    if (isUpdate) {
        return items.map((item) => item.MerchandiseID === newItem.MerchandiseID && item.details === newItem.details ? newItem : item);
    }
    
    let isFound = false;
    const cartItems = items.map((item) => {
        if (item.MerchandiseID === newItem.MerchandiseID && item.details === newItem.details) {
            isFound = true;
            return newItem;
        }
        return item;
    });
    if (!isFound) {
        cartItems.push(newItem);
    }
    return cartItems;
}

export default createReducer(initialState, {
    [cartTypes.ADD_ITEM_SUCCESS]: ({ items }, { data: { item } }) => ({
        items: addOrUpdate(items, item)
    }),
    [cartTypes.UPDATE_ITEM_SUCCESS]: ({ items }, { data: { item: updatedItem } }) => ({
        items: addOrUpdate(items, updatedItem, true)
    }),
    [cartTypes.REMOVE_ITEM]: ({ items }, { data: { removedItem } }) => ({
        items: items.filter((item) => item.MerchandiseID === removedItem.MerchandiseID && item.details === removedItem.details)
    }),
    [cartTypes.CLEAR_CART]: (state, { data }) => null,
})
