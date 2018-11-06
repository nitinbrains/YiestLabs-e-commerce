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

const checkoutReducer = (state = initialState, action) => {
	switch (action.type) {
		case "SET_ORDER":
			return {
				...state,
				...action.order
			}
		case "ITEMS":
			return {
				...state,
				items: action.items
			}
		case "SHIPPING_OPTION":
			return {
				...state,
				selectedShippingOption: action.option,
				items: action.items
			}

		default:
			return state;
	}
}

export default checkoutReducer;
