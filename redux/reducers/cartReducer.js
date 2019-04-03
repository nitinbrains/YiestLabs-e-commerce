import { createReducer } from 'helpers/reduxHelpers';
import { cartTypes } from 'appRedux/actions/cartActions';

export const initialState = {
    items: [],
    showWantSooner: false,
    activeTab: '',
    want_sooner_alternateSizes: [{},{},{},{},{},{}],
    want_sooner_similarStrains: [{},{},{}]
};

export default createReducer(initialState, {
    [cartTypes.ADD_ITEM_SUCCESS]: (state, { data: { items }}) => ({
        ...state,
        items
    }),
    [cartTypes.UPDATE_ITEM_SUCCESS]: (state, { data: { items }}) => ({
        ...state,
        items
    }),
    [cartTypes.REMOVE_ITEM_SUCCESS]: (state, { data: { items }}) => ({
        ...state,
        items
    }),
    [cartTypes.CLEAR_CART_SUCCESS]: (state, { data }) => ({
        ...state,
        items: []
    }),
})
