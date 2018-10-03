const initialState = {
	items: [],
	categoriesLoaded: [],
	error: null
};

const inventoryReducer = (state = initialState, action) => {
	switch (action.type) {
		case "STORE_SUCCESS":
			return { 
				...state,
				items: action.items,
				categoriesLoaded: [...state.categoriesLoaded, ...action.loadCategories]
			};
		default:
			return state;
	}
}

export default inventoryReducer