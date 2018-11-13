import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import user from './userReducer';
import inventory from './inventoryReducer';
import cart from './cartReducer';
import checkout from './orderReducer';
import messages from './messageReducer';


export const rootReducer = combineReducers({
    user,
    inventory,
    checkout,
    cart,
    messages,
    form
});
