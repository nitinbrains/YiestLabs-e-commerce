const initialState = {
	username: 'goodbye',
	password: null,
	error: {message: null, code: null},
};

const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case "LOGIN_SUCCESS":
			return Object.assign({}, state, action)
		case "SET_USER_INFO":
			return Object.assign({}, state, action.UserInfo);
		case "LOGOUT":
			return { 
				...state, 
				username: null,
				password: null
			};
		default:
			return state;
	}
}

export default userReducer;