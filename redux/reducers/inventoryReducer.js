import { createReducer } from '../../helpers/reduxHelpers';
import { inventoryTypes } from '../actions/inventoryActions';

const initialState = {
    items: [],
    itemsToShow: [],
    category: 1,
    error: null,
    isHomebrew: false
};


export default createReducer(initialState, {
    [inventoryTypes.GET_INVENTORY_SUCCESS]: (state, { data: { itemsToShow, items, category } }) => ({
        itemsToShow,
        items,
        category,
    }),
    [inventoryTypes.SEARCH_INVENTORY_SUCCESS]: (state, { data: { itemsToShow,  category } }) => ({
        itemsToShow,
        category,
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
