import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';

import user from './userReducer';
import inventory from './inventoryReducer';
import cart from './cartReducer';
import order from './orderReducer';
import messages from './messageReducer';
import loading from './loadingReducer';


export const rootReducer = combineReducers({
    user,
    inventory,
    order,
    cart,
    messages,
    form,
    loading
});
