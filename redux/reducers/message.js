const initialState = {
	messages: []
};

const messageReducer = (state = initialState, action) => {

	var messages = [...state.messages]

	switch (action.type) {

		case "SHOW_MESSAGE":
			messages.push(action.message);
			return {
				...state,
				messages
			} ;
		case "HIDE_MESSAGE":
			messages.splice(action.index, 1);
			return {
				...state,
				messages
			};
		default:
			return state;
	}
}

export default messageReducer;
