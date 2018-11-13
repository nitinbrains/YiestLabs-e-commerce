import { createReducer } from '../../helpers/reduxHelpers';
import { userTypes } from '../actions/userActions';

/* ------------- Initial State ------------- */

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
}; // empty for now


/* ------------- Hookup Reducers To Types ------------- */

export default createReducer(initialState, {
    [userTypes.USER_LOGIN_SUCCESS]: (state, { data }) => ({
        ...data
    }),
    [userTypes.SET_USER_INFO_ATTEMPT]: (state, { data: { userInfo } }) => ({
        ...userInfo
    }),
    [userTypes.SET_CREDIT_CARD_SUCCESS]: (state, {data: card}) => ({
        selectedCard: card
    }),
    [userTypes.ADD_CREDIT_CARD_SUCCESS]: (state, {data: { cards, creditCard} }) => ({
        selectedCard: creditCard,
        cards
    }),
    [userTypes.SET_BILL_ADDRESS_SUCCESS]: (state, { data }) => ({
        billing: data
    }),
    [userTypes.ADD_BILL_ADDRESS_SUCCESS]: (state, { data: { otherAddresses, billing } }) => ({
        billing,
        otherAddresses
    }),
    [userTypes.SET_SHIP_METHOD_SUCCESS]: (state, { data }) => ({
        shipmethod: data
    }),
    [userTypes.SET_SHIP_ADDRESS_SUCCESS]: (state, { data }) => ({
        shipping: data
    }),
    [userTypes.ADD_SHIP_ADDRESS_SUCCESS]: (state, { data: { otherAddresses, shipping } }) => ({
        otherAddresses,
        shipping
    }),
    [userTypes.USER_LOGIN_FAILURE]: () => null, // this will return initial state
    [userTypes.USER_LOGOUT_ATTEMPT]: () => null,    // this will return initial state
});
