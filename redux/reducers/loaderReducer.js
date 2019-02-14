import { createReducer } from '../../helpers/reduxHelpers';
import { inventoryTypes } from '../actions/inventoryActions';
import { calculatorTypes } from '../actions/calculatorActions';
import { orderTypes } from '../actions/orderActions';
import { cartTypes } from '../actions/cartActions';
import { userTypes } from '../actions/userActions';

const initialState = {
    isLoading: false,
    type: '',
};

export default createReducer(initialState, {
    // inventory
    [inventoryTypes.GET_INVENTORY_ATTEMPT]: (state, { data }) => ({
        isLoading: true,
        type: 'loadingInventory'
    }),
    [inventoryTypes.GET_INVENTORY_SUCCESS]: (state, { data }) => ({
        isLoading: false,
        type: ''
    }),
    [inventoryTypes.GET_INVENTORY_FAILURE]: (state, { data }) => ({
        isLoading: false,
        type: ''
    }),
    //order
    [orderTypes.PREPARE_ORDER_ATTEMPT]: (state, { data }) => ({
        isLoading: true,
        type: 'prepareOrder'        
    }),
    [orderTypes.PREPARE_ORDER_FAILURE]: (state, { data }) => ({
        isLoading: false,
        type: ''        
    }),
    [orderTypes.PREPARE_ORDER_SUCCESS]: (state, { data }) => ({
        isLoading: false,
        type: ''        
    }),
    [orderTypes.PLACE_ORDER_ATTEMPT]: (state, { data }) => ({
        isLoading: true,
        type: ''        
    }),
    [orderTypes.PLACE_ORDER_FAILURE]: (state, { data }) => ({
        isLoading: false,
        type: ''        
    }),
    [orderTypes.PLACE_ORDER_SUCCESS]: (state, { data }) => ({
        isLoading: false,
        type: ''        
    }),

    // user
    [userTypes.USER_LOGIN_ATTEMPT]: (state, { data }) => ({
        isLoading: true,
        type: 'userLogin'
    }),
    [userTypes.USER_LOGIN_SUCCESS]: (state, { data }) => ({
        isLoading: false,
        type: ''
    }),
    [userTypes.USER_LOGIN_FAILURE]: (state, { data }) => ({
        isLoading: false,
        type: ''
    }),
    // registration / create user
    [userTypes.CREATE_USER_ATTEMPT]: (state, { data }) => ({
        isLoading: true,
        type: 'createUser'
    }),
    [userTypes.CREATE_USER_SUCCESS]: (state, { data }) =>({
        isLoading: false,
        type: ''
    }),
    [userTypes.CREATE_USER_FAILURE]: (state, { data }) => ({
        isLoading: false,
        type: ''
    }),
    [userTypes.GET_USER_INFO_ATTEMPT]: (state, { data }) => ({
        isLoading: true,
        type: 'getUserInfo'
    }),
    [userTypes.GET_USER_INFO_SUCCESS]: (state, { data }) => ({
        isLoading: false,
        type: ''
    }),
    [userTypes.GET_USER_INFO_FAILURE]: (state, { data }) => ({
        isLoading: false,
        type: ''
    }),
    [userTypes.SET_USER_INFO_ATTEMPT]: (state, { data }) => ({
        isLoading: true,
        type: 'setUserInfo'
    }),
    [userTypes.SET_USER_INFO_SUCCESS]: (state, { data }) => ({
        isLoading: false,
        type: ''
    }),
    [userTypes.SET_USER_INFO_FAILURE]: (state, { data }) => ({
        isLoading: false,
        type: ''
    }),
    
});