const initialState = {
	items: [],
	error: null
};

const storeReducer = (state = initialState, action) => {
	switch (action.type) {
		case "STORE_SUCCESS":
			return { 
				...state,
				items: action.items,
			};
		default:
			return state;
	}
}

export default storeReducer