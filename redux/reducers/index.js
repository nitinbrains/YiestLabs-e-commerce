import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import user from './userReducer';
import inventory from './inventory'; // need to refactor this
import cart from './cartReducer';
import messages from './messageReducer';


export const rootReducer = combineReducers({
    user,
    inventory,
    cart,
    messages,
    form
});
