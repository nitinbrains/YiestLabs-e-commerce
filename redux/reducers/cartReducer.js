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
    [cartTypes.SHOW_WANT_SOONER_ATTEMPT]: ({ items }, { data }) => ({
        showWantSooner: true,
        activeTab: data.activeTab
    }),
    [cartTypes.HIDE_WANT_SOONER_ATTEMPT]: ({ items }, { data }) => ({
        showWantSooner: false,
        activeTab: ''
    }),
})
