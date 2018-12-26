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
    selectedShippingOption: 'Ship All Together',
    isLoading: false
};

/* ------------- Hookup Reducers To Types ------------- */

export default createReducer(initialState, {
    [orderTypes.PREPARE_ORDER_ATTEMPT]: (state, { data }) => ({
        isLoading: true,
    }),
    [orderTypes.PREPARE_ORDER_FAILURE]: (state, { data }) => ({
        isLoading: false
    }),
    [orderTypes.PREPARE_ORDER_SUCCESS]: (state, { data }) => ({
        ...data,
        isLoading: false
    }),
    [orderTypes.SET_ITEMS_ATTEMPT]: (state, { data: { items } }) => ({
        ...state,
        items
    }),
    [orderTypes.SET_SHIPPING_OPTION_SUCCESS]: (state, { data: option }) => ({
        ...state,
        selectedShippingOption: option
    })
});
