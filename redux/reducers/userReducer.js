import { createReducer } from '../../helpers/reduxHelpers';
import { userTypes } from '../actions/userActions';

/* ------------- Initial State ------------- */

const initialState = {
    id: null,
    username: '',
    password: '',
    cardsToRemove: [],
    category: "",
    companyname: "",
    connectedaccounts: [],
    currency: "",
    email: "",
    phone: "",
    shipping: {
        address1: "",
        address2: "",
        address3: "",
        addressee: "",
        attn: "",
        city: "",
        countryid: "",
        zip: ""
    },
    billing: {
        address1: "",
        address2: "",
        address3: "",
        addressee: "",
        attn: "",
        city: "",
        countryid: "",
        zip: "",
    },
    otherAddresses: [],
    shipmethod: "",
    shipzip: "",
    subsidiary: "",
    terms: "",
    vat: "",
    card: {
        id: '',
        ccnumber: '',
        ccname: '',
        ccexpire: '',
        type: '',
        default: false
    },
    otherCards: [],
    shipMethods: [],
    isLoading: false,
    orderHistory: [],
    isUnsaved: false,
    subsidiaryOptions: []
}; // empty for now


/* ------------- Hookup Reducers To Types ------------- */

export default createReducer(initialState, {
    [userTypes.USER_LOGIN_SUCCESS]: (state, { data }) => ({
        ...data,
    }),
    [userTypes.USER_LOGIN_FAILURE]: () => null, // this will return initial state
    [userTypes.SET_USER_INFO_SUCCESS]: (state, { data: userInfo }) => ({
        ...userInfo
    }),
    [userTypes.UPDATE_USER_INFO_ATTEMPT]: (state, { data }) => ({
        isLoading: true,
    }),
    [userTypes.UPDATE_USER_INFO_FAILURE]: (state, { data }) => ({
        isLoading: false,
    }),
    [userTypes.UPDATE_USER_INFO_SUCCESS]: (state) => ({
        isLoading: false,
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
    [userTypes.UNSAVED_USER_INFO_ATTEMPT]: (state, { data }) => ({
        isUnsaved: true
    }),
    [userTypes.UNSAVED_USER_CLOSE_ATTEMPT]: (state, { data }) => ({
        isUnsaved: false
    }),
    [userTypes.SET_CREDIT_CARD_SUCCESS]: (state, { data: { creditCard} }) => ({
        card: creditCard
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
    [userTypes.GET_ORDER_HISTORY_ATTEMPT]: (state, { data }) => ({
        isLoading: true,
    }),
    [userTypes.GET_ORDER_HISTORY_FAILURE]: (state, { data }) => ({
        isLoading: false,
    }),
    [userTypes.GET_ORDER_HISTORY_SUCCESS]: (state, { data: { orderHistory }}) => ({
        isLoading: false,
        orderHistory
    }),
    [userTypes.USER_LOGOUT_ATTEMPT]: () => {
        sessionStorage.clear();
        return null
    },    // this will return initial state
});
