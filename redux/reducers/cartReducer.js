import { createReducer } from '../../helpers/reduxHelpers';
import { cartTypes } from '../actions/cartActions';

export const initialState = {
    items: []
};

export default createReducer(initialState, {
    [cartTypes.ADD_ITEM_SUCCESS]: ({ items }, { data }) => ({
        items: data.items
    }),
    [cartTypes.UPDATE_ITEM_SUCCESS]: ({ items }, { data }) => ({
        items: data.items
    }),
    [cartTypes.REMOVE_ITEM_SUCCESS]: ({ items }, { data }) => ({
        items: data.items
    }),
    [cartTypes.CLEAR_CART_ATTEMPT]: (state, { data }) => null,
})
