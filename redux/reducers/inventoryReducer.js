import { createReducer } from '../../helpers/reduxHelpers';
import { inventoryTypes } from '../actions/inventoryActions';

const initialState = {
    items: [],
    itemsToShow: [],
    category: 1,
    error: null,
    isLoading: false,
    isHomebrew: false
};


export default createReducer(initialState, {
    [inventoryTypes.GET_INVENTORY_ATTEMPT]: (state, { data }) => ({
        isLoading: true,
    }),
    [inventoryTypes.GET_INVENTORY_SUCCESS]: (state, { data: { itemsToShow, items, category } }) => ({
        itemsToShow,
        items,
        category,
        isLoading: false
    }),
    [inventoryTypes.GET_INVENTORY_FAILURE]: (state, { data }) => ({
        isLoading: false,
    }),
    [inventoryTypes.CHANGE_CATEGORY_SUCCESS]: (state, { data: { itemsToShow, category } }) => ({
        itemsToShow,
        category,
        isHomebrew: false
    }),
    [inventoryTypes.SEARCH_STRAIN_SUCCESS]: (state, { data: { itemsToShow } }) => ({
        itemsToShow,
    }),
    [inventoryTypes.SWITCH_TO_HOMEBREW_SUCCESS]: (state, { data: { itemsToShow, isHomebrew } }) => ({
        itemsToShow,
        isHomebrew: true
    }),
});
