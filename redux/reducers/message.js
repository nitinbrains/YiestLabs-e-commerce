const initialState = {
	error: {
		message: null,
		type: null, 
		code: null
	},
	displayMessage: {
		message: null
		title: null,
	}
};

const messageReducer = (state = initialState, action) => {
	switch (action.type) {
		case "DISPLAY_ERROR":
			return { 
				...state,
				error: {
					message: action.error.message,
					type: action.error.type,
					code: action.error.code
				}
			};
		case "HIDE_ERROR":
			return { 
				...state,
				error: {
					message: null,
					type: null,
					code: null
				}
			};
		case "DISPLAY_MESSAGE":
			return { 
				...state,
				displayMessage: {
					message: action.displayMessage.message,
					title : action.displayMessage.title
				}
			};
		case "HIDE_MESSAGE":
			return { 
				...state,
				displayMessage: {
					message: null,
					title : null
				}
			};
		default:
			return state;
	}
}

export default userReducer;