import { createReducer } from 'helpers/reduxHelpers';
import { orderTypes } from 'appRedux/actions/orderActions';

const initialState = {
	items: [],
    transitTimes: [],
    shipMethod: '',
    itemSub: 0,
    shippingSub: 0,
    orderSub: 0,
    shippingOptions: ["Ship All Together", "Earliest For Each", "Custom"],
    selectedShippingOption: 'Ship All Together',
    removedItems: [],
    orderPlaced: false
};

/* ------------- Hookup Reducers To Types ------------- */

export default createReducer(initialState, {

    [orderTypes.PREPARE_ORDER_SUCCESS]: (state, { data }) => ({
        ...data,
        orderPlaced: false
    }),
    [orderTypes.PLACE_ORDER_SUCCESS]: (state, { data }) => ({
        ...initialState,
        orderPlaced: true
    }),
    [orderTypes.SET_ITEMS_ATTEMPT]: (state, { data: { items }}) => ({
        ...state,
        items
    }),
    [orderTypes.SET_SHIPPING_OPTION_SUCCESS]: (state, { data: option }) => ({
        ...state,
        selectedShippingOption: option
    })
});
