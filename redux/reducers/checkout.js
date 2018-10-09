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

const checkoutReducer = (state = initialState, action) => {
	switch (action.type) {
		case "SET_ORDER":
			return Object.assign({}, state, action.order);
		default:
			return state;
	}
}

export default checkoutReducer;