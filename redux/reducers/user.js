const initialState = {
	username: '',
	password: '',
	cards: [],
	cardsToRemove: [],
	category: "",
	companyname: "",
	connectedaccounts: [],
	currency: "",
	email: "",
	id: null,
	otherAddresses: [],
	phone: "",
	shipping: {
		id: null,
		address1: "",
		address2: "",
		address3: "",
		addressee: "",
		attn: "",
		city: "",
		countryid: "",
	},
	billing: {
		id: null,
		address1: "",
		address2: "",
		address3: "",
		addressee: "",
		attn: "",
		city: "",
		countryid: "",
	},
	shipmethod: "",
	shipzip: "",
	subsidiary: "",
	terms: "",
	vat: "",
	selectedCard: {
		id: '',
		ccnumber: '',
		ccname: '',
		ccexpire: '',
		type: '',
		default: false		
	},
	shipMethods: []
};

const userReducer = (state = initialState, action) => {
	var newState = state;
	switch (action.type) {
		case "LOGIN_SUCCESS":
			return Object.assign({}, state, action)
		case "USER_INFO":
			return Object.assign({}, state, action.UserInfo);
		case "SET_CREDIT_CARD":
			newState.selectedCard = action.card;
			return newState;
		case "LOGOUT":
		default:
			return state;
	}
}

export default userReducer;