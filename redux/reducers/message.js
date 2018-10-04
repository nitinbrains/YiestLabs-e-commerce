const initialState = {
	errorMessage: {
		details: "Some error",
		type: null, 
		code: null
	},
	displayMessage: {
		details: null,
		title: null,
	}
};

const messageReducer = (state = initialState, action) => {
	switch (action.type) {
		case "DISPLAY_ERROR":
			return { 
				...state,
				errorMessage: {
					details: action.error.message,
					type: action.error.type,
					code: action.error.code
				}
			};
		case "HIDE_ERROR":
			return { 
				...state,
				errorMessage: {
					details: null,
					type: null,
					code: null
				}
			};
		case "DISPLAY_MESSAGE":
			return { 
				...state,
				displayMessage: {
					details: action.displayMessage.message,
					title : action.displayMessage.title
				}
			};
		case "HIDE_MESSAGE":
			return { 
				...state,
				displayMessage: {
					details: null,
					title : null
				}
			};
		default:
			return state;
	}
}

export default messageReducer;