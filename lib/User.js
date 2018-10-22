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

	function getShipMethods() {
		return user.shipMethods;
	}

	function getUser() {
		return user;
	}

	function setUser(UserInfo) {
		Object.assign(user, UserInfo);
		user.shipMethods = Utils.shipMethodGroup(parseInt(user.subsidiary), user.shipmethod, user.shipping.countryid);
	}

	function setCreditCard(carjd) {

		// get default or first card in users account
		if(!card) {
            if(UserInfo.cards.length > 0)
            {
                var defaultCard = UserInfo.cards.find(c => c.default);
                if(defaultCard)
                {
                    selected = defaultCard;
                }
                else
                {
                    selectedCard = UserInfo.cards[0];
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
        setCreditCard: setCreditCard,
        getShipMethods: getShipMethods,
    }
})();

export default User;
