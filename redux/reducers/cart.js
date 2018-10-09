const initialState = {
	items: []
};

const cartReducer = (state = initialState, action) => {
	switch (action.type) {
		case "ADD_ITEM":
		case "REMOVE_ITEM":
		case "QUANTITY_CHANGE":
			return {
				...state,
				items: action.items
			}
		default:
			return state;
	}
}

export default cartReducer;