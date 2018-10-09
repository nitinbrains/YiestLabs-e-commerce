const initialState = {
	username: '',
	password: '',
	billaddress1: "",
	billaddress2: "",
	billaddress3: "",
	billaddressee: "",
	billattn: "",
	billcity: "",
	billcountryid: "",
	billid: null,
	billzip: "",
	cards: [],
	cardsToRemove: [],
	category: "2",
	companyname: "XAbove It All YM TEST",
	connectedaccounts: [],
	currency: "1",
	email: "",
	id: null,
	otherAddresses: [],
	phone: "",
	shipaddress1: "",
	shipaddress2: "",
	shipaddress3: "",
	shipaddressee: "",
	shipattn: "",
	shipcity: "",
	shipcountryid: "",
	shipid: null,
	shipmethod: "",
	shipzip: "",
	subsidiary: "",
	terms: "",
	vat: "",
};

const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case "LOGIN_SUCCESS":
			return Object.assign({}, state, action)
		case "USER_INFO":
			return Object.assign({}, state, action.UserInfo);
		case "LOGOUT":
		default:
			return state;
	}
}

export default userReducer;