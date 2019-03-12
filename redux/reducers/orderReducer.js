import { createReducer } from 'helpers/reduxHelpers';
import { orderTypes } from 'appRedux/actions/orderActions';
// import { userTypes } from 'appRedux/actions/userActions';

const initialState = {
	items: [],
    transitTimes: [],
    shipMethod: '',
    itemSub: 0,
    shippingSub: 0,
    orderSub: 0,
    shippingOptions: ["Ship All Together", "Earliest For Each", "Custom"],
    selectedShippingOption: 'Ship All Together',
    // isSuccess: false
};

/* ------------- Hookup Reducers To Types ------------- */

export default createReducer(initialState, {
    // [userTypes.CREATE_USER_SUCCESS]: (state) => ({
    //     isSuccess:true
    // }),
    [orderTypes.PREPARE_ORDER_SUCCESS]: (state, { data }) => ({
        ...data,
    }),
    [orderTypes.PLACE_ORDER_SUCCESS]: (state, { data }) => ({
        ...data,
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
