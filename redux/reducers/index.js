import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import user from './userReducer';
import inventory from './inventory';
import cart from './cart';


export const rootReducer = combineReducers({
    user,
    inventory,
    cart,
    form
});
