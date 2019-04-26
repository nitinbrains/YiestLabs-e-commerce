import { createReducer } from 'helpers/reduxHelpers';
import { inventoryTypes } from 'appRedux/actions/inventoryActions';

const initialState = {
    items: [],
    itemsToShow: [],
    category: 1,
    error: null,
    isHomebrew: false,
    availability: {},
    pageData: null,
    isLoading: true
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
    [inventoryTypes.GET_ALTERNATE_SIZES_ATTEMPT]: (state, pageData) => ({
        isLoading: true
    }),
    [inventoryTypes.GET_ALTERNATE_SIZES_SUCCESS]: (state, pageData) => ({
        isLoading: false
    }),
    [inventoryTypes.GET_ALTERNATE_SIZES_FAILURE]: (state, pageData) => ({
        isLoading: false
    }),
    [inventoryTypes.GET_SIMILAR_STRAINS_ATTEMPT]: (state, pageData) => ({
        isLoading: true
    }),
    [inventoryTypes.GET_SIMILAR_STRAINS_SUCCESS]: (state, pageData) => ({
        isLoading: false
    }),
    [inventoryTypes.GET_SIMILAR_STRAINS_FAILURE]: (state, pageData) => ({
        isLoading: false
    }),

});
