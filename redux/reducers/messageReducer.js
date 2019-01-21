import { createReducer } from '../../helpers/reduxHelpers';
import { messageTypes } from '../actions/messageActions';

const initialState = {
    messages: [],
    networkRequestError: false
};

const getType = (message, error) => {
    if (message != null) {
        return 'NOTIFICATION';
    } else if (error != null) {
        console.log('error message', error);
        return 'ERROR';
    }
    return 'UNDEFINED'
};

export default createReducer(initialState, {
    [messageTypes.DISPLAY_MESSAGE_ATTEMPT]: ({ messages }, { data: { title, message, error } }) =>{
        console.log(error,'to display error message message')
        return ({
        messages: [
            ...messages,
            {
                type: getType(message, error),
                title,
                message: message || error
            }
        ]
    })},
    [messageTypes.HIDE_MESSAGE_ATTEMPT]: ({ messages }, { data: idx }) => ({
        messages: messages.filter((message, index) => index !== idx)
    }),
    [messageTypes.SHOW_NETWORK_ERROR_ATTEMPT]: (state, { data:{ title, message, error } }) =>{ 
        console.log(title,message,error,'error message if any')
        return({
        networkRequestError: [{
            type : getType(message,error),
            title : title,
            message: message || error
        }] 
    })},
    [messageTypes.HIDE_NETWORK_ERROR_ATTEMPT]: (state ) => ({
        networkRequestError: false
    }),
});
