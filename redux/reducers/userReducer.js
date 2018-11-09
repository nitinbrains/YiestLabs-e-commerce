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
    [userTypes.USER_LOGIN_FAILURE]: () => null, // this will return initial state
    [userTypes.USER_LOGOUT_ATTEMPT]: () => null,    // this will return initial state
});
