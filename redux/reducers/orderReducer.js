import { createReducer } from 'helpers/reduxHelpers';
import { orderTypes } from 'appRedux/actions/orderActions';

const initialState = {
	items: [],
    transitTimes: [],
    shipMethod: '',
    itemSub: 0,
    shippingSub: 0,
    orderSub: 0,
		// Forcing "Ship All Together" until we are able to retain and revert to the original warehouse for an item
		// Unhide the "select shipping option custom" text in checkout after uncommenting other options
    shippingOptions: ["Ship All Together"], //, "Earliest For Each", "Custom"],
    selectedShippingOption: 'Ship All Together',
};

/* ------------- Hookup Reducers To Types ------------- */

export default createReducer(initialState, {

    [orderTypes.PREPARE_ORDER_SUCCESS]: (state, { data }) => ({
        ...data,
    }),
    [orderTypes.PLACE_ORDER_SUCCESS]: (state, { data }) => ({
        ...data,
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
