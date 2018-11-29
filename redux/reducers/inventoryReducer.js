import { createReducer } from '../../helpers/reduxHelpers';
import { inventoryTypes } from '../actions/inventoryActions';

const initialState = {
    items: [],
    itemsToShow: [],
    error: null,
    isLoading: false
};


export default createReducer(initialState, {
    [inventoryTypes.GET_INVENTORY_ATTEMPT]: (state, { data }) => ({
        isLoading: true,
    }),
    [inventoryTypes.GET_INVENTORY_SUCCESS]: (state, { data: { itemsToShow, items } }) => ({
        itemsToShow,
        items,
        isLoading: false
    }),
    [inventoryTypes.GET_INVENTORY_FAILURE]: (state, { data }) => ({
        isLoading: false,
    }),
    [inventoryTypes.CHANGE_CATEGORY_SUCCESS]: (state, { data: { itemsToShow } }) => ({
        itemsToShow,
    }),
    [inventoryTypes.SEARCH_STRAIN_SUCCESS]: (state, { data: { itemsToShow } }) => ({
        itemsToShow,
    })
});
