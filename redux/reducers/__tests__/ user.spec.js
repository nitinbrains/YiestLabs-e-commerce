import userReducer from '../userReducer';
import { userTypes } from '../../actions/userActions';
import { user } from '../../mocks';

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
    shipMethods: [],
    isLoading: false
};

const address = {
    addresee: "",
    address1: "test",
    address2: "test",
    address3: "test",
    addressee: "test",
    attn: "test",
    city: "Oregon",
    countryid: "US",
    id: 1,
    zip: "12000",
};


describe('testing of user reducer',() => {
    it('user login attempt set isLoading to true', () => {
        return expect(userReducer(initialState, {
            type: userTypes.USER_LOGIN_ATTEMPT
        })).toEqual({
            ...initialState,
            isLoading: true
        })
    });

    it('user login failure return initialState', () => {
        return expect(userReducer(initialState, {
            type: userTypes.USER_LOGIN_FAILURE
        })).toEqual(initialState)
    });

    it('user login success add new user properties to initialState', () => {
        return expect(userReducer(initialState, {
            type: userTypes.USER_LOGIN_SUCCESS, data: user
        })).toEqual({
            ...initialState,
            ...user,
            isLoading: false
        })
    });

    it('user logout attempt does not change initial state', () => {
        return expect(userReducer(initialState, {
            type: userTypes.USER_LOGOUT_ATTEMPT
        })).toEqual(initialState)
    });

    it('set user info success set new user properties to initialState', () => {
        return expect(userReducer(initialState, {
            type: userTypes.SET_USER_INFO_SUCCESS,
            data: user 
        })).toEqual({
            ...initialState,
            ...user,
            isLoading: false
        })
    });

    it('set credit card success updates current state with new data', () => {
        return expect(userReducer(user, {
            type: userTypes.SET_CREDIT_CARD_SUCCESS,
            data: {
                ...user,
                selectedCard: user.cards[0]
            }
        })).toEqual({
            ...user,
            selectedCard: user.cards[0]
        })
    });

    it('add credit card success set new cards and selectedCard to current state', () => {
        const today = new Date()
        today.setYear(today.getFullYear() + 1);
        const currentMonth = today.getMonth().toString();
        const currentYear = today.getFullYear().toString();
        const card = {
            name: 'visa test',
            number: '4111111111111111',
            expireMonth: currentMonth,
            expireYear: currentYear,
        };
        return expect(userReducer(user, {
            type: userTypes.SET_CREDIT_CARD_SUCCESS,
            data: {
                cards: [
                    ...user.cards,
                    card
                ],
                selectedCard: card
            }
        })).toEqual({
            ...user,
            cards: [
                ...user.cards,
                card
            ],
            selectedCard: card
        })
    });

    it('set bill address success set new billing to state', () => {
        return expect(userReducer(user, {
            type: userTypes.SET_BILL_ADDRESS_SUCCESS,
            data: 0
        })).toEqual({
            ...user,
            billing: 0
        })
    });

    it('add bill address success set new billing and otherAddresses to state', () => {
        const otherAddresses = [
            ...user.otherAddresses,
            address
        ];
        return expect(userReducer(user, {
            type: userTypes.ADD_BILL_ADDRESS_SUCCESS,
            data: {
                billing: address,
                otherAddresses
            }
        })).toEqual({
            ...user,
            billing: address,
            otherAddresses
        })
    });

    it('set ship method success set new shipmethod to state', () => {
        return expect(userReducer(user, {
            type: userTypes.SET_SHIP_METHOD_SUCCESS,
            data: 0
        })).toEqual({
            ...user,
            shipmethod: 0
        })
    });

    it('set ship address success set new shipping to state', () => {
        return expect(userReducer(user, {
            type: userTypes.SET_SHIP_ADDRESS_SUCCESS,
            data: address
        })).toEqual({
            ...user,
            shipping: address
        })
    });

    it('add ship address success set new shipping and otherAddresses to state', () => {
        const otherAddresses = [
            ...user.otherAddresses,
            address
        ];
        return expect(userReducer(user, {
            type: userTypes.ADD_SHIP_ADDRESS_SUCCESS,
            data: {
                shipping: address,
                otherAddresses
            }
        })).toEqual({
            ...user,
            shipping: address,
            otherAddresses
        })
    });

    it('set ship address success set new shipping to state', () => {
        return expect(userReducer(initialState, {
            type: userTypes.USER_LOGOUT_ATTEMPT
        })).toEqual({
            ...initialState
        })
    });
});
