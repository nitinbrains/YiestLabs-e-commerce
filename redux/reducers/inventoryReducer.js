import { createReducer } from 'helpers/reduxHelpers';
import { inventoryTypes } from 'appRedux/actions/inventoryActions';

const initialState = {
    items: [],
    itemsToShow: [],
    category: 1,
    error: null,
    isHomebrew: false,
    availability: {}
};


export default createReducer(initialState, {
    [inventoryTypes.GET_INVENTORY_SUCCESS]: (state, { data: { items }}) => ({
        items,
    }),
    [inventoryTypes.SEARCH_INVENTORY_SUCCESS]: (state, { data: { itemsToShow,  category }}) => ({
        itemsToShow,
        category,
    }),
    [inventoryTypes.CHANGE_CATEGORY_SUCCESS]: (state, { data: { itemsToShow, category }}) => ({
        itemsToShow,
        category,
        isHomebrew: false
    }),
    [inventoryTypes.SEARCH_STRAIN_SUCCESS]: (state, { data: { itemsToShow }}) => ({
        itemsToShow,
    }),
    [inventoryTypes.SWITCH_TO_HOMEBREW_SUCCESS]: (state, { data: { itemsToShow, isHomebrew }}) => ({
        itemsToShow,
        isHomebrew: true
    }),
    [inventoryTypes.GET_ITEM_AVAILABILITY_ATTEMPT]: (state) => ({
        isLoading: true
    }),
    [inventoryTypes.GET_ITEM_AVAILABILITY_FAILURE]: (state) => ({
        isLoading: false
    }),
    [inventoryTypes.GET_ITEM_AVAILABILITY_SUCCESS]: (state, { data: { availability }}) => ({
        isLoading: false,
        availability
    }),
});
