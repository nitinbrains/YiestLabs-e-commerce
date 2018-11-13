import { createReducer } from '../../helpers/reduxHelpers';
import { orderTypes } from '../actions/orderActions';

const initialState = {
	items: [],
    transitTimes: [],
    EarliestDeliveryDates: [],
    EarliestShipDates: [],
    shipMethod: '',
    subsidiary: '',
    itemSub: 0,
    shippingSub: 0,
    orderSub: 0,
    shippingOptions: ["Ship All Together", "Earliest For Each", "Custom"],
    selectedShippingOption: 'Ship All Together'
};

/* ------------- Hookup Reducers To Types ------------- */

export default createReducer(initialState, {
    [orderTypes.PLACE_ORDER_SUCCESS]: (state, { data }) => ({
        ...data
    }),
    [orderTypes.SET_ITEMS_ATTEMPT]: (state, { data: { items } }) => ({
        ...state,
        items
    }),
    [orderTypes.SET_SHIPPING_OPTION_ATTEMPT]: (state, { data: option }) => ({
        ...state,
        selectedShippingOption: option
    })
});
