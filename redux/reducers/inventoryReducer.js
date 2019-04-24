import { createReducer } from 'helpers/reduxHelpers';
import { inventoryTypes } from 'appRedux/actions/inventoryActions';

const initialState = {
    items: [],
    itemsToShow: [],
    category: 1,
    error: null,
    isHomebrew: false,
    availability: {},
    pageData: null
};


export default createReducer(initialState, {
    [inventoryTypes.GET_INVENTORY_SUCCESS]: (state, { data: { items }}) => ({
        items,
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
    [inventoryTypes.TOGGLE_HOMEBREW_SUCCESS]: (state, { data: { isHomebrew } }) => ({
        isHomebrew,
    }),
    [inventoryTypes.SET_PAGE_DATA_ATTEMPT]: (state, pageData) => ({
        pageData
    }),
});
