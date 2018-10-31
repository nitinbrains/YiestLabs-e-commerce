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
			number: '',
			name: '',
			expireMonth: '',
			expireYear: '',
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
		setCreditCard();
		return user;
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

	function setCreditCard(index) {

		// get default or first card in users account if card not specified

		if(!isNaN) {
			user.selectedCard = user.cards[index];
		}
		else if(user.cards.length > 0)
		{
			var defaultCard = user.cards.find(c => c.default);
			if(defaultCard)
			{
				user.selectedCard = defaultCard;
			}
			else
			{
				user.selectedCard = user.cards[0];
			}
		}
		else {
			return null
		}

		return user.selectedCard;
	}

	function addShipAddress(address) {
		user.otherAddresses.push(address);
		user.shipping = address;
		user.shipping.id = 1; // TESTING
		return { shipping: user.shipping, otherAddresses: user.otherAddresses };
	}

	function addBillAddress(address) {
		user.otherAddresses.push(address);
		user.billing = address;
		user.billing.id = 1;  // TESTING
		return { billing: user.billing, otherAddresses: user.otherAddresses };

	}

	function addCreditCard(card) {

		var expireDate = new Date(card.expireYear, card.expireMonth, 1, 0, 0, 0, 0);
		var today = new Date();

		if(!card.name) {
			throw {message: 'Please enter a name for the credit card', code: 0};
		} else if (!card.number) {
			throw {message: 'Please enter a credit card number', code: 0};
		} else if (!card.expireMonth) {
			throw {message: 'Please enter an expiration month for the credit card', code: 0};
		} else if (!card.expireYear) {
			throw {message: 'Please enter an expiration year for the credit card', code: 0};
		} else if(expireDate < today){
			throw {message: 'Your credit card expiration date has already passed', code: 0};
		}

		card.id = 1 // TESTING
		user.cards.push(card);
		user.selectedCard = card;
		return { creditCard: user.selectedCard, cards: user.cards };
	}

 	return {
		getUser: getUser,
		setUser: setUser,
		getShipMethods: getShipMethods,
		setShipMethod: setShipMethod,
		setShipAddress: setShipAddress,
		setBillAddress: setBillAddress,
		setCreditCard: setCreditCard,
		addShipAddress: addShipAddress,
		addBillAddress: addBillAddress,
		addCreditCard: addCreditCard
    }
})();

export default User;
