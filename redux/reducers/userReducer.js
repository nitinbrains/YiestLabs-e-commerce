import { createReducer } from '../../helpers/reduxHelpers';
import { userTypes } from '../actions/userActions';

/* ------------- Initial State ------------- */

const initialState = {
    id: null,
    username: '',
    password: '',
    cards: [],
    cardsToRemove: [],
    category: "",
    companyname: "",
    connectedaccounts: [],
    currency: "",
    email: "",
    otherAddresses: [],
    phone: "",
    shipping: [],
    selectedShipping: {
        address1: "",
        address2: "",
        address3: "",
        addressee: "",
        attn: "",
        city: "",
        countryid: "",
        zip: ""
    },
    billing: [],
    selectedBilling: {
        address1: "",
        address2: "",
        address3: "",
        addressee: "",
        attn: "",
        city: "",
        countryid: "",
        zip: "",
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
    isLoading: false,
    isUpdating: false,
}; // empty for now


/* ------------- Hookup Reducers To Types ------------- */

export default createReducer(initialState, {
    [userTypes.USER_LOGIN_ATTEMPT]: (state, { data }) => ({
        isLoading: true,
    }),
    [userTypes.USER_LOGIN_SUCCESS]: (state, { data }) => ({
        ...data,
        isLoading: false,
    }),
    [userTypes.USER_LOGIN_FAILURE]: () => null, // this will return initial state
    [userTypes.SET_USER_INFO_SUCCESS]: (state, { data: userInfo }) => ({
        ...userInfo
    }),
    [userTypes.UPDATE_USER_INFO_ATTEMPT]: (state, { data }) => ({
        isUpdating: true,
    }),
    [userTypes.UPDATE_USER_INFO_FAILURE]: (state, { data }) => ({
        isUpdating: false,
    }),
    [userTypes.UPDATE_USER_INFO_SUCCESS]: (state) => ({
        isUpdating: false,
    }),
    [userTypes.GET_USER_INFO_ATTEMPT]: (state, { data }) => ({
        isLoading: true,
    }),
    [userTypes.GET_USER_INFO_FAILURE]: (state, { data }) => ({
        isLoading: false,
    }),
    [userTypes.GET_USER_INFO_SUCCESS]: (state, { data }) => ({
        isLoading: false,
    }),    
    [userTypes.SET_CREDIT_CARD_SUCCESS]: (state, { data: { creditCard} }) => ({
        selectedCard: creditCard
    }),
    [userTypes.ADD_CREDIT_CARD_SUCCESS]: (state, {data: { cards, creditCard} }) => ({
        selectedCard: creditCard,
        cards
    }),
    [userTypes.SET_SHIP_ADDRESS_SUCCESS]: (state, { data }) => ({
        shipping: data
    }),
    [userTypes.SET_BILL_ADDRESS_SUCCESS]: (state, { data }) => ({
        billing: data
    }),
    [userTypes.SET_SHIP_METHOD_SUCCESS]: (state, { data }) => ({
        shipmethod: data
    }),

    [userTypes.USER_LOGOUT_ATTEMPT]: () => null,    // this will return initial state
});
