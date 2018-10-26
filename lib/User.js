import SalesLib from './SalesLib';
import Utils from './Utils';

var User = (function() {

	var user = {
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
	}

	function getUser() {
		return user;
	}

	function setUser(UserInfo) {
		Object.assign(user, UserInfo);
		user.shipMethods = Utils.shipMethodGroup(parseInt(user.subsidiary), user.shipmethod, user.shipping.countryid);
	}

	function getShipMethods() {
		return user.shipMethods;
	}

	function setShipMethod(shipmethod) {
		shipmethod = shipmethod;
	}

	function setShipAddress(index) {
		var otherAddresses = user.otherAddresses;

		//bounds checking
		if(index < 0 || index >= otherAddresses.length)
			throw {message: 'Index out of bounds. Could not set shipping address', code: 0}


		user.shipping = otherAddresses[index];

		return user.shipping;
	}

	function setBillAddress(index) {
		var otherAddresses = user.otherAddresses;

		//bounds checking
		if(index < 0 || index >= otherAddresses.length)
			throw {message: 'Index out of bounds. Could not set billing address', code: 0}


		user.billing = otherAddresses[index];

		return user.billing;
	}

	function setCreditCard(card) {

		// get default or first card in users account if card not specified
		if(!card) {
            if(user.cards.length > 0)
            {
                var defaultCard = user.cards.find(c => c.default);
                if(defaultCard)
                {
                    selected = defaultCard;
                }
                else
                {
                    selectedCard = user.cards[0];
                }
            }
		} else {
			selectedCard = card;
		}

		return selectedCard;
	}

 	return {
		getUser: getUser,
		setUser: setUser,
		getShipMethods: getShipMethods,
		setShipMethod: setShipMethod,
		setShipAddress: setShipAddress,
		setBillAddress: setBillAddress,
		setCreditCard: setCreditCard
    }
})();

export default User;
