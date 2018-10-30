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
	orderSub: 0
};

/* ------------- Hookup Reducers To Types ------------- */

export default createReducer(initialState, {
    [orderTypes.PLACE_ORDER_SUCCESS]: (state, { data }) => ({
        ...data
    })
});
