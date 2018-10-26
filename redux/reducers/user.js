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
	switch (action.type) {
		case "LOGIN_SUCCESS":
			return {
				...state,
				username: action.username,
				password: action.password,
			}
		case "USER_INFO":
			return {
				...state,
				...action.UserInfo
			}
		case "CREDIT_CARD":
			return {
				...state,
				selectedCard: action.card
			}
		case "SHIP_METHOD":
			return {
				...state,
				shipmethod: action.shipmethod
			}
		case "SHIP_ADDRESS":
			return {
				...state,
				shipping: action.address
			}
		case "BILL_ADDRESS":
			return {
				...state,
				billing: action.address
			}
		case "LOGOUT":
		default:
			return state;
	}
}

export default userReducer;
