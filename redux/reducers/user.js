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
		number: '',
		name: '',
		expireMonth: '',
		expireYear: '',
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
				selectedCard: action.creditCard
			}
		case "SHIP_METHOD_SET":
			return {
				...state,
				shipmethod: action.shipmethod
			}
		case "SHIP_ADDRESS_SET":
			return {
				...state,
				shipping: action.address
			}
		case "BILL_ADDRESS_SET":
			return {
				...state,
				billing: action.address
			}
		case "SHIP_ADDRESS_ADD":
			return {
				...state,
				shipping: action.shipping,
				otherAddresses: action.otherAddresses
			}
		case "BILL_ADDRESS_ADD":
			return {
				...state,
				billing: action.billing,
				otherAddresses: action.otherAddresses
			}
		case "CREDIT_CARD_ADD":
			return {
				...state,
				selectedCard: action.creditCard,
				cards: action.cards
			}
		case "LOGOUT":
		default:
			return state;
	}
}

export default userReducer;
